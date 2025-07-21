import { UserRole } from '../../../../domain/user/enum/user.enum';
export declare class UserResponseDto {
    readonly userId: string;
    readonly username: string;
    readonly email: string;
    readonly roles: UserRole[];
    readonly isActive: boolean;
    readonly isIntegrated: boolean;
    readonly type: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly hasAccessAuthority: boolean;
    readonly hasReviewAuthority: boolean;
    constructor(partial: Partial<UserResponseDto>);
}
