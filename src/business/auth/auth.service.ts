import { Injectable } from '@nestjs/common';
import { AuthDomainService } from '@src/domain/auth/auth.service';
import { AuthPayloadEntity } from '@src/domain/auth/entities/auth-payload.entity';
import { IAuthBusinessService } from './interfaces/auth-business.interface';
import { AuthMapper } from './mappers/auth.mapper';

/**
 * 인증 비즈니스 서비스
 * - 인증 관련 비즈니스 로직을 처리
 * - 도메인 서비스와 인터페이스 계층 간의 중재 역할
 */
@Injectable()
export class AuthBusinessService implements IAuthBusinessService {
    constructor(private readonly authDomainService: AuthDomainService) {}

    /**
     * 사용자 로그인
     * @param username 사용자명
     * @param password 비밀번호
     * @returns 인증 토큰
     */
    async login(username: string, password: string): Promise<string> {
        return await this.authDomainService.login(username, password);
    }

    /**
     * 토큰 검증
     * @param token JWT 토큰
     * @returns 검증된 사용자 정보 또는 null
     */
    validateToken(token: string): AuthPayloadEntity | null {
        return this.authDomainService.verifyToken(token);
    }

    /**
     * 사용자 인증 검증
     * @param username 사용자명
     * @param password 비밀번호
     * @returns 인증된 사용자 정보 또는 null
     */
    async validateUser(username: string, password: string): Promise<AuthPayloadEntity | null> {
        return await this.authDomainService.validateUser(username, password);
    }

    /**
     * 토큰에서 사용자 정보 추출
     * @param token JWT 토큰
     * @returns 사용자 정보 또는 null
     */
    extractUserFromToken(token: string): AuthPayloadEntity | null {
        return this.authDomainService.extractUserFromToken(token);
    }

    /**
     * 토큰 만료 확인
     * @param token JWT 토큰
     * @returns 만료 여부
     */
    isTokenExpired(token: string): boolean {
        return this.authDomainService.isTokenExpired(token);
    }
}
