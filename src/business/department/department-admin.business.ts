import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { DepartmentDomainService } from '@src/domain/organization/department/services/department-domain.service';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { UserDomainService } from '@src/domain/user/services/user-domain.service';

/**
 * 부서 관리자 비즈니스 서비스
 * - 관리자 권한으로 접근 가능한 부서 관련 비즈니스 로직 처리
 * - 부서 CRUD, 권한 관리, MMS 동기화 등
 */
@Injectable()
export class DepartmentAdminBusinessService {
    private readonly logger = new Logger(DepartmentAdminBusinessService.name);

    constructor(
        private readonly departmentDomainService: DepartmentDomainService,
        private readonly userDomainService: UserDomainService,
    ) {}

    /**
     * 부서 목록 조회 (관리자용)
     */
    async getDepartmentList(
        query: PaginationQueryDto,
        isExclude: boolean,
    ): Promise<PaginatedResponseDto<DepartmentInfoEntity>> {
        try {
            const result = await this.departmentDomainService.findAllDepartmentsPaginated(query, isExclude);
            return PaginatedResponseDto.create(result.departments, query.page, query.limit, result.total);
        } catch (error) {
            this.logger.error('부서 목록 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 ID로 조회 (관리자용)
     */
    async getDepartmentById(departmentId: string): Promise<DepartmentInfoEntity> {
        try {
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
     * 부서 제외 상태 토글
     */
    async toggleDepartmentExclude(departmentId: string): Promise<DepartmentInfoEntity> {
        const department = await this.departmentDomainService.findDepartmentById(departmentId);

        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        try {
            const updatedDepartment = await this.departmentDomainService.toggleDepartmentExclude(department);
            this.logger.log(`부서 제외 상태 토글 완료: ${updatedDepartment.departmentName}`);

            return updatedDepartment;
        } catch (error) {
            this.logger.error('부서 제외 상태 토글 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 접근 권한 추가
     */
    async includeAccessAuthority(departmentId: string, userId: string): Promise<any> {
        try {
            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            const department = await this.departmentDomainService.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            department.includeAccessAuthority(user);
            user.includeAccessableDepartment(department);

            await this.userDomainService.updateUser(userId, user);
            await this.departmentDomainService.updateDepartment(departmentId, department);

            this.logger.log(`접근 권한 추가: 부서 ${departmentId}, 사용자 ${userId}`);
            return { success: true };
        } catch (error) {
            this.logger.error('접근 권한 추가 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 검토 권한 추가
     */
    async includeReviewAuthority(departmentId: string, userId: string): Promise<any> {
        try {
            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            const department = await this.departmentDomainService.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            department.includeReviewAuthority(user);
            user.includeReviewableDepartment(department);

            await this.userDomainService.updateUser(userId, user);
            await this.departmentDomainService.updateDepartment(departmentId, department);

            this.logger.log(`검토 권한 추가: 부서 ${departmentId}, 사용자 ${userId}`);
            return { success: true };
        } catch (error) {
            this.logger.error('검토 권한 추가 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 접근 권한 제거
     */
    async removeAccessAuthority(departmentId: string, userId: string): Promise<any> {
        try {
            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            const department = await this.departmentDomainService.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            department.excludeAccessAuthority(user);
            user.excludeAccessableDepartment(department);

            await this.userDomainService.updateUser(userId, user);
            await this.departmentDomainService.updateDepartment(departmentId, department);

            this.logger.log(`접근 권한 제거: 부서 ${departmentId}, 사용자 ${userId}`);
            return { success: true };
        } catch (error) {
            this.logger.error('접근 권한 제거 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 검토 권한 제거
     */
    async removeReviewAuthority(departmentId: string, userId: string): Promise<any> {
        try {
            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }
            const department = await this.departmentDomainService.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            department.excludeReviewAuthority(user);
            user.excludeReviewableDepartment(department);

            await this.userDomainService.updateUser(userId, user);
            await this.departmentDomainService.updateDepartment(departmentId, department);

            this.logger.log(`검토 권한 제거: 부서 ${departmentId}, 사용자 ${userId}`);
            return { success: true };
        } catch (error) {
            this.logger.error('검토 권한 제거 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 직원 수 조회
     */
    async getDepartmentEmployeeCount(departmentId: string): Promise<{ departmentId: string; employeeCount: number }> {
        try {
            const department = await this.departmentDomainService.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            const employeeCount = department.employees?.length || 0;
            return { departmentId, employeeCount };
        } catch (error) {
            this.logger.error('부서 직원 수 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * MMS 동기화
     */
    async syncMMS(): Promise<any> {
        try {
            // TODO: MMS 동기화 로직 구현 필요
            this.logger.log('MMS 동기화 시작');

            // 임시 응답
            return {
                success: true,
                syncedCount: 0,
                message: 'MMS 동기화 기능이 아직 구현되지 않았습니다.',
            };
        } catch (error) {
            this.logger.error('MMS 동기화 실패', error.stack);
            throw error;
        }
    }
}
