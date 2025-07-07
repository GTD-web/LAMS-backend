import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthDomainService } from './interfaces/auth-service.interface';
import { AuthPayloadEntity } from './entities/auth-payload.entity';
import { IUserDomainRepository } from '../user/interfaces/user-repository.interface';
import { UserRole } from '../user/entities/user.entity';

/**
 * 인증 도메인 서비스
 * - 인증 관련 핵심 비즈니스 로직을 처리
 * - JWT 토큰 생성 및 검증 담당
 */
@Injectable()
export class AuthDomainService implements IAuthDomainService {
    constructor(
        @Inject('IUserDomainRepository')
        private readonly userRepository: IUserDomainRepository,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * 사용자 인증
     * @param username 사용자명
     * @param password 비밀번호
     * @returns 인증 성공 시 사용자 정보, 실패 시 null
     */
    async validateUser(username: string, password: string): Promise<AuthPayloadEntity | null> {
        if (!username || !password || username.trim().length === 0 || password.trim().length === 0) {
            throw new BadRequestException('유효하지 않은 로그인 정보입니다.');
        }

        const user = await this.userRepository.findByUsername(username);

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

        return new AuthPayloadEntity(user.userId, user.username, user.email, user.roles as UserRole[], user.isActive);
    }

    /**
     * JWT 토큰 생성
     * @param payload 토큰에 포함될 페이로드
     * @returns JWT 토큰
     */
    generateToken(payload: AuthPayloadEntity): string {
        const tokenPayload = {
            sub: payload.sub,
            username: payload.username,
            email: payload.email,
            roles: payload.roles,
            isActive: payload.isActive,
        };

        return this.jwtService.sign(tokenPayload);
    }

    /**
     * JWT 토큰 검증
     * @param token JWT 토큰
     * @returns 검증 성공 시 페이로드, 실패 시 null
     */
    verifyToken(token: string): AuthPayloadEntity | null {
        try {
            if (!token || token.trim().length === 0) {
                return null;
            }

            // Bearer 토큰에서 실제 토큰 추출
            const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
            const decoded = this.jwtService.verify(cleanToken);

            return new AuthPayloadEntity(
                decoded.sub,
                decoded.username,
                decoded.email,
                decoded.roles as UserRole[],
                decoded.isActive,
                decoded.iat,
                decoded.exp,
            );
        } catch (error) {
            return null;
        }
    }

    /**
     * 토큰에서 사용자 정보 추출
     * @param token JWT 토큰
     * @returns 사용자 정보 또는 null
     */
    extractUserFromToken(token: string): AuthPayloadEntity | null {
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
     * @param username 사용자명
     * @param password 비밀번호
     * @returns 인증 토큰
     */
    async login(username: string, password: string): Promise<string> {
        if (!username || !password || username.trim().length === 0 || password.trim().length === 0) {
            throw new BadRequestException('유효하지 않은 로그인 정보입니다.');
        }

        const user = await this.validateUser(username, password);

        if (!user) {
            throw new UnauthorizedException('잘못된 사용자명 또는 비밀번호입니다.');
        }

        return this.generateToken(user);
    }
}
