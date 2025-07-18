import { Injectable, Logger } from '@nestjs/common';
import { UserContextService } from '@src/contexts/user/user-context.service';
import { AuthContextService } from '@src/contexts/auth/auth-user-context.service';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { SearchUserDto } from '@src/interfaces/dto/user/requests/search-user.dto';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { SuccessMessageHelper } from '@src/common/helpers/success-message.helper';
import { PaginatedSuccessResponse, SuccessResponseWithData } from '@src/common/types/success-response.type';

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
    async getUserList(paginationQuery: PaginationQueryDto): Promise<PaginatedSuccessResponse<UserResponseDto>> {
        if (!paginationQuery.page || !paginationQuery.limit) {
            throw new Error('페이지 정보가 필요합니다.');
        }

        const result = await this.authContextService.페이지네이션된_사용자_목록을_조회한다(paginationQuery);

        return SuccessMessageHelper.createPaginatedSuccessResponse(
            SuccessMessageHelper.MESSAGES.USER_LIST_RETRIEVED,
            result.data || [],
            result.meta || { page: 1, limit: 10, total: 0, totalPages: 0 },
        );
    }

    /**
     * 사용자 검색
     */
    async searchUsers(
        searchDto: SearchUserDto,
        paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedSuccessResponse<UserResponseDto>> {
        const { page = 1, limit = 10 } = paginationQuery;
        const offset = (page - 1) * limit;

        const searchCriteria = {
            ...searchDto,
            limit,
            offset,
        };

        const result = await this.userContextService.사용자를_검색한다(searchCriteria);

        const totalPages = Math.ceil(result.total / limit);

        return SuccessMessageHelper.createPaginatedSuccessResponse(
            SuccessMessageHelper.MESSAGES.USER_SEARCHED,
            result.data || [],
            {
                page,
                limit,
                total: result.total,
                totalPages,
            },
        );
    }

    /**
     * 사용자 프로필 조회
     * docs: getProfile(userId: string)
     */
    async getUserProfile(userId: string): Promise<SuccessResponseWithData<UserResponseDto>> {
        if (!userId || userId.trim().length === 0) {
            throw new Error('사용자 ID가 필요합니다.');
        }

        const result = await this.getProfile(userId);

        return SuccessMessageHelper.createRetrievalSuccessResponse(
            SuccessMessageHelper.MESSAGES.USER_PROFILE_RETRIEVED,
            result,
        );
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
    async addUserReviewPermission(departmentId: string, userId: string): Promise<void> {
        if (!departmentId || !userId) {
            throw new Error('부서 ID와 사용자 ID가 필요합니다.');
        }

        await this.userContextService.부서의_검토_권한에_사용자를_추가한다(departmentId, userId);
    }

    /**
     * 사용자 검토 권한 삭제
     * docs: removeUserReviewPermission(departmentId: string, userId: string)
     */
    async removeUserReviewPermission(departmentId: string, userId: string): Promise<void> {
        if (!departmentId || !userId) {
            throw new Error('부서 ID와 사용자 ID가 필요합니다.');
        }

        await this.userContextService.부서의_검토_권한에서_사용자를_삭제한다(departmentId, userId);
    }

    /**
     * 사용자 접근 권한 추가
     * docs: addUserApprovalPermission(departmentId: string, userId: string)
     */
    async addUserApprovalPermission(departmentId: string, userId: string): Promise<void> {
        if (!departmentId || !userId) {
            throw new Error('부서 ID와 사용자 ID가 필요합니다.');
        }

        await this.userContextService.부서의_접근_권한에_사용자를_추가한다(departmentId, userId);
    }

    /**
     * 사용자 접근 권한 삭제
     * docs: removeUserApprovalPermission(departmentId: string, userId: string)
     */
    async removeUserApprovalPermission(departmentId: string, userId: string): Promise<void> {
        if (!departmentId || !userId) {
            throw new Error('부서 ID와 사용자 ID가 필요합니다.');
        }

        await this.userContextService.부서의_접근_권한에서_사용자를_삭제한다(departmentId, userId);
    }

    /**
     * 부서 권한 관리 (복잡한 비즈니스 로직이므로 try-catch 유지)
     * docs: manageDepartmentAuthority(departmentId: string, userId: string, type: string, action: string)
     */
    async manageDepartmentAuthority(
        departmentId: string,
        userId: string,
        type: 'access' | 'review',
        action: 'add' | 'delete',
    ): Promise<SuccessResponseWithData<any>> {
        try {
            if (!departmentId || !userId) {
                throw new Error('부서 ID와 사용자 ID가 필요합니다.');
            }

            if (type === 'access') {
                if (action === 'add') {
                    await this.userContextService.부서의_접근_권한에_사용자를_추가한다(departmentId, userId);
                } else {
                    await this.userContextService.부서의_접근_권한에서_사용자를_삭제한다(departmentId, userId);
                }
            } else {
                if (action === 'add') {
                    await this.userContextService.부서의_검토_권한에_사용자를_추가한다(departmentId, userId);
                } else {
                    await this.userContextService.부서의_검토_권한에서_사용자를_삭제한다(departmentId, userId);
                }
            }

            const actionText = action === 'add' ? '추가' : '삭제';
            const typeText = type === 'access' ? '접근' : '검토';

            const result = {
                departmentId,
                userId,
                type,
                action,
                message: `${typeText} 권한 ${actionText} 완료`,
            };

            return SuccessMessageHelper.createUpdateSuccessResponse(
                SuccessMessageHelper.MESSAGES.DEPARTMENT_AUTHORITY_UPDATED,
                result,
                [`${type}_authority`],
            );
        } catch (error) {
            this.logger.error(`부서 권한 관리 실패: ${departmentId}, ${userId}, ${type}, ${action}`, error.stack);
            throw new Error('부서 권한 관리 중 오류가 발생했습니다.');
        }
    }
}
