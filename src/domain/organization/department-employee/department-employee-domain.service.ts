import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentEmployeeEntity } from './entities/department-employee.entity';
import { DepartmentInfoEntity } from '../department/entities/department-info.entity';
import { EmployeeInfoEntity } from '../employee/entities/employee-info.entity';

/**
 * 부서-직원 관계 도메인 서비스
 * - 부서와 직원 간의 관계 관리
 * - 중간테이블 데이터 처리
 * - 관계 생성, 삭제, 조회 등의 핵심 로직
 */
@Injectable()
export class DepartmentEmployeeDomainService {
    private readonly logger = new Logger(DepartmentEmployeeDomainService.name);

    constructor(
        @InjectRepository(DepartmentEmployeeEntity)
        private readonly departmentEmployeeRepository: Repository<DepartmentEmployeeEntity>,
    ) {}

    /**
     * 부서-직원 관계 생성
     */
    async createDepartmentEmployee(
        department: DepartmentInfoEntity,
        employee: EmployeeInfoEntity,
    ): Promise<DepartmentEmployeeEntity> {
        const departmentEmployee = new DepartmentEmployeeEntity();
        departmentEmployee.department = department;
        departmentEmployee.employee = employee;

        const savedRelation = await this.departmentEmployeeRepository.save(departmentEmployee);
        this.logger.log(`부서-직원 관계 생성: ${department.departmentName} -> ${employee.employeeName}`);
        return savedRelation;
    }

    /**
     * 부서-직원 관계 저장
     */
    async saveDepartmentEmployee(departmentEmployee: DepartmentEmployeeEntity): Promise<DepartmentEmployeeEntity> {
        const savedRelation = await this.departmentEmployeeRepository.save(departmentEmployee);
        this.logger.log('부서-직원 관계 저장 완료');
        return savedRelation;
    }

    /**
     * 직원 ID로 부서-직원 관계 삭제
     */
    async deleteDepartmentEmployeeByEmployeeId(employeeId: string): Promise<void> {
        await this.departmentEmployeeRepository.delete({ employee: { employeeId } });
        this.logger.log(`직원 ID로 부서-직원 관계 삭제: ${employeeId}`);
    }

    /**
     * 부서 ID로 부서-직원 관계 삭제
     */
    async deleteDepartmentEmployeeByDepartmentId(departmentId: string): Promise<void> {
        await this.departmentEmployeeRepository.delete({ department: { departmentId } });
        this.logger.log(`부서 ID로 부서-직원 관계 삭제: ${departmentId}`);
    }

    /**
     * 부서별 직원 관계 조회
     */
    async findDepartmentEmployeesByDepartmentId(departmentId: string): Promise<DepartmentEmployeeEntity[]> {
        const relations = await this.departmentEmployeeRepository.find({
            where: { department: { departmentId } },
            relations: ['department', 'employee'],
        });
        this.logger.log(`부서별 직원 관계 조회: ${departmentId} -> ${relations.length}개`);
        return relations;
    }

    /**
     * 직원별 부서 관계 조회
     */
    async findDepartmentEmployeesByEmployeeId(employeeId: string): Promise<DepartmentEmployeeEntity[]> {
        const relations = await this.departmentEmployeeRepository.find({
            where: { employee: { employeeId } },
            relations: ['department', 'employee'],
        });
        this.logger.log(`직원별 부서 관계 조회: ${employeeId} -> ${relations.length}개`);
        return relations;
    }

    /**
     * 모든 부서-직원 관계 삭제
     */
    async deleteAllDepartmentEmployees(): Promise<void> {
        await this.departmentEmployeeRepository.clear();
        this.logger.log('모든 부서-직원 관계 삭제 완료');
    }

    /**
     * 부서-직원 관계 존재 여부 확인
     */
    async existsDepartmentEmployee(departmentId: string, employeeId: string): Promise<boolean> {
        const count = await this.departmentEmployeeRepository.count({
            where: {
                department: { departmentId },
                employee: { employeeId },
            },
        });
        return count > 0;
    }
}
