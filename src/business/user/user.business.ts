import { UserContextService } from '../../contexts/user/user-context.service';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginationQueryDto } from '../../common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '../../common/dtos/pagination/pagination-response.dto';
import { Injectable } from '@nestjs/common';
import { AuthorityType } from '../../domain/user-department-authority/enum/authority-type.enum';
import { UserDepartmentAuthorityContext } from '../../contexts/user-department-authority/user-department-authority-context';
import { UserWithDepartmentAuthorityResponseDto } from './dto/user-with-department-authority-response.dto';
import { UserRole } from '../../domain/user/enum/user.enum';

/**
 * 사용자 비즈니스 서비스
 * - 사용자 관리 관련 비즈니스 로직을 처리
 * - 컨텍스트 서비스를 통해 실제 작업 수행
 */
@Injectable()
export class UserBusinessService {
    constructor(
        private readonly userContextService: UserContextService,
        private readonly userDepartmentAuthorityContext: UserDepartmentAuthorityContext,
    ) {}

    /**
     * 사용자 목록 조회
     */
    async getUserList(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
        return await this.userContextService.페이지네이션된_사용자_목록을_조회한다(paginationQuery);
    }

    /**
     * 사용자 상세 조회 권한 포함
     */
    async getUserByIdWithDepartmentAuthority(userId: string): Promise<UserWithDepartmentAuthorityResponseDto> {
        const user = await this.userContextService.findUserById(userId);

        // 사용자가 없으면 빈 값 반환
        if (!user) {
            return null;
        }

        const userDepartmentAuthority =
            await this.userDepartmentAuthorityContext.사용자의_부서_권한을_조회_부서목록을_반환한다(userId);

        return new UserWithDepartmentAuthorityResponseDto({
            userId: user.userId,
            username: user.username,
            email: user.email,
            roles: user.roles as UserRole[],
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            accessableDepartments: userDepartmentAuthority.accessableDepartments,
            reviewableDepartments: userDepartmentAuthority.reviewableDepartments,
        });
    }

    /**
     * 사용자에게 부서 권한 부여
     */
    async grantAuthority(userId: string, departmentId: string, authorityType: AuthorityType): Promise<boolean> {
        return await this.userDepartmentAuthorityContext.사용자의_부서_권한을_추가한다(
            userId,
            departmentId,
            authorityType,
        );
    }

    /**
     * 사용자의 부서 권한 삭제
     */
    async removeAuthority(userId: string, departmentId: string, authorityType: AuthorityType): Promise<boolean> {
        return await this.userDepartmentAuthorityContext.사용자의_부서_권한을_삭제한다(
            userId,
            departmentId,
            authorityType,
        );
    }
}
