import { Injectable, Logger, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { DepartmentInfoEntity } from '../entities/department-info.entity';
import { DepartmentEmployeeEntity } from '../entities/department-employee.entity';
import { EmployeeInfoEntity } from '../../employee/entities/employee-info.entity';
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
            this.logger.error(`부서 조회 실패: ${departmentId}`, error);
            throw error;
        }
    }

    /**
     * MMS 부서 ID로 부서 조회
     */
    async findDepartmentByMMSDepartmentId(mmsDepartmentId: string): Promise<DepartmentInfoEntity | null> {
        try {
            return await this.departmentRepository.findByMMSDepartmentId(mmsDepartmentId);
        } catch (error) {
            this.logger.error(`MMS 부서 ID로 부서 조회 실패: ${mmsDepartmentId}`, error);
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
            this.logger.error(`사용자 접근 권한 부서 조회 실패: ${userId}`, error);
            throw error;
        }
    }

    /**
     * 사용자의 검토 권한 부서 조회
     */
    async findDepartmentsByReviewAuthority(userId: string): Promise<DepartmentInfoEntity[]> {
        try {
            return await this.departmentRepository.findByReviewAuthority(userId);
        } catch (error) {
            this.logger.error(`사용자 검토 권한 부서 조회 실패: ${userId}`, error);
            throw error;
        }
    }

    /**
     * 모든 부서 조회 (페이지네이션 없이)
     */
    async findAllDepartments(): Promise<DepartmentInfoEntity[]> {
        try {
            const result = await this.departmentRepository.findAll({ page: 1, limit: 1000 });
            return result.departments;
        } catch (error) {
            this.logger.error('모든 부서 조회 실패', error);
            throw error;
        }
    }

    /**
     * 부서 목록 조회 (페이지네이션)
     */
    async findAllDepartmentsPaginated(
        query: PaginationQueryDto,
        isExclude?: boolean,
    ): Promise<{ departments: DepartmentInfoEntity[]; total: number }> {
        try {
            return await this.departmentRepository.findAll(query, isExclude);
        } catch (error) {
            this.logger.error('부서 목록 조회 실패', error);
            throw error;
        }
    }

    /**
     * 부서 생성 또는 업데이트
     */
    async createOrUpdateDepartment(departmentData: Partial<DepartmentInfoEntity>): Promise<DepartmentInfoEntity> {
        try {
            if (departmentData.mmsDepartmentId) {
                const existingDepartment = await this.findDepartmentByMMSDepartmentId(departmentData.mmsDepartmentId);
                if (existingDepartment) {
                    // 기존 부서 업데이트
                    Object.assign(existingDepartment, departmentData);
                    return await this.departmentRepository.save(existingDepartment);
                }
            }

            // 새 부서 생성
            return await this.departmentRepository.create(departmentData);
        } catch (error) {
            this.logger.error('부서 생성/업데이트 실패', error);
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
            this.logger.error(`부서 제외 토글 실패: ${department.departmentId}`, error);
            throw error;
        }
    }

    /**
     * 부서 업데이트
     */
    async updateDepartment(
        departmentId: string,
        department: Partial<DepartmentInfoEntity>,
    ): Promise<DepartmentInfoEntity> {
        try {
            return await this.departmentRepository.update(departmentId, department);
        } catch (error) {
            this.logger.error(`부서 업데이트 실패: ${departmentId}`, error);
            throw error;
        }
    }

    /**
     * 부서 삭제
     */
    async removeDepartment(departmentId: string): Promise<boolean> {
        try {
            return await this.departmentRepository.delete(departmentId);
        } catch (error) {
            this.logger.error(`부서 삭제 실패: ${departmentId}`, error);
            throw error;
        }
    }

    /**
     * 부서 저장
     */
    async save(department: DepartmentInfoEntity): Promise<DepartmentInfoEntity> {
        try {
            return await this.departmentRepository.save(department);
        } catch (error) {
            this.logger.error('부서 저장 실패', error);
            throw error;
        }
    }

    /**
     * 직원 번호로 직원 조회
     */
    async findEmployeeByEmployeeNumber(employeeNumber: string): Promise<EmployeeInfoEntity | null> {
        try {
            return await this.departmentRepository.findEmployeeByEmployeeNumber(employeeNumber);
        } catch (error) {
            this.logger.error(`직원 조회 실패: ${employeeNumber}`, error);
            throw error;
        }
    }

    /**
     * 직원 저장
     */
    async saveEmployee(employee: EmployeeInfoEntity): Promise<EmployeeInfoEntity> {
        try {
            return await this.departmentRepository.saveEmployee(employee);
        } catch (error) {
            this.logger.error('직원 저장 실패', error);
            throw error;
        }
    }

    /**
     * 직원 ID로 부서 직원 관계 삭제
     */
    async deleteDepartmentEmployeeByEmployeeId(employeeId: string): Promise<void> {
        try {
            await this.departmentRepository.deleteDepartmentEmployeeByEmployeeId(employeeId);
        } catch (error) {
            this.logger.error(`부서 직원 관계 삭제 실패: ${employeeId}`, error);
            throw error;
        }
    }

    /**
     * 부서 직원 관계 저장
     */
    async saveDepartmentEmployee(departmentEmployee: DepartmentEmployeeEntity): Promise<DepartmentEmployeeEntity> {
        try {
            return await this.departmentRepository.saveDepartmentEmployee(departmentEmployee);
        } catch (error) {
            this.logger.error('부서 직원 관계 저장 실패', error);
            throw error;
        }
    }

    /**
     * 부서 계층 구조 조회
     */
    async findHierarchy(departmentId?: string): Promise<DepartmentInfoEntity[]> {
        try {
            return await this.departmentRepository.findHierarchy(departmentId);
        } catch (error) {
            this.logger.error('부서 계층 구조 조회 실패', error);
            throw error;
        }
    }

    /**
     * 부서 검색
     */
    async searchDepartments(searchTerm: string, userId?: string): Promise<DepartmentInfoEntity[]> {
        try {
            return await this.departmentRepository.search(searchTerm, userId);
        } catch (error) {
            this.logger.error('부서 검색 실패', error);
            throw error;
        }
    }

    /**
     * 부서 존재 여부 확인
     */
    async existsDepartment(departmentId: string): Promise<boolean> {
        try {
            return await this.departmentRepository.exists(departmentId);
        } catch (error) {
            this.logger.error(`부서 존재 확인 실패: ${departmentId}`, error);
            throw error;
        }
    }

    /**
     * 부서 코드 중복 확인
     */
    async existsDepartmentByCode(departmentCode: string, excludeId?: string): Promise<boolean> {
        try {
            return await this.departmentRepository.existsByCode(departmentCode, excludeId);
        } catch (error) {
            this.logger.error(`부서 코드 중복 확인 실패: ${departmentCode}`, error);
            throw error;
        }
    }

    /**
     * 부서 이름 중복 확인
     */
    async existsDepartmentByName(departmentName: string, excludeId?: string): Promise<boolean> {
        try {
            return await this.departmentRepository.existsByName(departmentName, excludeId);
        } catch (error) {
            this.logger.error(`부서 이름 중복 확인 실패: ${departmentName}`, error);
            throw error;
        }
    }
}
