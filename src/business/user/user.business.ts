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
     * docs: getProfile(userId: string)
     */
    async getUserProfile(userId: string): Promise<UserResponseDto> {
        return this.getProfile(userId);
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
     * 부서 권한 관리
     * docs: manageDepartmentAuthority(departmentId: string, userId: string, type: string, action: string)
     */
    async manageDepartmentAuthority(
        departmentId: string,
        userId: string,
        type: 'access' | 'review',
        action: 'add' | 'delete',
    ): Promise<any> {
        let updatedDepartment;

        if (type === 'access') {
            if (action === 'add') {
                updatedDepartment = await this.authContextService.부서의_리뷰_권한에_사용자를_추가한다(
                    departmentId,
                    userId,
                );
            } else {
                updatedDepartment = await this.authContextService.부서의_리뷰_권한에_사용자를_삭제한다(
                    departmentId,
                    userId,
                );
            }
        } else {
            if (action === 'add') {
                updatedDepartment = await this.authContextService.부서의_검토_권한에_사용자를_추가한다(
                    departmentId,
                    userId,
                );
            } else {
                updatedDepartment = await this.authContextService.부서의_검토_권한에_사용자를_삭제한다(
                    departmentId,
                    userId,
                );
            }
        }

        const actionText = action === 'add' ? '추가' : '삭제';
        const typeText = type === 'access' ? '접근' : '검토';

        this.logger.log(`부서 권한 관리 성공: ${departmentId} -> ${userId} (${typeText} ${actionText})`);

        return {
            departmentId: updatedDepartment.departmentId,
            departmentName: updatedDepartment.departmentName,
            userId,
            authorityType: type,
            action,
            success: true,
            message: `부서 ${typeText} 권한이 성공적으로 ${actionText}되었습니다.`,
        };
    }

    /**
     * 사용자 부서 권한 조회
     * docs: getUserDepartmentAuthorities(userId: string)
     */
    async getUserDepartmentAuthorities(userId: string): Promise<{
        userId: string;
        reviewDepartments: string[];
        accessDepartments: string[];
    }> {
        const authorities = await this.userContextService.사용자의_부서_권한_정보를_조회한다(userId);

        this.logger.log(`사용자 부서 권한 조회 성공: ${userId}`);

        return {
            userId,
            reviewDepartments: authorities.reviewDepartments.map((dept) => dept.departmentId),
            accessDepartments: authorities.accessDepartments.map((dept) => dept.departmentId),
        };
    }
}
