import { Injectable, Logger } from '@nestjs/common';
import { ExcelHelperService } from '../../domain/excel/services/excel-helper.service';
import { HolidayDomainService } from '../../domain/holiday/services/holiday-domain.service';
import { AttendanceTypeDomainService } from '../../domain/attendance-type/services/attendance-type-domain.service';

/**
 * 엑셀 컨텍스트 서비스
 * - 엑셀 처리 관련 도메인 서비스들을 조합
 * - 엑셀 데이터 처리 워크플로우 관리
 */
@Injectable()
export class ExcelContextService {
    private readonly logger = new Logger(ExcelContextService.name);

    constructor(
        private readonly excelHelperService: ExcelHelperService,
        private readonly holidayDomainService: HolidayDomainService,
        private readonly attendanceTypeDomainService: AttendanceTypeDomainService,
    ) {}

    /**
     * 엑셀 파일에서 출입 이벤트 데이터를 추출한다
     */
    async 엑셀_파일에서_출입_이벤트_데이터를_추출한다(rawExcelData: any[]): Promise<{
        year: string;
        month: string;
        extractedEmployeeInfoList: any[];
        extractEventList: any[];
        departmentInfoList: string[];
    }> {
        return this.excelHelperService.readEventHistoriesExcelFile(rawExcelData);
    }

    /**
     * 엑셀 파일에서 근태 데이터를 추출한다
     */
    async 엑셀_파일에서_근태_데이터를_추출한다(rawExcelData: any[]): Promise<{
        extractedEmployeeInfoList: any[];
        departments: string[];
    }> {
        return this.excelHelperService.processAttendanceData(rawExcelData);
    }

    /**
     * 직원 번호별로 엑셀 데이터를 추출한다
     */
    async 직원_번호별로_엑셀_데이터를_추출한다(
        rawExcelData: any[],
        type: 'event' | 'attendance',
        employeeInfoMap?: any,
    ): Promise<any> {
        return this.excelHelperService.extractExcelDataByEmployeeNumber(rawExcelData, type, employeeInfoMap);
    }

    /**
     * 사용 근태 데이터를 정렬한다
     */
    async 사용_근태_데이터를_정렬한다(
        extractedEmployeeInfoList: any[],
        employeeInfoEntities: any[],
        year: string,
    ): Promise<any[]> {
        // 휴일 정보 조회
        const holidays = await this.holidayDomainService.findHolidaysByYear(year);

        // 근무 유형 정보 조회
        const attendanceTypes = await this.attendanceTypeDomainService.findAllAttendanceTypes();

        return await this.excelHelperService.sortUsedAttendanceData(
            extractedEmployeeInfoList,
            employeeInfoEntities,
            holidays,
            attendanceTypes,
        );
    }

    /**
     * 날짜 범위를 생성한다
     */
    async 날짜_범위를_생성한다(startDate: Date, endDate: Date): Promise<Date[]> {
        return this.excelHelperService.generateDateRange(startDate, endDate);
    }

    /**
     * 휴일 정보를 Set으로 변환한다
     */
    async 휴일_정보를_Set으로_변환한다(year: string): Promise<Set<string>> {
        const holidays = await this.holidayDomainService.findHolidaysByYear(year);
        return this.excelHelperService.createHolidaySet(holidays);
    }

    /**
     * 기간 문자열을 시작일과 종료일로 분리한다
     */
    async 기간_문자열을_분리한다(period: string): Promise<{ startDate: Date; endDate: Date }> {
        return this.excelHelperService.dividePeriod(period);
    }
}
