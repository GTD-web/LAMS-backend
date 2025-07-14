import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from '../../interfaces/dto/auth/responses/auth-payload.dto';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { UserDomainService } from '@src/domain/user/services/user-domain.service';
import { LoginResponseDto } from '@src/interfaces/dto/auth/responses/login-response.dto';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';

/**
 * 인증 비즈니스 서비스
 * - 인증 관련 비즈니스 로직을 처리
 * - JWT 토큰 생성 및 검증 담당
 * - 검증 로직은 Domain Service에서 처리
 */
@Injectable()
export class AuthBusinessService {
    private readonly logger = new Logger(AuthBusinessService.name);

    constructor(private readonly userDomainService: UserDomainService, private readonly jwtService: JwtService) {}

    /**
     * 사용자 인증 - 검증 로직은 Domain Service에서 처리
     */
    async validateUser(email: string, password: string): Promise<AuthPayloadDto | null> {
        const user = await this.userDomainService.validateUserCredentials(email, password);

        if (!user) {
            return null;
        }

        return new AuthPayloadDto(user.userId, user.roles as UserRole[]);
    }

    /**
     * JWT 토큰 생성
     */
    private generateToken(payload: AuthPayloadDto): string {
        return this.jwtService.sign({
            sub: payload.sub,
            roles: payload.roles,
        });
    }

    /**
     * JWT 토큰 검증
     */
    verifyToken(token: string): AuthPayloadDto | null {
        try {
            if (!token || token.trim().length === 0) {
                return null;
            }

            // Bearer 토큰에서 실제 토큰 추출
            const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
            const decoded = this.jwtService.verify(cleanToken);

            return new AuthPayloadDto(decoded.sub, decoded.roles as UserRole[], decoded.exp);
        } catch (error) {
            return null;
        }
    }

    /**
     * 토큰 만료 확인
     */
    isTokenExpired(token: string): boolean {
        try {
            const payload = this.verifyToken(token);
            if (!payload || !payload.exp) {
                return true;
            }

            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp < currentTime;
        } catch (error) {
            return true;
        }
    }

    /**
     * 로그인 처리 - 검증 로직은 Domain Service에서 처리
     */
    async login(email: string, password: string): Promise<LoginResponseDto> {
        const user = await this.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException('잘못된 사용자명 또는 비밀번호입니다.');
        }

        const token = this.generateToken(user);

        // 비즈니스 크리티컬한 작업: 로그인 성공 로그
        this.logger.log(`로그인 성공: ${email} (사용자 ID: ${user.sub})`);

        return {
            token,
        };
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<LamsUserEntity> {
        return this.userDomainService.changeUserPassword(userId, currentPassword, newPassword);
    }

    /**
     * 토큰 검증 (별칭)
     */
    validateToken(token: string): AuthPayloadDto | null {
        return this.verifyToken(token);
    }

    /**
     * 토큰에서 사용자 정보 추출 (별칭)
     */
    extractUserFromToken(token: string): AuthPayloadDto | null {
        return this.verifyToken(token);
    }
}
