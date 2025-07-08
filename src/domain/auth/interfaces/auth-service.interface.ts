import { AuthPayloadEntity } from '../entities/auth-payload.entity';

/**
 * 인증 서비스 인터페이스
 * - 인증 관련 핵심 기능을 정의
 */
export interface IAuthDomainService {
    validateUser(username: string, password: string): Promise<AuthPayloadEntity | null>;
    generateToken(payload: AuthPayloadEntity): string;
    verifyToken(token: string): AuthPayloadEntity | null;
    extractUserFromToken(token: string): AuthPayloadEntity | null;
    isTokenExpired(token: string): boolean;
}
