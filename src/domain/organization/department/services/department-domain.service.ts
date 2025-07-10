import { Injectable, Logger, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { DepartmentInfoEntity } from '../entities/department-info.entity';
import { DepartmentEmployeeEntity } from '../entities/department-employee.entity';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { IDepartmentRepository } from '../interfaces/department-repository.interface';

/**
 * 부서 도메인 서비스
 * - 부서 관련 핵심 도메인 로직 처리
 * - 부서 정보 조회, 권한 관리, 제외 처리 등
 */
@Injectable()
export class DepartmentDomainService {
    private readonly logger = new Logger(DepartmentDomainService.name);

    constructor(
        @Inject('IDepartmentRepository')
        private readonly departmentRepository: IDepartmentRepository,
    ) {}

    /**
     * 부서 ID로 조회
     */
    async findDepartmentById(departmentId: string): Promise<DepartmentInfoEntity | null> {
        try {
            return await this.departmentRepository.findById(departmentId);
        } catch (error) {
            throw error;
        }
    }

    /**
     * 사용자의 접근 권한 부서 조회
     */
    async findDepartmentsByAccessAuthority(userId: string): Promise<DepartmentInfoEntity[]> {
        try {
            return await this.departmentRepository.findByAccessAuthority(userId);
        } catch (error) {
            throw error;
        }
    }

    /**
     * 부서 목록 조회 (페이지네이션)
     */
    async findAllDepartments(
        query: PaginationQueryDto,
        isExclude?: boolean,
    ): Promise<{ departments: DepartmentInfoEntity[]; total: number }> {
        try {
            return await this.departmentRepository.findAll(query, isExclude);
        } catch (error) {
            throw error;
        }
    }

    /**
     * 부서 제외 토글
     */
    async toggleDepartmentExclude(department: DepartmentInfoEntity): Promise<DepartmentInfoEntity> {
        try {
            const updatedDepartment = await this.departmentRepository.update(department.departmentId, {
                isExclude: !department.isExclude,
            });

            return updatedDepartment;
        } catch (error) {
            throw error;
        }
    }

    async updateDepartment(
        departmentId: string,
        department: Partial<DepartmentInfoEntity>,
    ): Promise<DepartmentInfoEntity> {
        return await this.departmentRepository.update(departmentId, department);
    }
}
