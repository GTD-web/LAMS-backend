import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from '@src/interfaces/dto/auth/responses/login-response.dto';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { UserContextService } from '@src/contexts/user/user-context.service';
export declare class AuthBusinessService {
    private readonly userContextService;
    private readonly jwtService;
    private readonly logger;
    constructor(userContextService: UserContextService, jwtService: JwtService);
    login(loginId: string, password: string): Promise<LoginResponseDto>;
    getProfile(token: string, userId: string): Promise<UserResponseDto>;
    verifyToken(token: string): boolean;
    changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<UserResponseDto>;
}
