import { Injectable, Logger } from '@nestjs/common';
import { UserContextService } from '@src/contexts/user/user-context.service';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { SearchUserDto } from '@src/interfaces/dto/user/requests/search-user.dto';
import { SuccessMessageHelper } from '@src/common/helpers/success-message.helper';
import { PaginatedSuccessResponse, SuccessResponseWithData } from '@src/common/types/success-response.type';
import { UserEntity } from '@src/domain/user/entities/user.entity';
import { OrganizationContextService } from '@src/contexts/organization/organization-context.service';

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
        private readonly organizationContextService: OrganizationContextService,
    ) {}

    /**
     * 사용자 목록 조회
     */
    async getUserList(paginationQuery: PaginationQueryDto): Promise<PaginatedSuccessResponse<UserResponseDto>> {
        if (!paginationQuery.page || !paginationQuery.limit) {
            throw new Error('페이지 정보가 필요합니다.');
        }

        const result = await this.userContextService.페이지네이션된_사용자_목록을_조회한다(paginationQuery);

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
     */
    async getProfile(userId: string): Promise<UserResponseDto> {
        return this.userContextService.자신의_프로필을_조회한다(userId);
    }

    /**
     * 부서 권한 관리 (복잡한 비즈니스 로직이므로 try-catch 유지)
     */
    async manageDepartmentAuthority(
        departmentId: string,
        userId: string,
        type: 'access' | 'review',
        action: 'add' | 'remove',
    ): Promise<SuccessResponseWithData<UserEntity>> {
        try {
            if (!departmentId || !userId) {
                throw new Error('부서 ID와 사용자 ID가 필요합니다.');
            }

            const department = await this.organizationContextService.findDepartmentById(departmentId);

            const updatedUser = await this.userContextService.사용자의_부서_권한을_변경한다(
                userId,
                department,
                type,
                action,
            );

            return SuccessMessageHelper.createUpdateSuccessResponse(
                SuccessMessageHelper.MESSAGES.DEPARTMENT_AUTHORITY_UPDATED,
                updatedUser,
                [`${type}_authority`],
            );
        } catch (error) {
            this.logger.error(`부서 권한 관리 실패: ${departmentId}, ${userId}, ${type}, ${action}`, error.stack);
            throw new Error('부서 권한 관리 중 오류가 발생했습니다.');
        }
    }
}
