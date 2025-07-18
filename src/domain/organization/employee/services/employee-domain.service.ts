import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not, IsNull } from 'typeorm';
import { EmployeeInfoEntity } from '../entities/employee-info.entity';

/**
 * 직원 ?�메???�비??
 * - 직원 관???�심 ?�메??로직??처리
 * - 검�?로직 �??�이???�근 ?�합 처리
 * - ?�메??규칙�?불�??�을 보장
 */
@Injectable()
export class EmployeeDomainService {
    private readonly logger = new Logger(EmployeeDomainService.name);

    constructor(
        @InjectRepository(EmployeeInfoEntity)
        private readonly employeeRepository: Repository<EmployeeInfoEntity>,
    ) {}

    /**
     * 직원 ?�외 ?�태 ?��?
     */
    async toggleEmployeeExclude(employeeId: string): Promise<EmployeeInfoEntity> {
        try {
            const employee = await this.findEmployeeById(employeeId);
            if (!employee) {
                throw new NotFoundException('직원??찾을 ???�습?�다.');
            }

            employee.isExcludedFromCalculation = !employee.isExcludedFromCalculation;
            const updatedEmployee = await this.employeeRepository.save(employee);
            this.logger.log(
                `직원 ?�외 ?�태 ?��? ?�료: ${updatedEmployee.employeeName} (${updatedEmployee.isExcludedFromCalculation})`,
            );
            return updatedEmployee;
        } catch (error) {
            this.logger.error(`직원 ?�외 ?�태 ?��? ?�패: ${employeeId}`, error.stack);
            throw error;
        }
    }

    /**
     * 직원 ID�?조회
     */
    async findEmployeeById(employeeId: string): Promise<EmployeeInfoEntity | null> {
        return await this.employeeRepository.findOne({
            where: { employeeId },
            relations: ['department'],
        });
    }

    /**
     * ?�번?�로 직원 조회
     */
    async findEmployeeByEmployeeNumber(employeeNumber: string): Promise<EmployeeInfoEntity | null> {
        return await this.employeeRepository.findOne({
            where: { employeeNumber },
            relations: ['department'],
        });
    }

    /**
     * ?�체 직원 조회
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
     * 부?�별 직원 조회 (?�사???�외)
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
     * ?�성 직원 조회 (?�사?��? ?��? 직원)
     */
    async findActiveEmployees(): Promise<EmployeeInfoEntity[]> {
        return await this.employeeRepository.find({
            where: { quitedAt: IsNull() },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
    }

    /**
     * ?�사 직원 조회
     */
    async findInactiveEmployees(): Promise<EmployeeInfoEntity[]> {
        return await this.employeeRepository.find({
            where: { quitedAt: Not(IsNull()) },
            relations: ['department'],
            order: { quitedAt: 'DESC' },
        });
    }

    /**
     * 직원 검??
     */
    async searchEmployees(searchTerm: string): Promise<EmployeeInfoEntity[]> {
        return await this.employeeRepository.find({
            where: [{ employeeName: Like(`%${searchTerm}%`) }, { employeeNumber: Like(`%${searchTerm}%`) }],
            relations: ['department'],
            order: { employeeName: 'ASC' },
        });
    }

    /**
     * 직원 ?�??
     */
    async saveEmployee(employee: EmployeeInfoEntity): Promise<EmployeeInfoEntity> {
        return await this.employeeRepository.save(employee);
    }
}
