import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDomainService } from '../../domain/user/services/user-domain.service';
import { UserResponseDto } from '../../business/user/dto/user-response.dto';
import { PaginationQueryDto } from '../../common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '../../common/dtos/pagination/pagination-response.dto';
import { plainToInstance } from 'class-transformer';

import { UserEntity } from '../../domain/user/entities/user.entity';

/**
 * 통합 사용자 컨텍스트 서비스
 * - 사용자 인증과 사용자 관리 관련 컨텍스트를 통합 처리
 * - 토큰 검증, 사용자 상태 확인, 프로필 조회, 권한 관리 등의 컨텍스트 정보 제공
 */
@Injectable()
export class UserContextService {
    constructor(private readonly userDomainService: UserDomainService, private readonly jwtService: JwtService) {}

    // ==================== 인증 관련 메서드 ====================

    /**
     * 사용자는 아이디와 패스워드를 검증한다
     */
    async 아이디와_패스워드를_검증하고_활성화_상태를_검증한다(loginId: string, password: string): Promise<UserEntity> {
        const user = await this.userDomainService.validateUserCredentials(loginId, password);

        if (!user.isActive) {
            throw new UnauthorizedException('비활성화된 사용자입니다.');
        }

        return user;
    }

    /**
     * 사용자의 토큰을 제공한다
     */
    async 사용자의_토큰을_제공한다(user: UserEntity): Promise<string> {
        return this.jwtService.sign({ sub: user.userId, roles: user.roles });
    }

    // ==================== 사용자 관리 메서드 ====================

    /**
     * 페이지네이션된 사용자 목록을 조회한다
     */
    async 페이지네이션된_사용자_목록을_조회한다(
        paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedResponseDto<UserResponseDto>> {
        return await this.userDomainService.findPaginatedUsers(paginationQuery);
    }

    /**
     * 사용자 비밀번호를 변경한다
     */
    async 사용자_비밀번호를_변경한다(
        userId: string,
        currentPassword: string,
        newPassword: string,
    ): Promise<UserEntity> {
        return this.userDomainService.changeUserPassword(userId, currentPassword, newPassword);
    }

    /**
     * 사용자를 조회한다
     */
    async findUserById(userId: string): Promise<UserEntity> {
        return await this.userDomainService.findUserById(userId);
    }
}
