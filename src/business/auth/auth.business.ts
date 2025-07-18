import { Injectable, UnauthorizedException, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from '../../interfaces/dto/auth/responses/auth-payload.dto';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { UserDomainService } from '@src/domain/user/services/user-domain.service';
import { AuthContextService } from '@src/contexts/auth/auth-user-context.service';
import { LoginResponseDto } from '@src/interfaces/dto/auth/responses/login-response.dto';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';

/**
 * 인증 비즈니스 서비스
 * - 사용자 인증 관련 비즈니스 로직을 처리
 * - JWT 토큰 생성 및 검증 담당
 * - 컨텍스트 서비스를 통해 실제 작업 수행
 */
@Injectable()
export class AuthBusinessService {
    private readonly logger = new Logger(AuthBusinessService.name);

    constructor(
        private readonly userDomainService: UserDomainService,
        private readonly authContextService: AuthContextService,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * 로그인 처리
     * docs: login(loginId: string, password: string)
     */
    async login(loginId: string, password: string): Promise<LoginResponseDto> {
        try {
            // 1. 사용자 아이디와 패스워드 검증
            const user = await this.사용자는_아이디와_패스워드를_검증한다(loginId, password);
            if (!user) {
                throw new UnauthorizedException('잘못된 사용자명 또는 비밀번호입니다.');
            }

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
     * docs: getProfile(token: string)
     */
    async getProfile(token: string, userId: string): Promise<UserResponseDto> {
        try {
            // 1. 토큰 검증
            await this.authContextService.사용자는_토큰을_검증받는다(token);

            // 2. 프로필 조회
            return this.authContextService.자신의_프로필을_조회한다(userId);
        } catch (error) {
            this.logger.error(`프로필 조회 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자는 아이디와 패스워드를 검증한다
     * @param loginId 로그인 아이디 (이메일)
     * @param password 패스워드
     * @returns 검증된 사용자 정보 또는 null
     */
    async 사용자는_아이디와_패스워드를_검증한다(loginId: string, password: string): Promise<LamsUserEntity | null> {
        try {
            if (!loginId || !password || loginId.trim().length === 0 || password.trim().length === 0) {
                throw new BadRequestException('유효하지 않은 로그인 정보입니다.');
            }

            const user = await this.userDomainService.findUserByEmail(loginId);
            if (!user) {
                this.logger.warn(`존재하지 않는 사용자 로그인 시도: ${loginId}`);
                return null;
            }

            const isPasswordValid = user.validatePassword(password);
            if (!isPasswordValid) {
                this.logger.warn(`잘못된 패스워드 로그인 시도: ${loginId}`);
                return null;
            }

            this.logger.log(`사용자 인증 성공: ${loginId}`);
            return user;
        } catch (error) {
            this.logger.error(`사용자 인증 검증 실패: ${loginId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자의 활성화 상태를 검증한다
     * @param userId 사용자 ID
     * @returns 활성화 상태 검증 결과
     */
    async 사용자의_활성화_상태를_검증한다(userId: string): Promise<boolean> {
        try {
            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
            }

            if (!user.isActive) {
                this.logger.warn(`비활성화된 사용자 로그인 시도: ${user.email}`);
                throw new UnauthorizedException('비활성화된 사용자입니다.');
            }

            this.logger.log(`사용자 활성화 상태 검증 성공: ${user.email}`);
            return true;
        } catch (error) {
            this.logger.error(`사용자 활성화 상태 검증 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자의 토큰을 제공한다
     * @param userId 사용자 ID
     * @returns JWT 토큰
     */
    async 사용자의_토큰을_제공한다(userId: string): Promise<string> {
        try {
            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
            }

            const payload: AuthPayloadDto = new AuthPayloadDto(user.userId, user.roles as UserRole[]);
            const token = this.jwtService.sign({
                sub: payload.sub,
                roles: payload.roles,
            });

            this.logger.log(`토큰 생성 성공: ${user.email}`);
            return token;
        } catch (error) {
            this.logger.error(`토큰 생성 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * JWT 토큰 검증
     * @param token JWT 토큰
     * @returns 검증 결과
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
     * @param userId 사용자 ID
     * @returns 사용자 프로필 정보
     */
    async 사용자의_프로필을_조회한다(userId: string): Promise<UserResponseDto> {
        return this.authContextService.자신의_프로필을_조회한다(userId);
    }

    /**
     * 비밀번호를 변경한다
     * @param userId 사용자 ID
     * @param currentPassword 현재 비밀번호
     * @param newPassword 새 비밀번호
     * @returns 업데이트된 사용자 정보
     */
    async 비밀번호를_변경한다(userId: string, currentPassword: string, newPassword: string): Promise<UserResponseDto> {
        try {
            const updatedUser = await this.userDomainService.changeUserPassword(userId, currentPassword, newPassword);

            this.logger.log(`비밀번호 변경 성공: ${updatedUser.email}`);
            return plainToInstance(UserResponseDto, updatedUser);
        } catch (error) {
            this.logger.error(`비밀번호 변경 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자 인증 검증 - 기존 호환성 유지
     * @param email 이메일
     * @param password 패스워드
     * @returns 인증 페이로드 또는 null
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
