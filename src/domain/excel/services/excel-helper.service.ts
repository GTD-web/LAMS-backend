import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';

/**
 * 엑셀 헬퍼 도메인 서비스
 * - 엑셀 데이터 변환 및 가공
 * - 한글 키 번역, 데이터 추출, 날짜 처리
 */
@Injectable()
export class ExcelHelperService {
    private readonly logger = new Logger(ExcelHelperService.name);

    /**
     * 한글 키를 영문 키로 번역
     */
    private translateKeys(obj: any): any {
        const koreanToEnglish = {
            // 출입 이벤트
            위치: 'location',
            발생시각: 'eventTime',
            장치명: 'deviceName',
            상태: 'status',
            카드번호: 'cardNumber',
            이름: 'name',
            사원번호: 'employeeNumber',
            근무조: 'workShift',
            조직: 'department',
            직급: 'position',
            생성구분: 'eventType',
            생성시간: 'creationTime',
            생성자: 'creator',
            생성내용: 'details',
            사진유무: 'photoAvailable',
            비고: 'remarks',
            '출입(발열/마스크)': 'entryCheck',
            // 근태
            기간: 'period',
            신청일수: 'requestDays',
            근태구분: 'type',
            ERP사번: 'employeeNumber',
            부서: 'department',
        };

        const translated = {};
        Object.keys(obj).forEach((key) => {
            const translatedKey = koreanToEnglish[key] || key;
            translated[translatedKey] = obj[key];
        });

        return translated;
    }

    /**
     * 출입 이벤트 엑셀 파일 읽기
     */
    readEventHistoriesExcelFile(rawExcelData: any[]): {
        year: string;
        month: string;
        extractedEmployeeInfoList: any[];
        extractEventList: any[];
        departmentInfoList: string[];
    } {
        try {
            let extractEventList: any[] = [];
            let extractedEmployeeInfoList: any[] = [];
            const departmentInfoSet = new Set<string>();

            const data = rawExcelData.map((row) => this.translateKeys(row));

            // 데이터 년월 추출
            const year = data[0].eventTime.split('-')[0];
            const month = data[0].eventTime.split('-')[1];

            // 사원의 출입 정보를 추출 및 합병
            extractedEmployeeInfoList = data.reduce((acc, row) => {
                if (!acc[row.employeeNumber]) {
                    const employeeInfo = {
                        department: row.department,
                        name: row.name,
                        employeeNumber: row.employeeNumber + '',
                        events: [],
                    };

                    acc[row.employeeNumber] = employeeInfo;
                }

                const [yyyymmdd, hhmmss] = row.eventTime.split(' ');

                const event = {
                    employeeName: row.name,
                    employeeNumber: row.employeeNumber,
                    status: row.status,
                    eventTime: row.eventTime,
                    yyyymmdd,
                    hhmmss,
                };

                acc[row.employeeNumber].events.push(event);

                return acc;
            }, []);

            // 이벤트만 분리
            extractEventList = extractedEmployeeInfoList.reduce((acc, employee) => {
                acc.push(...employee.events);
                return acc;
            }, []);

            // 부서 정보를 set에 추가
            extractedEmployeeInfoList.map((employee) => {
                departmentInfoSet.add(employee.department);
            });

            this.logger.log(
                `출입 이벤트 데이터 처리 완료: ${extractEventList.length}개 이벤트, ${extractedEmployeeInfoList.length}명 직원`,
            );

            return {
                year,
                month,
                extractedEmployeeInfoList,
                extractEventList,
                departmentInfoList: Array.from(departmentInfoSet),
            };
        } catch (error) {
            this.logger.error('엑셀 데이터를 읽는 중 오류가 발생했습니다.', error.stack);
            throw new InternalServerErrorException('엑셀 데이터를 읽는 중 오류가 발생했습니다.');
        }
    }

    /**
     * 근태 데이터 처리
     */
    processAttendanceData(data: any[]): {
        extractedEmployeeInfoList: any[];
        departments: string[];
    } {
        try {
            const setDepartment = new Set<string>();
            const employeeInfoSet = new Set<any>();

            data.forEach((record) => {
                let employeeInfo = Array.from(employeeInfoSet).find((e) => e.employeeNumber === record['ERP사번']);

                if (!employeeInfo) {
                    employeeInfo = {
                        department: record['부서'],
                        name: record['이름'],
                        employeeNumber: record['ERP사번'],
                        attendanceRecords: [],
                    };
                    employeeInfoSet.add(employeeInfo);
                }

                setDepartment.add(employeeInfo.department);

                const attendanceRecord = {
                    period: record['기간'],
                    requestDays: record['신청일수'],
                    type: record['근태구분'],
                };

                employeeInfo.attendanceRecords.push(attendanceRecord);
            });

            this.logger.log(
                `근태 데이터 처리 완료: ${Array.from(employeeInfoSet).length}명 직원, ${
                    Array.from(setDepartment).length
                }개 부서`,
            );

            return {
                extractedEmployeeInfoList: Array.from(employeeInfoSet),
                departments: Array.from(setDepartment) as string[],
            };
        } catch (error) {
            this.logger.error('엑셀 데이터를 읽는 중 오류가 발생했습니다.', error.stack);
            throw new BadRequestException('엑셀 데이터를 읽는 중 오류가 발생했습니다. 파일을 확인하시기 바랍니다.');
        }
    }

    /**
     * 직원 번호별로 엑셀 데이터 추출
     */
    extractExcelDataByEmployeeNumber(rawExcelData: any[], type: 'event' | 'attendance', employeeInfoMap?: any): any {
        const extractedEmployeeInfoMap: any = employeeInfoMap ?? {};

        rawExcelData.forEach((row) => {
            const rowData = this.translateKeys(row);

            if (!extractedEmployeeInfoMap[rowData.employeeNumber]) {
                const employeeInfo = {
                    department: '',
                    name: rowData.name,
                    employeeNumber: rowData.employeeNumber + '',
                    events: [],
                    attendanceRecords: [],
                };
                extractedEmployeeInfoMap[rowData.employeeNumber] = employeeInfo;
            }

            if (type === 'event') {
                const [yyyymmdd, hhmmss] = rowData.eventTime.split(' ');
                const event = {
                    employeeName: rowData.name,
                    employeeNumber: rowData.employeeNumber + '',
                    status: rowData.status,
                    eventTime: rowData.eventTime,
                    yyyymmdd,
                    hhmmss,
                };
                extractedEmployeeInfoMap[rowData.employeeNumber].events.push(event);
            }

            if (type === 'attendance') {
                const attendanceRecord = {
                    period: rowData.period,
                    requestDays: rowData.requestDays,
                    type: rowData.type,
                };
                extractedEmployeeInfoMap[rowData.employeeNumber].attendanceRecords.push(attendanceRecord);
            }
        });

        this.logger.debug(`엑셀 데이터 추출 완료: ${Object.keys(extractedEmployeeInfoMap).length}명 직원`);

        return extractedEmployeeInfoMap;
    }

    /**
     * 날짜 범위 생성
     */
    generateDateRange(start: Date, end: Date): Date[] {
        const dates = [];
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            dates.push(new Date(date));
        }
        return dates;
    }

    /**
     * 휴일 또는 주말 여부 확인
     */
    isHolidayOrWeekend(date: Date, holidaySet: Set<string>): boolean {
        const formattedDate = this.formatDate(date);
        return holidaySet.has(formattedDate) || date.getDay() === 0 || date.getDay() === 6;
    }

    /**
     * 기간 문자열을 시작일/종료일로 분리
     */
    dividePeriod(period: string): { startDate: Date; endDate: Date } {
        const [startDateStr, endDateStr] = period.split(' ~ ');

        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        return {
            startDate,
            endDate,
        };
    }

    /**
     * Date 객체를 yyyy-MM-dd 형식으로 변환
     */
    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * 휴일 정보를 Set으로 변환
     */
    createHolidaySet(holidayInfoEntities: any[]): Set<string> {
        return new Set(holidayInfoEntities.map((h) => h.holidayDate));
    }

    /**
     * 사용 근태 데이터 정렬
     */
    async sortUsedAttendanceData(
        extractedEmployeeInfoList: any[],
        employeeInfoEntities: any[],
        holidays: any[],
        attendanceTypeEntities: any[],
    ): Promise<any[]> {
        const employeeMap = new Map(employeeInfoEntities.map((e) => [e.employeeNumber, e]));
        const attendanceTypeMap = new Map(attendanceTypeEntities.map((a) => [a.title, a]));
        const holidaySet = new Set(holidays.map((h) => h.holidayDate));

        const result = extractedEmployeeInfoList.flatMap(({ employeeNumber, attendanceRecords }) => {
            const employeeInfoEntity = employeeMap.get(employeeNumber);

            if (!employeeInfoEntity) {
                this.logger.warn(`존재하지 않는 직원: ${employeeNumber}`);
                return [];
            }

            return attendanceRecords.flatMap((record) => {
                const attendanceTypeEntity = attendanceTypeMap.get(record.type);
                if (!attendanceTypeEntity) {
                    this.logger.warn(`존재하지 않는 근태 구분: ${record.type}`);
                    return [];
                }

                const { startDate, endDate } = this.dividePeriod(record.period);
                const dates = this.generateDateRange(startDate, endDate);

                return dates
                    .filter((date) => !this.isHolidayOrWeekend(date, holidaySet))
                    .map((date) => ({
                        employeeId: employeeInfoEntity.employeeId,
                        attendanceTypeId: attendanceTypeEntity.attendanceTypeId,
                        usedAt: this.formatDate(date),
                    }));
            });
        });

        this.logger.log(`사용 근태 데이터 정렬 완료: ${result.length}개 레코드`);
        return result;
    }
}
