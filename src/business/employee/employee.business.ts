import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EmployeeDomainService } from '@src/domain/organization/employee/services/employee-domain.service';
import { EmployeeInfoEntity } from '@src/domain/organization/employee/entities/employee-info.entity';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { UpdateEmployeeEntryAtDto, UpdateEmployeeQuitedAtDto } from './dto/requests/employee-request.dto';

/**
 * 직원 비즈니스 서비스
 * - 직원 관련 비즈니스 로직을 처리
 * - 필드 검증 및 비즈니스 규칙 적용
 * - 도메인 서비스와 인터페이스 계층 간의 중재 역할
 */
@Injectable()
export class EmployeeBusinessService {
    private readonly logger = new Logger(EmployeeBusinessService.name);

    constructor(
        private readonly employeeDomainService: EmployeeDomainService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    /**
     * 퇴사일 입력 - 비즈니스 크리티컬: 로그 필요
     */
    async inputQuitedAt(
        employeeId: string,
        dto: UpdateEmployeeQuitedAtDto,
    ): Promise<{ employeeInfoEntity: EmployeeInfoEntity; beforeEmployee: EmployeeInfoEntity }> {
        const employee = await this.employeeDomainService.findEmployeeById(employeeId);
        if (!employee) {
            throw new NotFoundException('직원을 찾을 수 없습니다.');
        }

        // 비즈니스 규칙 검증: 퇴사일이 입사일 이후인지 확인
        if (employee.entryAt && dto.quitedAt < employee.entryAt) {
            throw new BadRequestException('퇴사일은 입사일 이후여야 합니다.');
        }

        const result = await this.employeeDomainService.updateEmployeeDates(employeeId, { quitedAt: dto.quitedAt });
        this.logger.log(
            `퇴사일 입력 완료: ${employee.employeeName}(${employee.employeeNumber}) - 퇴사일: ${dto.quitedAt}`,
        );
        return result;
    }

    /**
     * 입사일 입력 - 비즈니스 크리티컬: 로그 필요
     */
    async inputEntryAt(
        employeeId: string,
        dto: UpdateEmployeeEntryAtDto,
    ): Promise<{ employeeInfoEntity: EmployeeInfoEntity; beforeEmployee: EmployeeInfoEntity }> {
        const employee = await this.employeeDomainService.findEmployeeById(employeeId);
        if (!employee) {
            throw new NotFoundException('직원을 찾을 수 없습니다.');
        }

        // 비즈니스 규칙 검증: 입사일이 퇴사일 이전인지 확인
        if (employee.quitedAt && dto.entryAt > employee.quitedAt) {
            throw new BadRequestException('입사일은 퇴사일 이전이어야 합니다.');
        }

        const result = await this.employeeDomainService.updateEmployeeDates(employeeId, { entryAt: dto.entryAt });
        this.logger.log(
            `입사일 입력 완료: ${employee.employeeName}(${employee.employeeNumber}) - 입사일: ${dto.entryAt}`,
        );
        return result;
    }

    /**
     * 직원 제외 토글 - 비즈니스 크리티컬: 로그 필요
     */
    async excludeEmployeeToggle(employeeId: string): Promise<EmployeeInfoEntity> {
        const employee = await this.employeeDomainService.findEmployeeById(employeeId);
        if (!employee) {
            throw new NotFoundException('직원을 찾을 수 없습니다.');
        }

        const result = await this.employeeDomainService.toggleExcludeEmployee(employee);
        this.logger.log(
            `직원 제외 토글 완료: ${employee.employeeName}(${employee.employeeNumber}) - 제외 여부: ${result.isExcludedFromCalculation}`,
        );
        return result;
    }

    /**
     * 생일 입력 - 비즈니스 크리티컬: 로그 필요
     */
    async inputBirthday(employeeId: string, birthDate: string): Promise<EmployeeInfoEntity> {
        // 날짜 형식 검증
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(birthDate)) {
            throw new BadRequestException('생년월일은 YYYY-MM-DD 형식이어야 합니다.');
        }

        const employee = await this.employeeDomainService.findEmployeeById(employeeId);
        if (!employee) {
            throw new NotFoundException('직원을 찾을 수 없습니다.');
        }

        const result = await this.employeeDomainService.updateBirthDate(employeeId, birthDate);
        this.logger.log(`생일 입력 완료: ${employee.employeeName}(${employee.employeeNumber}) - 생일: ${birthDate}`);
        return result;
    }

    /**
     * 직원 삭제 - 비즈니스 크리티컬: 로그 필요
     */
    async deleteEmployee(employeeId: string): Promise<boolean> {
        const employee = await this.employeeDomainService.findEmployeeById(employeeId);
        if (!employee) {
            throw new NotFoundException('직원을 찾을 수 없습니다.');
        }

        const result = await this.employeeDomainService.deleteEmployee(employeeId);
        this.logger.log(`직원 삭제 완료: ${employee.employeeName}(${employee.employeeNumber})`);
        return result;
    }

    /**
     * 사번으로 직원 조회 - 단순 조회: 로그 불필요
     */
    async getEmployeeByEmployeeNumber(employeeNumber: string): Promise<EmployeeInfoEntity> {
        const employee = await this.employeeDomainService.findEmployeeByEmployeeNumber(employeeNumber);
        if (!employee) {
            throw new NotFoundException('직원을 찾을 수 없습니다.');
        }

        return employee;
    }

    /**
     * 직원 목록 조회 (페이지네이션) - 단순 조회: 로그 불필요
     */
    async getEmployees(query: PaginationQueryDto): Promise<{ employees: EmployeeInfoEntity[]; total: number }> {
        const result = await this.employeeDomainService.findAllEmployees(query);
        return result;
    }

    // /**
    //  * 연차 생성 또는 업데이트
    //  */
    // private async createOrUpdateAnnualLeave(employeeId: string, year: number): Promise<void> {
    //     return new Promise((resolve) => {
    //         this.eventEmitter.emit('annual-leave.create', { employeeId, year });

    //         // 이벤트 핸들러가 작업을 완료했음을 알리는 이벤트를 기다립니다.
    //         this.eventEmitter.once(`annual-leave.created.${employeeId}.${year}`, () => {
    //             resolve();
    //         });
    //     });
    // }

    /**
     * 날짜 범위 생성 유틸리티
     */
    generateDateRange(date1: string, date2: string): { dates: string[]; months: [string, string][] } {
        const dates: string[] = [];
        const months: [string, string][] = [];

        // 시작일과 종료일 결정 (문자열 비교)
        const [startDate, endDate] = date1 > date2 ? [date2, date1] : [date1, date2];
        const [startYear, startMonth, startDay] = startDate.split('-');
        const [endYear, endMonth] = endDate.split('-');

        // 일자 단위 처리
        let year = parseInt(startYear);
        let month = parseInt(startMonth);
        let day = parseInt(startDay);

        while (`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` <= endDate) {
            dates.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);

            day++;
            const lastDayOfMonth = new Date(year, month, 0).getDate();
            if (day > lastDayOfMonth) {
                day = 1;
                month++;
                if (month > 12) {
                    month = 1;
                    year++;
                }
            }
        }

        // 월 단위 처리
        year = parseInt(startYear);
        month = parseInt(startMonth);
        const endYearInt = parseInt(endYear);
        const endMonthInt = parseInt(endMonth);

        while (year < endYearInt || (year === endYearInt && month <= endMonthInt)) {
            months.push([year.toString(), String(month).padStart(2, '0')]);
            month++;
            if (month > 12) {
                month = 1;
                year++;
            }
        }

        return { dates, months };
    }

    /**
     * 이벤트 핸들러: 직원 ID로 조회
     */
    @OnEvent('employee.findById')
    async handleFindEmployeeById({ employeeId }: { employeeId: string }): Promise<EmployeeInfoEntity> {
        const employee = await this.employeeDomainService.findEmployeeById(employeeId);
        if (!employee) {
            throw new NotFoundException('해당 직원을 찾을 수 없습니다.');
        }
        return employee;
    }

    /**
     * 이벤트 핸들러: 부서별 직원 조회
     */
    @OnEvent('employee.findByDepartment')
    async handleFindEmployeeByDepartment({ departmentId }: { departmentId: string }): Promise<EmployeeInfoEntity[]> {
        return this.employeeDomainService.findEmployeesByDepartmentWithQuitFilter(departmentId);
    }

    /**
     * 이벤트 핸들러: 월별 출석 요약 업데이트
     */
    @OnEvent('employee.monthly-attendance-summary.updated')
    async handleMonthlyAttendanceSummaryUpdate(payload: { employeeId: string; beforeDate: string; newDate: string }) {
        const { employeeId, beforeDate, newDate } = payload;

        const { dates, months } = this.generateDateRange(beforeDate, newDate);

        // 데이터 복구
        for (const date of dates) {
            await this.eventEmitter.emitAsync('daily-event-summary.create', {
                employeeId: employeeId,
                date: date,
            });
        }

        // 이전 퇴사일과 신규 퇴사일 사이의 연도와 월의 범위배열 생성
        for (const month of months) {
            console.log('월별 일간 요약 생성');
            await this.eventEmitter.emitAsync('daily-event-summary.create-daily-summary', {
                employeeId: employeeId,
                year: month[0],
                month: month[1],
                isUpdate: true,
            });

            console.log('월별 출석 요약 생성');
            await this.eventEmitter.emitAsync('monthly-attendance.create-summary-by-employee', {
                employeeId: employeeId,
                year: month[0],
                month: month[1],
            });
        }
    }
}
