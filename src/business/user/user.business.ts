import { Injectable, Logger } from '@nestjs/common';
import { UserContextService } from '@src/contexts/user/user-context.service';
import { AuthContextService } from '@src/contexts/auth/auth-user-context.service';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';

/**
 * 사용자 비즈니스 서비스
 * - 사용자 관리 관련 비즈니스 로직을 처리
 * - 컨텍스트 서비스를 통해 실제 작업 수행
 */
@Injectable()
export class UserBusinessService {
    private readonly logger = new Logger(UserBusinessService.name);

    constructor(
        private readonly userContextService: UserContextService,
        private readonly authContextService: AuthContextService,
    ) {}

    /**
     * 사용자 목록 조회
     * docs: getUserList(limit: number, page: number)
     */
    async getUserList(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
        const { page = 1, limit = 10 } = paginationQuery;

        return this.authContextService.페이지네이션된_사용자_목록을_조회한다(paginationQuery);
    }

    /**
     * 사용자 프로필 조회
     * docs: getProfile(token: string)
     */
    async getProfile(userId: string): Promise<UserResponseDto> {
        return this.authContextService.자신의_프로필을_조회한다(userId);
    }

    /**
     * 사용자 검토 권한 추가
     * docs: addUserReviewPermission(departmentId: string, userId: string)
     */
    async addUserReviewPermission(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        return this.authContextService.부서의_검토_권한에_사용자를_추가한다(departmentId, userId);
    }

    /**
     * 사용자 검토 권한 삭제
     * docs: removeUserReviewPermission(departmentId: string, userId: string)
     */
    async removeUserReviewPermission(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        return this.authContextService.부서의_검토_권한에_사용자를_삭제한다(departmentId, userId);
    }

    /**
     * 사용자 승인 권한 추가
     * docs: addUserApprovalPermission(departmentId: string, userId: string)
     */
    async addUserApprovalPermission(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        return this.authContextService.부서의_리뷰_권한에_사용자를_추가한다(departmentId, userId);
    }

    /**
     * 사용자 승인 권한 삭제
     * docs: removeUserApprovalPermission(departmentId: string, userId: string)
     */
    async removeUserApprovalPermission(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        return this.authContextService.부서의_리뷰_권한에_사용자를_삭제한다(departmentId, userId);
    }

    /**
     * 통합 부서 권한 관리
     * 요구사항에 따른 통합 API를 위한 메서드
     */
    async manageDepartmentAuthority(
        departmentId: string,
        userId: string,
        action: 'add' | 'delete',
        type: 'access' | 'review',
    ): Promise<DepartmentInfoEntity> {
        if (type === 'review') {
            if (action === 'add') {
                return this.addUserReviewPermission(departmentId, userId);
            } else {
                return this.removeUserReviewPermission(departmentId, userId);
            }
        } else {
            if (action === 'add') {
                return this.addUserApprovalPermission(departmentId, userId);
            } else {
                return this.removeUserApprovalPermission(departmentId, userId);
            }
        }
    }

    /**
     * 사용자 부서 권한 조회
     */
    async getUserDepartmentAuthorities(userId: string): Promise<{
        accessDepartments: DepartmentInfoEntity[];
        reviewDepartments: DepartmentInfoEntity[];
    }> {
        return this.userContextService.사용자의_부서_권한을_조회한다(userId);
    }
}
