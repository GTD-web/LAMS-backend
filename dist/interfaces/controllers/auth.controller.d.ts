import { AuthBusinessService } from '@src/business/auth/auth.business';
import { LoginResponseDto } from '@src/interfaces/dto/auth/responses/login-response.dto';
import { LoginDto } from '@src/interfaces/dto/auth/request/login.dto';
import { ChangePasswordDto } from '../dto/auth/request/change-password.dto';
import { UserResponseDto } from '../dto/organization/responses/user-response.dto';
import { UserEntity } from '@src/domain/user/entities/user.entity';
export declare class AuthController {
    private readonly authBusinessService;
    constructor(authBusinessService: AuthBusinessService);
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    getProfile(user: UserEntity, token: string): Promise<UserResponseDto>;
    verifyToken(token: string): Promise<{
        valid: boolean;
    }>;
    changePassword(user: UserEntity, changePasswordDto: ChangePasswordDto): Promise<UserResponseDto>;
}
