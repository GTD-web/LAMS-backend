import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not, IsNull } from 'typeorm';
import { EmployeeInfoEntity } from '../entities/employee-info.entity';

/**
 * 직원 도메인 서비스
 * - 직원 관련 핵심 도메인 로직을 처리
 * - 검증 로직 및 데이터 접근 통합 처리
 * - 도메인 규칙과 불변성을 보장
 */
@Injectable()
export class EmployeeDomainService {
    private readonly logger = new Logger(EmployeeDomainService.name);

    constructor(
        @InjectRepository(EmployeeInfoEntity)
        private readonly employeeRepository: Repository<EmployeeInfoEntity>,
    ) {}

    /**
     * 직원 제외 상태 토글
     */
    async toggleEmployeeExclude(employeeId: string): Promise<EmployeeInfoEntity> {
        try {
            const employee = await this.findEmployeeById(employeeId);
            if (!employee) {
                throw new NotFoundException('직원을 찾을 수 없습니다.');
            }

            employee.isExcludedFromCalculation = !employee.isExcludedFromCalculation;
            const updatedEmployee = await this.employeeRepository.save(employee);
            this.logger.log(
                `직원 제외 상태 토글 완료: ${updatedEmployee.employeeName} (${updatedEmployee.isExcludedFromCalculation})`,
            );
            return updatedEmployee;
        } catch (error) {
            this.logger.error(`직원 제외 상태 토글 실패: ${employeeId}`, error.stack);
            throw error;
        }
    }

    /**
     * 직원 ID로 조회
     */
    async findEmployeeById(employeeId: string): Promise<EmployeeInfoEntity | null> {
        return await this.employeeRepository.findOne({
            where: { employeeId },
            relations: ['department'],
        });
    }

    /**
     * 사번으로 직원 조회
     */
    async findEmployeeByEmployeeNumber(employeeNumber: string): Promise<EmployeeInfoEntity | null> {
        return await this.employeeRepository.findOne({
            where: { employeeNumber },
            relations: ['department'],
        });
    }

    /**
     * 전체 직원 조회
     */
    async findAllEmployees(isExclude?: boolean): Promise<EmployeeInfoEntity[]> {
        const whereCondition = isExclude !== undefined ? { isExcludedFromCalculation: isExclude } : {};

        return await this.employeeRepository.find({
            where: whereCondition,
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
    }

    /**
     * 부서별 직원 조회 (퇴사자 제외)
     */
    async findEmployeesByDepartmentWithQuitFilter(departmentId: string): Promise<EmployeeInfoEntity[]> {
        return await this.employeeRepository.find({
            where: {
                department: { departmentId },
                quitedAt: IsNull(),
            },
            relations: ['department'],
            order: { employeeName: 'ASC' },
        });
    }

    /**
     * 활성 직원 조회 (퇴사하지 않은 직원)
     */
    async findActiveEmployees(): Promise<EmployeeInfoEntity[]> {
        return await this.employeeRepository.find({
            where: { quitedAt: IsNull() },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
    }

    /**
     * 퇴사 직원 조회
     */
    async findInactiveEmployees(): Promise<EmployeeInfoEntity[]> {
        return await this.employeeRepository.find({
            where: { quitedAt: Not(IsNull()) },
            relations: ['department'],
            order: { quitedAt: 'DESC' },
        });
    }

    /**
     * 직원 검색
     */
    async searchEmployees(searchTerm: string): Promise<EmployeeInfoEntity[]> {
        return await this.employeeRepository.find({
            where: [{ employeeName: Like(`%${searchTerm}%`) }, { employeeNumber: Like(`%${searchTerm}%`) }],
            relations: ['department'],
            order: { employeeName: 'ASC' },
        });
    }
}
