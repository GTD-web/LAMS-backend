import { UserRole } from '@src/domain/user/enum/user.enum';
export declare class AuthPayloadDto {
    constructor(sub: string, roles: UserRole[], exp?: number);
    readonly sub: string;
    readonly roles: UserRole[];
    exp?: number;
    isExpired(): boolean;
}
