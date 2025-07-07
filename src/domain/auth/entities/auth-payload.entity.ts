import { UserRole } from '@src/domain/user/entities/user.entity';

/**
 * 인증 페이로드 엔티티
 * - JWT 토큰에 포함될 사용자 정보를 정의
 */
export class AuthPayloadEntity {
    constructor(
        public readonly sub: string, // 사용자 ID
        public readonly username: string,
        public readonly email: string,
        public readonly roles: UserRole[],
        public readonly isActive: boolean,
        public readonly iat?: number, // 발급 시간
        public readonly exp?: number, // 만료 시간
    ) {}

    /**
     * 사용자가 특정 역할을 가지고 있는지 확인
     * @param role 확인할 역할
     * @returns 역할 보유 여부
     */
    hasRole(role: UserRole): boolean {
        return this.roles.includes(role);
    }

    /**
     * 사용자가 여러 역할 중 하나라도 가지고 있는지 확인
     * @param roles 확인할 역할들
     * @returns 역할 보유 여부
     */
    hasAnyRole(roles: UserRole[]): boolean {
        return roles.some((role) => this.roles.includes(role));
    }

    /**
     * 사용자가 모든 역할을 가지고 있는지 확인
     * @param roles 확인할 역할들
     * @returns 모든 역할 보유 여부
     */
    hasAllRoles(roles: UserRole[]): boolean {
        return roles.every((role) => this.roles.includes(role));
    }

    /**
     * 사용자가 활성 상태인지 확인
     * @returns 활성 상태 여부
     */
    isActiveUser(): boolean {
        return this.isActive;
    }

    /**
     * 토큰이 만료되었는지 확인
     * @returns 만료 여부
     */
    isExpired(): boolean {
        if (!this.exp) return false;
        return Date.now() >= this.exp * 1000;
    }

    /**
     * 플레인 객체로 변환
     * @returns 플레인 객체
     */
    toPlainObject(): Record<string, any> {
        return {
            sub: this.sub,
            username: this.username,
            email: this.email,
            roles: this.roles,
            isActive: this.isActive,
            iat: this.iat,
            exp: this.exp,
        };
    }
}
