import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { DepartmentDomainService } from '@src/domain/organization/department/services/department-domain.service';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';

/**
 * 부서 일반 사용자 비즈니스 서비스
 * - 일반 사용자 권한으로 접근 가능한 부서 관련 비즈니스 로직 처리
 * - 부서 조회, 권한 기반 부서 목록 조회 등
 */
@Injectable()
export class DepartmentBusinessService {
    private readonly logger = new Logger(DepartmentBusinessService.name);

    constructor(private readonly departmentDomainService: DepartmentDomainService) {}

    /**
     * 권한 기반 부서 ID로 조회
     */
    async getAuthorityDepartmentById(departmentId: string): Promise<DepartmentInfoEntity> {
        try {
            if (!departmentId) {
                throw new BadRequestException('부서 ID는 필수입니다.');
            }

            const department = await this.departmentDomainService.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            return department;
        } catch (error) {
            this.logger.error('권한 기반 부서 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 접근 권한에 포함된 부서 조회
     */
    async getDepartmentByAccessAuthority(user: LamsUserEntity): Promise<DepartmentInfoEntity[]> {
        try {
            if (!user?.userId) {
                throw new BadRequestException('사용자 정보가 필요합니다.');
            }

            const departments = await this.departmentDomainService.findDepartmentsByAccessAuthority(user.userId);
            this.logger.log(`사용자 ${user.userId}의 접근 권한 부서 조회 완료: ${departments.length}개`);

            return departments;
        } catch (error) {
            this.logger.error('접근 권한 부서 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 ID로 조회 (이벤트 핸들러)
     */
    @OnEvent('department.find-by-id')
    async getDepartmentById(departmentId: string): Promise<DepartmentInfoEntity> {
        try {
            if (!departmentId) {
                throw new BadRequestException('부서 ID는 필수입니다.');
            }

            const department = await this.departmentDomainService.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            return department;
        } catch (error) {
            this.logger.error('부서 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 모든 부서 목록 조회 (일반 사용자용)
     */
    async getAllDepartments(): Promise<DepartmentInfoEntity[]> {
        try {
            const result = await this.departmentDomainService.findAllDepartments({ page: 1, limit: 1000 }, false);
            this.logger.log(`전체 부서 목록 조회 완료: ${result.departments.length}개`);

            return result.departments;
        } catch (error) {
            this.logger.error('전체 부서 목록 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 계층 구조 조회 (현재 구현되지 않음)
     */
    async getDepartmentHierarchy(): Promise<DepartmentInfoEntity[]> {
        try {
            // TODO: 도메인 서비스에 계층 구조 조회 메서드 추가 필요
            this.logger.warn('부서 계층 구조 조회 기능이 아직 구현되지 않았습니다.');
            return await this.getAllDepartments();
        } catch (error) {
            this.logger.error('부서 계층 구조 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 상세 정보 조회
     */
    async getDepartmentDetail(departmentId: string): Promise<DepartmentInfoEntity> {
        try {
            if (!departmentId) {
                throw new BadRequestException('부서 ID는 필수입니다.');
            }

            const department = await this.departmentDomainService.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            return department;
        } catch (error) {
            this.logger.error('부서 상세 정보 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 사용자의 검토 권한 부서 조회 (현재 구현되지 않음)
     */
    async getDepartmentsByReviewAuthority(user: LamsUserEntity): Promise<DepartmentInfoEntity[]> {
        try {
            if (!user?.userId) {
                throw new BadRequestException('사용자 정보가 필요합니다.');
            }

            // TODO: 도메인 서비스에 검토 권한 부서 조회 메서드 추가 필요
            this.logger.warn('검토 권한 부서 조회 기능이 아직 구현되지 않았습니다.');
            return [];
        } catch (error) {
            this.logger.error('검토 권한 부서 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 검색 (현재 구현되지 않음)
     */
    async searchDepartments(searchTerm: string): Promise<DepartmentInfoEntity[]> {
        try {
            if (!searchTerm || searchTerm.trim().length < 2) {
                throw new BadRequestException('검색어는 최소 2자 이상이어야 합니다.');
            }

            // TODO: 도메인 서비스에 검색 메서드 추가 필요
            this.logger.warn('부서 검색 기능이 아직 구현되지 않았습니다.');
            return [];
        } catch (error) {
            this.logger.error('부서 검색 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서별 직원 수 조회 (현재 구현되지 않음)
     */
    async getDepartmentEmployeeCount(departmentId: string): Promise<number> {
        try {
            if (!departmentId) {
                throw new BadRequestException('부서 ID는 필수입니다.');
            }

            // TODO: 도메인 서비스에 직원 수 조회 메서드 추가 필요
            this.logger.warn('부서 직원 수 조회 기능이 아직 구현되지 않았습니다.');
            return 0;
        } catch (error) {
            this.logger.error('부서 직원 수 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 활성 부서 목록 조회 (제외되지 않은 부서만)
     */
    async getActiveDepartments(): Promise<DepartmentInfoEntity[]> {
        try {
            const result = await this.departmentDomainService.findAllDepartments({ page: 1, limit: 1000 }, false);
            this.logger.log(`활성 부서 목록 조회 완료: ${result.departments.length}개`);

            return result.departments;
        } catch (error) {
            this.logger.error('활성 부서 목록 조회 실패', error.stack);
            throw error;
        }
    }
}
