import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { DepartmentEmployeeEntity } from '@src/domain/organization/department/entities/department-employee.entity';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';

// 부서 도메인 리포지토리 클래스
@Injectable()
export class DepartmentRepository {
    constructor(
        @InjectRepository(DepartmentInfoEntity)
        private readonly departmentRepository: Repository<DepartmentInfoEntity>,
        @InjectRepository(DepartmentEmployeeEntity)
        private readonly departmentEmployeeRepository: Repository<DepartmentEmployeeEntity>,
    ) {}

    /**
     * 부서 ID로 조회
     */
    async findById(departmentId: string): Promise<DepartmentInfoEntity | null> {
        return await this.departmentRepository.findOne({
            where: { departmentId },
            relations: ['employees', 'employees.employee', 'orgChartInfo'],
        });
    }

    /**
     * 모든 부서 조회
     */
    async findAll(skip?: number, take?: number): Promise<DepartmentInfoEntity[]> {
        return await this.departmentRepository.find({
            relations: ['employees', 'employees.employee', 'orgChartInfo'],
            skip,
            take,
        });
    }

    /**
     * 부서 총 개수 조회
     */
    async count(): Promise<number> {
        return await this.departmentRepository.count();
    }

    /**
     * 부서 저장
     */
    async save(department: DepartmentInfoEntity): Promise<DepartmentInfoEntity> {
        return await this.departmentRepository.save(department);
    }

    /**
     * 부서 삭제
     */
    async delete(departmentId: string): Promise<boolean> {
        const result = await this.departmentRepository.delete(departmentId);
        return result.affected > 0;
    }

    /**
     * 사용자의 접근 권한 부서 조회
     */
    async findByAccessAuthority(userId: string): Promise<DepartmentInfoEntity[]> {
        return await this.departmentRepository.find({
            where: {
                accessAuthorities: {
                    userId,
                },
            },
            relations: ['employees', 'employees.employee', 'orgChartInfo'],
        });
    }

    /**
     * 사용자의 검토 권한 부서 조회
     */
    async findByReviewAuthority(userId: string): Promise<DepartmentInfoEntity[]> {
        return await this.departmentRepository.find({
            where: {
                reviewAuthorities: {
                    userId,
                },
            },
            relations: ['employees', 'employees.employee', 'orgChartInfo'],
        });
    }

    /**
     * 부서 직원 연결 저장
     */
    async saveDepartmentEmployee(departmentEmployee: DepartmentEmployeeEntity): Promise<DepartmentEmployeeEntity> {
        return await this.departmentEmployeeRepository.save(departmentEmployee);
    }

    /**
     * 부서 직원 연결 삭제
     */
    async deleteDepartmentEmployee(departmentId: string, employeeId: string): Promise<boolean> {
        const result = await this.departmentEmployeeRepository.delete({
            department: { departmentId },
            employee: { employeeId },
        });
        return result.affected > 0;
    }

    /**
     * 부서의 모든 직원 연결 삭제
     */
    async deleteAllDepartmentEmployees(departmentId: string): Promise<boolean> {
        const result = await this.departmentEmployeeRepository.delete({
            department: { departmentId },
        });
        return result.affected > 0;
    }

    /**
     * 부서 직원 연결 조회
     */
    async findDepartmentEmployee(departmentId: string, employeeId: string): Promise<DepartmentEmployeeEntity | null> {
        return await this.departmentEmployeeRepository.findOne({
            where: {
                department: { departmentId },
                employee: { employeeId },
            },
            relations: ['department', 'employee'],
        });
    }

    /**
     * 부서명으로 검색
     */
    async findByName(departmentName: string): Promise<DepartmentInfoEntity[]> {
        return await this.departmentRepository.find({
            where: {
                departmentName: departmentName,
            },
            relations: ['employees', 'employees.employee', 'orgChartInfo'],
        });
    }

    /**
     * 부서명으로 부분 검색
     */
    async findByNameContains(departmentName: string): Promise<DepartmentInfoEntity[]> {
        return await this.departmentRepository
            .createQueryBuilder('department')
            .leftJoinAndSelect('department.employees', 'employees')
            .leftJoinAndSelect('employees.employee', 'employee')
            .leftJoinAndSelect('department.orgChartInfo', 'orgChartInfo')
            .where('department.departmentName LIKE :name', { name: `%${departmentName}%` })
            .getMany();
    }

    /**
     * 상위 부서 ID로 하위 부서 조회
     */
    async findByParentId(parentDepartmentId: string): Promise<DepartmentInfoEntity[]> {
        return await this.departmentRepository.find({
            where: { parentDepartmentId },
            relations: ['employees', 'employees.employee', 'orgChartInfo'],
        });
    }

    /**
     * 최상위 부서 조회 (부모가 없는 부서)
     */
    async findRootDepartments(): Promise<DepartmentInfoEntity[]> {
        return await this.departmentRepository.find({
            where: { parentDepartmentId: null },
            relations: ['employees', 'employees.employee', 'orgChartInfo'],
        });
    }
}
