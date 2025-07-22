import { Injectable, UnauthorizedException, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from '../../interfaces/dto/auth/responses/auth-payload.dto';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { LoginResponseDto } from '@src/interfaces/dto/auth/responses/login-response.dto';
import { UserEntity } from '@src/domain/user/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { UserContextService } from '@src/contexts/user/user-context.service';

/**
 * 인증 비즈니스 서비스
 * - 사용자 인증 관련 비즈니스 로직을 처리
 * - JWT 토큰 생성 및 검증 담당
 * - 컨텍스트 서비스를 통해 실제 작업 수행
 */
@Injectable()
export class AuthBusinessService {
    private readonly logger = new Logger(AuthBusinessService.name);

    constructor(private readonly userContextService: UserContextService, private readonly jwtService: JwtService) {}

    /**
     * 로그인 처리 (복잡한 비즈니스 로직이므로 try-catch 유지)
     */
    async login(loginId: string, password: string): Promise<LoginResponseDto> {
        try {
            // 1. 사용자 아이디와 패스워드 검증
            await this.사용자는_아이디와_패스워드를_검증한다(loginId, password);

            // 2. 사용자 활성화 상태 검증
            await this.사용자의_활성화_상태를_검증한다(user.userId);

            // 3. 사용자 토큰 제공
            const token = await this.사용자의_토큰을_제공한다(user.userId);

            // 4. 로그인 성공 로그
            this.logger.log(`로그인 성공: ${loginId} (사용자 ID: ${user.userId})`);

            return {
                token,
                user: plainToInstance(UserResponseDto, user),
            };
        } catch (error) {
            this.logger.error(`로그인 실패: ${loginId}`, error.stack);
            throw error;
        }
    }

    /**
     * 프로필 조회
     */
    async getProfile(token: string, userId: string): Promise<UserResponseDto> {
        // 1. 토큰 검증
        await this.userContextService.사용자는_토큰을_검증받는다(token);

        // 2. 프로필 조회
        return this.userContextService.자신의_프로필을_조회한다(userId);
    }

    /**
     * JWT 토큰 검증
     */
    verifyToken(token: string): boolean {
        try {
            if (!token || token.trim().length === 0) {
                return false;
            }

            // Bearer 토큰에서 실제 토큰 추출
            const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
            const decoded = this.jwtService.verify(cleanToken);

            return !!decoded;
        } catch (error) {
            this.logger.warn(`토큰 검증 실패: ${token}`, error.message);
            return false;
        }
    }

    /**
     * 사용자의 프로필을 조회한다
     */
    async 사용자의_프로필을_조회한다(userId: string): Promise<UserResponseDto> {
        return this.userContextService.자신의_프로필을_조회한다(userId);
    }

    /**
     * 비밀번호를 변경한다
     */
    async 비밀번호를_변경한다(userId: string, currentPassword: string, newPassword: string): Promise<UserResponseDto> {
        const updatedUser = await this.userContextService.changeUserPassword(userId, currentPassword, newPassword);

        this.logger.log(`비밀번호 변경 성공: ${updatedUser.email}`);
        return plainToInstance(UserResponseDto, updatedUser);
    }

    /**
     * 사용자 인증 검증 - 기존 호환성 유지
     */
    async validateUser(email: string, password: string): Promise<AuthPayloadDto | null> {
        const user = await this.사용자는_아이디와_패스워드를_검증한다(email, password);
        if (!user) {
            return null;
        }

        await this.사용자의_활성화_상태를_검증한다(user.userId);
        return new AuthPayloadDto(user.userId, user.roles as UserRole[]);
    }
}
