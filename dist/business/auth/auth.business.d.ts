import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from '../../interfaces/dto/auth/responses/auth-payload.dto';
import { LoginResponseDto } from '@src/interfaces/dto/auth/responses/login-response.dto';
import { UserEntity } from '@src/domain/user/entities/user.entity';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { UserContextService } from '@src/contexts/user/user-context.service';
export declare class AuthBusinessService {
    private readonly userContextService;
    private readonly jwtService;
    private readonly logger;
    constructor(userContextService: UserContextService, jwtService: JwtService);
    login(loginId: string, password: string): Promise<LoginResponseDto>;
    getProfile(token: string, userId: string): Promise<UserResponseDto>;
    사용자는_아이디와_패스워드를_검증한다(loginId: string, password: string): Promise<UserEntity | null>;
    사용자의_활성화_상태를_검증한다(userId: string): Promise<boolean>;
    사용자의_토큰을_제공한다(userId: string): Promise<string>;
    verifyToken(token: string): boolean;
    사용자의_프로필을_조회한다(userId: string): Promise<UserResponseDto>;
    비밀번호를_변경한다(userId: string, currentPassword: string, newPassword: string): Promise<UserResponseDto>;
    validateUser(email: string, password: string): Promise<AuthPayloadDto | null>;
}
