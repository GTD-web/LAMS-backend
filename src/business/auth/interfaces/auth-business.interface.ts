import { LoginResponseDto } from '@src/business/user/dto/responses/login-response.dto';
import { AuthPayloadDto } from '../../../interfaces/dto/auth/responses/auth-payload.dto';

/**
 * 인증 비즈니스 서비스 인터페이스
 * - 인증 관련 비즈니스 로직의 계약을 정의
 * - 도메인 서비스와 인터페이스 계층 간의 중재 역할
 */
export interface IAuthBusinessService {
    /**
     * 사용자 로그인
     * @param username 사용자명
     * @param password 비밀번호
     * @returns 인증 토큰
     */
    login(username: string, password: string): Promise<LoginResponseDto>;

    /**
     * 토큰 검증
     * @param token JWT 토큰
     * @returns 검증된 사용자 정보 또는 null
     */
    validateToken(token: string): AuthPayloadDto | null;

    /**
     * 사용자 인증 검증
     * @param username 사용자명
     * @param password 비밀번호
     * @returns 인증된 사용자 정보 또는 null
     */
    validateUser(username: string, password: string): Promise<AuthPayloadDto | null>;

    /**
     * 토큰에서 사용자 정보 추출
     * @param token JWT 토큰
     * @returns 사용자 정보 또는 null
     */
    extractUserFromToken(token: string): AuthPayloadDto | null;

    /**
     * 토큰 만료 확인
     * @param token JWT 토큰
     * @returns 만료 여부
     */
    isTokenExpired(token: string): boolean;
}
