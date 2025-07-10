import { Injectable, Inject, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserDomainService } from '@src/domain/user/user.service';
import { LoginResponseDto } from '../user/dto/responses/login-response.dto';
import { AuthPayloadDto } from './dto/responses/auth-payload.dto';
import { UserRole } from '@src/domain/user/enum/user.enum';

/**
 * 인증 도메인 서비스
 * - 인증 관련 핵심 비즈니스 로직을 처리
 * - JWT 토큰 생성 및 검증 담당
 */
@Injectable()
export class AuthBusinessService {
    private readonly logger = new Logger(AuthBusinessService.name);

    constructor(private readonly userService: UserDomainService, private readonly jwtService: JwtService) {}

    /**
     * 사용자 인증
     * @param email 사용자명
     * @param password 비밀번호
     * @returns 인증 성공 시 사용자 정보, 실패 시 null
     */
    async validateUser(email: string, password: string): Promise<AuthPayloadDto | null> {
        if (!email || !password || email.trim().length === 0 || password.trim().length === 0) {
            throw new BadRequestException('유효하지 않은 로그인 정보입니다.');
        }

        const user = await this.userService.findUserByEmail(email);

        if (!user) {
            return null;
        }

        if (!user.isActive) {
            throw new UnauthorizedException('비활성화된 사용자입니다.');
        }

        const isPasswordValid = user.validatePassword(password);
        if (!isPasswordValid) {
            return null;
        }

        return new AuthPayloadDto(user.userId, user.roles as UserRole[]);
    }

    /**
     * JWT 토큰 생성
     * @param payload 토큰에 포함될 페이로드
     * @returns JWT 토큰
     */
    generateToken(payload: AuthPayloadDto): string {
        const tokenPayload = {
            sub: payload.sub,
            roles: payload.roles,
        };

        return this.jwtService.sign(tokenPayload);
    }

    /**
     * JWT 토큰 검증
     * @param token JWT 토큰
     * @returns 검증 성공 시 페이로드, 실패 시 null
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
     * 토큰에서 사용자 정보 추출
     * @param token JWT 토큰
     * @returns 사용자 정보 또는 null
     */
    extractUserFromToken(token: string): AuthPayloadDto | null {
        return this.verifyToken(token);
    }

    /**
     * 토큰 만료 확인
     * @param token JWT 토큰
     * @returns 만료 여부
     */
    isTokenExpired(token: string): boolean {
        const payload = this.verifyToken(token);
        if (!payload) {
            return true;
        }

        return payload.isExpired();
    }

    /**
     * 로그인 처리
     * @param email 이메일
     * @param password 비밀번호
     * @returns 인증 토큰
     */
    async login(email: string, password: string): Promise<LoginResponseDto> {
        if (!email || !password || email.trim().length === 0 || password.trim().length === 0) {
            throw new BadRequestException('유효하지 않은 로그인 정보입니다.');
        }

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
}
