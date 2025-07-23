import { UserContextService } from '@src/contexts/user/user-context.service';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { UserEntity } from '@src/domain/user/entities/user.entity';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { Injectable } from '@nestjs/common';
import { AuthorityType } from '@src/domain/user-department-authority/enum/authority-type.enum';
import { UserDepartmentAuthorityContext } from '@src/contexts/user-department-authority/user-department-authority-context';

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
     * 사용자 프로필 조회
     */
    async getUserProfile(userId: string): Promise<UserResponseDto> {
        if (!userId || userId.trim().length === 0) {
            throw new Error('사용자 ID가 필요합니다.');
        }

        return await this.userContextService.자신의_프로필을_조회한다(userId);
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
