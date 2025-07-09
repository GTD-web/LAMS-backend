import { Injectable } from '@nestjs/common';
import { EmployeeInfoEntity } from '../entities/employee-info.entity';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { UsedAttendanceEntity } from '@src/domain/attendance/used-attendance/entities/used-attendance.entity';
import { EventInfoEntity } from '@src/domain/event-info/entities/event-info.entity';
import { EmployeeAnnualLeaveEntity } from '@src/domain/annual-leave/entities/employee-annual-leave.entity';
import { EmployeeDomainRepository } from '../repositories/employee-domain.repository';

/**
 * 직원 도메인 서비스
 * - 직원 관련 핵심 도메인 로직을 처리
 * - 리포지토리 관련 검증 및 도메인 규칙 적용
 */
@Injectable()
export class EmployeeDomainService {
    constructor(private readonly employeeRepository: EmployeeDomainRepository) {}

    /**
     * 직원 ID로 조회
     */
    async findEmployeeById(employeeId: string): Promise<EmployeeInfoEntity | null> {
        return this.employeeRepository.findByEmployeeId(employeeId);
    }

    /**
     * 사번으로 직원 조회
     */
    async findEmployeeByEmployeeNumber(employeeNumber: string): Promise<EmployeeInfoEntity | null> {
        return this.employeeRepository.findByEmployeeNumber(employeeNumber);
    }

    /**
     * 퇴사일 업데이트
     */
    async updateQuitedAt(employeeId: string, quitedAt: string): Promise<EmployeeInfoEntity> {
        const employee = await this.employeeRepository.findByEmployeeId(employeeId);
        if (!employee) {
            throw new Error('해당 직원을 찾을 수 없습니다.');
        }

        return this.employeeRepository.updateEmployee(employeeId, { quitedAt });
    }

    /**
     * 입사일 업데이트
     */
    async updateEntryAt(employeeId: string, entryAt: string): Promise<EmployeeInfoEntity> {
        const employee = await this.employeeRepository.findByEmployeeId(employeeId);
        if (!employee) {
            throw new Error('해당 직원을 찾을 수 없습니다.');
        }

        return this.employeeRepository.updateEmployee(employeeId, { entryAt });
    }

    /**
     * 직원 제외 토글
     */
    async toggleExcludeEmployee(employeeId: string): Promise<EmployeeInfoEntity> {
        const employee = await this.employeeRepository.findByEmployeeId(employeeId);
        if (!employee) {
            throw new Error('해당 직원을 찾을 수 없습니다.');
        }

        const isExcludedFromCalculation = !employee.isExcludedFromCalculation;
        return this.employeeRepository.updateEmployee(employeeId, { isExcludedFromCalculation });
    }

    /**
     * 생일 업데이트
     */
    async updateBirthDate(employeeId: string, birthDate: string): Promise<EmployeeInfoEntity> {
        const employee = await this.employeeRepository.findByEmployeeId(employeeId);
        if (!employee) {
            throw new Error('해당 직원을 찾을 수 없습니다.');
        }

        return this.employeeRepository.updateEmployee(employeeId, { birthDate });
    }

    /**
     * 직원 삭제
     */
    async deleteEmployee(employeeId: string): Promise<boolean> {
        const employee = await this.employeeRepository.findByEmployeeId(employeeId);
        if (!employee) {
            throw new Error('해당 직원을 찾을 수 없습니다.');
        }

        return this.employeeRepository.deleteEmployee(employeeId);
    }

    /**
     * 모든 직원 조회 (페이지네이션)
     */
    async findAllEmployees(query: PaginationQueryDto): Promise<{ employees: EmployeeInfoEntity[]; total: number }> {
        return this.employeeRepository.findAndCount(query);
    }

    /**
     * 부서별 직원 조회 (퇴사일 필터링 포함)
     */
    async findEmployeesByDepartmentWithQuitFilter(departmentId: string): Promise<EmployeeInfoEntity[]> {
        return this.employeeRepository.findEmployeesByDepartmentWithQuitFilter(departmentId);
    }

    /**
     * 입사일과 퇴사일을 함께 업데이트 (원본 직원 정보 반환)
     */
    async updateEmployeeDates(
        employeeId: string,
        updateData: { entryAt?: string; quitedAt?: string },
    ): Promise<{ employeeInfoEntity: EmployeeInfoEntity; beforeEmployee: EmployeeInfoEntity }> {
        const beforeEmployee = await this.employeeRepository.findByEmployeeId(employeeId);
        if (!beforeEmployee) {
            throw new Error('해당 직원을 찾을 수 없습니다.');
        }

        const employeeInfoEntity = await this.employeeRepository.updateEmployee(employeeId, updateData);

        return {
            employeeInfoEntity,
            beforeEmployee,
        };
    }
}
