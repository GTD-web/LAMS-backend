import { UserRole } from '../../../../domain/user/enum/user.enum';
export declare class UpdateUserDto {
    readonly username?: string;
    readonly email?: string;
    readonly roles?: UserRole[];
    readonly isActive?: boolean;
    readonly isIntegrated?: boolean;
}
