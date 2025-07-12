import { Injectable } from '@nestjs/common';
import { DepartmentInfoEntity } from '../entities/department-info.entity';
import { DepartmentEmployeeEntity } from '../entities/department-employee.entity';
import { EmployeeInfoEntity } from '../../employee/entities/employee-info.entity';
import { IDepartmentRepository } from '../interfaces/department-repository.interface';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * 부서 리포지토리 구현체
 * - TypeORM을 사용한 부서 데이터 접근 계층
 */
@Injectable()
export class DepartmentRepository implements IDepartmentRepository {
    constructor(
        @InjectRepository(DepartmentInfoEntity)
        private readonly departmentInfoRepository: Repository<DepartmentInfoEntity>,
        @InjectRepository(EmployeeInfoEntity)
        private readonly employeeInfoRepository: Repository<EmployeeInfoEntity>,
        @InjectRepository(DepartmentEmployeeEntity)
        private readonly departmentEmployeeRepository: Repository<DepartmentEmployeeEntity>,
    ) {}

    /**
     * 부서 생성
     */
    async create(department: Partial<DepartmentInfoEntity>): Promise<DepartmentInfoEntity> {
        const newDepartment = this.departmentInfoRepository.create(department);
        return await this.departmentInfoRepository.save(newDepartment);
    }

    /**
     * 부서 ID로 조회
     */
    async findById(departmentId: string): Promise<DepartmentInfoEntity | null> {
        return await this.departmentInfoRepository.findOne({
            where: { departmentId },
            relations: ['employees', 'employees.employee'],
        });
    }

    /**
     * 부서 코드로 조회
     */
    async findByCode(departmentCode: string): Promise<DepartmentInfoEntity | null> {
        return await this.departmentInfoRepository.findOne({
            where: { departmentCode },
        });
    }

    /**
     * 부서 이름으로 조회
     */
    async findByName(departmentName: string): Promise<DepartmentInfoEntity | null> {
        return await this.departmentInfoRepository.findOne({
            where: { departmentName },
        });
    }

    /**
     * MMS 부서 ID로 부서 조회
     */
    async findByMMSDepartmentId(mmsDepartmentId: string): Promise<DepartmentInfoEntity | null> {
        return await this.departmentInfoRepository.findOne({
            where: { mmsDepartmentId },
        });
    }

    /**
     * 모든 부서 조회 (페이지네이션)
     */
    async findAll(
        query: PaginationQueryDto,
        isExclude?: boolean,
    ): Promise<{
        departments: DepartmentInfoEntity[];
        total: number;
    }> {
        const queryBuilder = this.departmentInfoRepository.createQueryBuilder('department');

        if (isExclude !== undefined) {
            queryBuilder.where('department.isExclude = :isExclude', { isExclude });
        }

        const [departments, total] = await queryBuilder
            .skip((query.page - 1) * query.limit)
            .take(query.limit)
            .getManyAndCount();

        return { departments, total };
    }

    /**
     * 사용자 접근 권한이 있는 부서 조회
     */
    async findByAccessAuthority(userId: string): Promise<DepartmentInfoEntity[]> {
        return await this.departmentInfoRepository
            .createQueryBuilder('department')
            .innerJoin('department.employees', 'employee')
            .where('employee.employeeId = :userId', { userId })
            .andWhere('employee.hasAccessAuthority = true')
            .getMany();
    }

    /**
     * 사용자 검토 권한이 있는 부서 조회
     */
    async findByReviewAuthority(userId: string): Promise<DepartmentInfoEntity[]> {
        return await this.departmentInfoRepository
            .createQueryBuilder('department')
            .innerJoin('department.employees', 'employee')
            .where('employee.employeeId = :userId', { userId })
            .andWhere('employee.hasReviewAuthority = true')
            .getMany();
    }

    /**
     * 부서 업데이트
     */
    async update(departmentId: string, updateData: Partial<DepartmentInfoEntity>): Promise<DepartmentInfoEntity> {
        await this.departmentInfoRepository.update(departmentId, updateData);
        return await this.findById(departmentId);
    }

    /**
     * 부서 삭제
     */
    async delete(departmentId: string): Promise<boolean> {
        const result = await this.departmentInfoRepository.delete(departmentId);
        return result.affected > 0;
    }

    /**
     * 부서 저장
     */
    async save(department: DepartmentInfoEntity): Promise<DepartmentInfoEntity> {
        return await this.departmentInfoRepository.save(department);
    }

    /**
     * 부서 검색
     */
    async search(searchTerm: string, userId?: string): Promise<DepartmentInfoEntity[]> {
        const queryBuilder = this.departmentInfoRepository.createQueryBuilder('department');

        queryBuilder.where('department.departmentName LIKE :searchTerm', {
            searchTerm: `%${searchTerm}%`,
        });

        if (userId) {
            queryBuilder
                .innerJoin('department.employees', 'employee')
                .andWhere('employee.employeeId = :userId', { userId })
                .andWhere('employee.hasAccessAuthority = true');
        }

        return await queryBuilder.getMany();
    }

    /**
     * 부서 계층 구조 조회
     */
    async findHierarchy(departmentId?: string): Promise<DepartmentInfoEntity[]> {
        // TODO: 계층 구조 조회 로직 구현
        return await this.departmentInfoRepository.find();
    }

    /**
     * 하위 부서 조회
     */
    async findChildren(departmentId: string): Promise<DepartmentInfoEntity[]> {
        return await this.departmentInfoRepository.find({
            where: { parentDepartmentId: departmentId },
        });
    }

    /**
     * 상위 부서 조회
     */
    async findParent(departmentId: string): Promise<DepartmentInfoEntity | null> {
        const department = await this.findById(departmentId);
        if (!department?.parentDepartmentId) {
            return null;
        }
        return await this.findById(department.parentDepartmentId);
    }

    /**
     * 부서 존재 여부 확인
     */
    async exists(departmentId: string): Promise<boolean> {
        const count = await this.departmentInfoRepository.count({
            where: { departmentId },
        });
        return count > 0;
    }

    /**
     * 부서 코드 중복 확인
     */
    async existsByCode(departmentCode: string, excludeId?: string): Promise<boolean> {
        const queryBuilder = this.departmentInfoRepository.createQueryBuilder('department');
        queryBuilder.where('department.departmentCode = :departmentCode', { departmentCode });

        if (excludeId) {
            queryBuilder.andWhere('department.departmentId != :excludeId', { excludeId });
        }

        const count = await queryBuilder.getCount();
        return count > 0;
    }

    /**
     * 부서 이름 중복 확인
     */
    async existsByName(departmentName: string, excludeId?: string): Promise<boolean> {
        const queryBuilder = this.departmentInfoRepository.createQueryBuilder('department');
        queryBuilder.where('department.departmentName = :departmentName', { departmentName });

        if (excludeId) {
            queryBuilder.andWhere('department.departmentId != :excludeId', { excludeId });
        }

        const count = await queryBuilder.getCount();
        return count > 0;
    }

    /**
     * 직원 번호로 직원 조회
     */
    async findEmployeeByEmployeeNumber(employeeNumber: string): Promise<EmployeeInfoEntity | null> {
        return await this.employeeInfoRepository.findOne({
            where: { employeeNumber },
        });
    }

    /**
     * 직원 저장
     */
    async saveEmployee(employee: EmployeeInfoEntity): Promise<EmployeeInfoEntity> {
        return await this.employeeInfoRepository.save(employee);
    }

    /**
     * 직원 ID로 부서 직원 관계 삭제
     */
    async deleteDepartmentEmployeeByEmployeeId(employeeId: string): Promise<void> {
        const result = await this.departmentEmployeeRepository.delete(employeeId);
    }

    /**
     * 부서 직원 관계 저장
     */
    async saveDepartmentEmployee(departmentEmployee: DepartmentEmployeeEntity): Promise<DepartmentEmployeeEntity> {
        return await this.departmentEmployeeRepository.save(departmentEmployee);
    }
}
