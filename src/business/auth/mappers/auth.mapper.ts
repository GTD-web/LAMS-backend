import { AuthPayloadEntity } from '@src/domain/auth/entities/auth-payload.entity';

/**
 * 인증 매퍼 클래스
 * - 인증 관련 DTO와 Domain Service 파라미터 간의 변환을 담당
 * - 인터페이스 계층과 도메인 계층 간의 데이터 매핑
 */
export class AuthMapper {
    /**
     * 로그인 정보를 Domain Service 파라미터로 변환
     * @param username 사용자명
     * @param password 비밀번호
     * @returns 도메인 서비스 파라미터 객체
     */
    static fromLoginCredentials(username: string, password: string) {
        return {
            username,
            password,
        };
    }

    /**
     * AuthPayloadEntity를 응답 형태로 변환
     * @param payload 인증 페이로드
     * @returns 응답용 인증 정보
     */
    static toAuthResponse(payload: AuthPayloadEntity): Record<string, any> {
        return {
            userId: payload.sub,
            username: payload.username,
            email: payload.email,
            roles: payload.roles,
            isActive: payload.isActive,
        };
    }

    /**
     * 로그인 응답 형태로 변환
     * @param token JWT 토큰
     * @param payload 인증 페이로드
     * @returns 로그인 응답
     */
    static toLoginResponse(token: string, payload?: AuthPayloadEntity): Record<string, any> {
        const response: Record<string, any> = {
            accessToken: token,
            tokenType: 'Bearer',
        };

        if (payload) {
            response.user = this.toAuthResponse(payload);
        }

        return response;
    }
}
