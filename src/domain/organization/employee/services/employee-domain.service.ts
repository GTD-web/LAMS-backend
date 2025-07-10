import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { EmployeeInfoEntity } from '../entities/employee-info.entity';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { EmployeeDomainRepository } from '../repositories/employee-domain.repository';
import { MergedEmployeeInfo } from '@src/domain/excel/employee-excel-import.domain';

/**
 * 직원 도메인 서비스
 * - 직원 관련 핵심 도메인 로직을 처리
 * - 리포지토리 관련 검증 및 도메인 규칙 적용
 */
@Injectable()
export class EmployeeDomainService {
    private readonly logger = new Logger(EmployeeDomainService.name);

    constructor(private readonly employeeRepository: EmployeeDomainRepository) {}

    /**
     * 직원 ID로 조회
     */
    async findEmployeeById(employeeId: string): Promise<EmployeeInfoEntity | null> {
        try {
            return await this.employeeRepository.findByEmployeeId(employeeId);
        } catch (error) {
            throw new BadRequestException('직원 조회 중 오류가 발생했습니다.', error.message);
        }
    }

    /**
     * 사번으로 직원 조회
     */
    async findEmployeeByEmployeeNumber(employeeNumber: string): Promise<EmployeeInfoEntity | null> {
        try {
            return await this.employeeRepository.findByEmployeeNumber(employeeNumber);
        } catch (error) {
            throw new BadRequestException('직원 조회 중 오류가 발생했습니다.', error.message);
        }
    }

    /**
     * 퇴사일 업데이트
     */
    async updateQuitedAt(employeeId: string, quitedAt: string): Promise<EmployeeInfoEntity> {
        try {
            return await this.employeeRepository.updateEmployee(employeeId, { quitedAt });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('퇴사일 업데이트 중 오류가 발생했습니다.');
        }
    }

    /**
     * 입사일 업데이트
     */
    async updateEntryAt(employeeId: string, entryAt: string): Promise<EmployeeInfoEntity> {
        try {
            return await this.employeeRepository.updateEmployee(employeeId, { entryAt });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('입사일 업데이트 중 오류가 발생했습니다.');
        }
    }

    /**
     * 직원 제외 토글
     */
    async toggleExcludeEmployee(employee: EmployeeInfoEntity): Promise<EmployeeInfoEntity> {
        try {
            const isExcludedFromCalculation = !employee.isExcludedFromCalculation;
            return await this.employeeRepository.updateEmployee(employee.employeeId, { isExcludedFromCalculation });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('직원 제외 토글 중 오류가 발생했습니다.');
        }
    }

    /**
     * 생일 업데이트
     */
    async updateBirthDate(employeeId: string, birthDate: string): Promise<EmployeeInfoEntity> {
        try {
            return await this.employeeRepository.updateEmployee(employeeId, { birthDate });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('생일 업데이트 중 오류가 발생했습니다.');
        }
    }

    /**
     * 직원 삭제
     */
    async deleteEmployee(employeeId: string): Promise<boolean> {
        try {
            return await this.employeeRepository.deleteEmployee(employeeId);
        } catch (error) {
            this.logger.error(`직원 삭제 실패: ${employeeId}`, error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('직원 삭제 중 오류가 발생했습니다.');
        }
    }

    /**
     * 모든 직원 조회 (페이지네이션)
     */
    async findAllEmployees(query: PaginationQueryDto): Promise<{ employees: EmployeeInfoEntity[]; total: number }> {
        try {
            return await this.employeeRepository.findAndCount(query);
        } catch (error) {
            this.logger.error('모든 직원 조회 실패', error.stack);
            throw new BadRequestException('직원 목록 조회 중 오류가 발생했습니다.');
        }
    }

    /**
     * 부서별 직원 조회 (퇴사일 필터링 포함)
     */
    async findEmployeesByDepartmentWithQuitFilter(departmentId: string): Promise<EmployeeInfoEntity[]> {
        try {
            return await this.employeeRepository.findEmployeesByDepartmentWithQuitFilter(departmentId);
        } catch (error) {
            this.logger.error(`부서별 직원 조회 실패: ${departmentId}`, error.stack);
            throw new BadRequestException('부서별 직원 조회 중 오류가 발생했습니다.');
        }
    }

    /**
     * 입사일과 퇴사일을 함께 업데이트 (원본 직원 정보 반환)
     */
    async updateEmployeeDates(
        employeeId: string,
        updateData: { entryAt?: string; quitedAt?: string },
    ): Promise<{ employeeInfoEntity: EmployeeInfoEntity; beforeEmployee: EmployeeInfoEntity }> {
        try {
            const beforeEmployee = await this.employeeRepository.findByEmployeeId(employeeId);
            if (!beforeEmployee) {
                throw new NotFoundException('해당 직원을 찾을 수 없습니다.');
            }

            const employeeInfoEntity = await this.employeeRepository.updateEmployee(employeeId, updateData);

            return {
                employeeInfoEntity,
                beforeEmployee,
            };
        } catch (error) {
            this.logger.error(`직원 날짜 업데이트 실패: ${employeeId}`, error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('직원 날짜 업데이트 중 오류가 발생했습니다.');
        }
    }

    /**
     * 직원 정보 업데이트
     */
    async updateEmployeeInfo(mergedEmployeeInfo: MergedEmployeeInfo): Promise<EmployeeInfoEntity | null> {
        try {
            const employee = await this.employeeRepository.findByEmployeeNumber(mergedEmployeeInfo.employeeNumber);

            if (!employee) {
                this.logger.warn(`존재하지 않는 직원: ${mergedEmployeeInfo.employeeNumber}`);
                return null;
            }

            employee.employeeName = mergedEmployeeInfo.employeeName;
            employee.birthDate = mergedEmployeeInfo.birthDate;
            employee.entryAt = mergedEmployeeInfo.entryDate;
            employee.email = mergedEmployeeInfo.email;

            const savedEmployee = await this.employeeRepository.save(employee);
            this.logger.log(`직원 정보 업데이트 완료: ${savedEmployee.employeeNumber}`);
            return savedEmployee;
        } catch (error) {
            this.logger.error(`직원 정보 업데이트 실패: ${mergedEmployeeInfo.employeeNumber}`, error.stack);
            throw new BadRequestException('직원 정보 업데이트 중 오류가 발생했습니다.');
        }
    }
}
