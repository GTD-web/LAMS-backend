import { ForbiddenException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDomainService } from '@src/domain/user/services/user-domain.service';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto, PaginationMetaDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { plainToInstance } from 'class-transformer';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { AuthPayloadDto } from '@src/interfaces/dto/auth/responses/auth-payload.dto';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { UserEntity } from '@src/domain/user/entities/user.entity';

/**
 * 통합 사용자 컨텍스트 서비스
 * - 사용자 인증과 사용자 관리 관련 컨텍스트를 통합 처리
 * - 토큰 검증, 사용자 상태 확인, 프로필 조회, 권한 관리 등의 컨텍스트 정보 제공
 */
@Injectable()
export class UserContextService {
    private readonly logger = new Logger(UserContextService.name);

    constructor(private readonly userDomainService: UserDomainService, private readonly jwtService: JwtService) {}

    // ==================== 인증 관련 메서드 ====================

    /**
     * 사용자는 토큰을 검증받는다
     */
    async 사용자는_토큰을_검증받는다(token: string): Promise<UserEntity> {
        if (!token || token.trim().length === 0) {
            throw new UnauthorizedException('토큰이 제공되지 않았습니다.');
        }

        // Bearer 토큰에서 실제 토큰 추출
        const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;

        let payload: any;
        try {
            payload = this.jwtService.verify(cleanToken);
        } catch (error) {
            this.logger.warn(`토큰 검증 실패: ${error.message}`);
            throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }

        const user = await this.userDomainService.findUserById(payload.sub);
        if (!user) {
            this.logger.warn(`토큰의 사용자를 찾을 수 없음: ${payload.sub}`);
            throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
        }

        if (!user.isActive) {
            this.logger.warn(`비활성화된 사용자의 토큰 사용: ${user.email}`);
            throw new UnauthorizedException('비활성화된 사용자입니다.');
        }

        this.logger.log(`토큰 검증 성공: ${user.email}`);
        return user;
    }

    /**
     * 사용자의 현재 세션 정보를 조회한다
     */
    async 사용자의_현재_세션_정보를_조회한다(userId: string): Promise<{
        user: UserEntity;
        sessionValid: boolean;
        roles: UserRole[];
    }> {
        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
        }

        const sessionValid = user.isActive;
        const roles = user.roles as UserRole[];

        this.logger.log(`세션 정보 조회 성공: ${user.email}`);
        return {
            user,
            sessionValid,
            roles,
        };
    }

    /**
     * 사용자의 권한을 확인한다
     */
    async 사용자의_권한을_확인한다(userId: string, requiredRoles: UserRole[]): Promise<boolean> {
        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('비활성화된 사용자입니다.');
        }

        const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role));
        if (!hasRequiredRole) {
            this.logger.warn(`권한 부족: ${user.email}, 필요한 역할: ${requiredRoles.join(', ')}`);
            return false;
        }

        this.logger.log(`권한 확인 성공: ${user.email}`);
        return true;
    }

    /**
     * 토큰에서 사용자 정보를 추출한다
     */
    extractUserFromToken(token: string): AuthPayloadDto | null {
        try {
            if (!token || token.trim().length === 0) {
                return null;
            }

            const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
            const payload = this.jwtService.verify(cleanToken);

            return new AuthPayloadDto(payload.sub, payload.roles);
        } catch (error) {
            this.logger.warn(`토큰에서 사용자 정보 추출 실패: ${error.message}`);
            return null;
        }
    }

    /**
     * 토큰이 만료되었는지 확인한다
     */
    isTokenExpired(token: string): boolean {
        try {
            const payload = this.extractUserFromToken(token);
            if (!payload || !payload.exp) {
                return true;
            }

            return payload.isExpired();
        } catch (error) {
            this.logger.warn(`토큰 만료 확인 실패: ${error.message}`);
            return true;
        }
    }

    /**
     * 사용자 권한 검증
     */
    async validateUserPermission(
        requestUserId: string,
        targetUserId?: string,
        requiredRoles?: UserRole[],
    ): Promise<boolean> {
        const user = await this.userDomainService.findUserById(requestUserId);
        if (!user) {
            throw new ForbiddenException('사용자를 찾을 수 없습니다.');
        }

        // 본인 확인
        if (targetUserId && requestUserId === targetUserId) {
            return true;
        }

        // 관리자 권한 확인
        if (requiredRoles && requiredRoles.length > 0) {
            const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role));
            if (!hasRequiredRole) {
                throw new ForbiddenException('해당 작업을 수행할 권한이 없습니다.');
            }
        }

        return true;
    }

    // ==================== 사용자 관리 메서드 ====================

    /**
     * 자신의 프로필을 조회한다
     */
    async 자신의_프로필을_조회한다(userId: string): Promise<UserResponseDto> {
        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        this.logger.log(`프로필 조회 성공: ${user.email}`);
        return plainToInstance(UserResponseDto, user);
    }

    /**
     * 사용자의 프로필을 조회한다
     */
    async 사용자의_프로필을_조회한다(userId: string): Promise<UserResponseDto> {
        return this.자신의_프로필을_조회한다(userId);
    }

    /**
     * 페이지네이션된 사용자 목록을 조회한다
     */
    async 페이지네이션된_사용자_목록을_조회한다(
        paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedResponseDto<UserResponseDto>> {
        const { page = 1, limit = 10 } = paginationQuery;
        const result = await this.userDomainService.findPaginatedUsers(page, limit);

        const userDtos = result.users.map((user) => plainToInstance(UserResponseDto, user));
        const meta = new PaginationMetaDto(page, limit, result.total);
        const paginatedResult = new PaginatedResponseDto(userDtos, meta);

        this.logger.log(`사용자 목록 조회 성공: ${result.users.length}명 조회`);
        return paginatedResult;
    }

    // ==================== Domain 서비스 위임 메서드 ====================

    /**
     * 사용자를 ID로 조회한다
     */
    async findUserById(userId: string): Promise<UserEntity | null> {
        return this.userDomainService.findUserById(userId);
    }

    /**
     * 사용자를 이메일로 조회한다
     */
    async findUserByEmail(email: string): Promise<UserEntity | null> {
        return this.userDomainService.findUserByEmail(email);
    }

    /**
     * 사용자 비밀번호를 변경한다
     */
    async changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<UserEntity> {
        return this.userDomainService.changeUserPassword(userId, currentPassword, newPassword);
    }

    // ==================== 권한 관리 메서드 ====================

    /**
     * 부서의 검토 권한에 사용자를 추가한다 (권한 관리는 복잡한 비즈니스 로직이므로 try-catch 유지)
     */
    async 사용자의_부서_권한을_변경한다(
        userId: string,
        department: DepartmentInfoEntity,
        type: 'access' | 'review',
        action: 'add' | 'remove',
    ): Promise<UserEntity> {
        const user = await this.userDomainService.findUserById(userId);
        return this.userDomainService.updateUserAuthority(user, department, type, action);
    }
}
