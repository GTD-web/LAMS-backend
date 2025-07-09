import { UserRole } from '@src/domain/user/enum/user.enum';

export class AuthPayloadDto {
    constructor(sub: string, roles: UserRole[], exp?: number) {
        this.sub = sub;
        this.roles = roles;
        this.exp = exp;
    }

    readonly sub: string;
    readonly roles: UserRole[];
    exp?: number;

    isExpired(): boolean {
        return this.exp < Date.now() / 1000;
    }
}
