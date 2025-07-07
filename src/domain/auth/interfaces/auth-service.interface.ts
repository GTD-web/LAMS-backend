import { AuthPayloadEntity } from '../entities/auth-payload.entity';

/**
 * 인증 서비스 인터페이스
 * - 인증 관련 핵심 기능을 정의
 */
export interface IAuthDomainService {
    /**
     * 사용자 인증
     * @param username 사용자명
     * @param password 비밀번호
     * @returns 인증 성공 시 사용자 정보, 실패 시 null
     */
    validateUser(username: string, password: string): Promise<AuthPayloadEntity | null>;

    /**
     * JWT 토큰 생성
     * @param payload 토큰에 포함될 페이로드
     * @returns JWT 토큰
     */
    generateToken(payload: AuthPayloadEntity): string;

    /**
     * JWT 토큰 검증
     * @param token JWT 토큰
     * @returns 검증 성공 시 페이로드, 실패 시 null
     */
    verifyToken(token: string): AuthPayloadEntity | null;

    /**
     * 토큰에서 사용자 정보 추출
     * @param token JWT 토큰
     * @returns 사용자 정보 또는 null
     */
    extractUserFromToken(token: string): AuthPayloadEntity | null;

    /**
     * 토큰 만료 확인
     * @param token JWT 토큰
     * @returns 만료 여부
     */
    isTokenExpired(token: string): boolean;
}
