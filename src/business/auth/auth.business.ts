import { Injectable, UnauthorizedException, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from '../../interfaces/controllers/auth/dto/auth-payload.dto';
import { UserRole } from '../../domain/user/enum/user.enum';
import { LoginResponseDto } from '../../interfaces/controllers/auth/dto/login-response.dto';
import { UserEntity } from '../../domain/user/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { UserContextService } from '../../contexts/user/user-context.service';

/**
 * 인증 비즈니스 서비스
 * - 사용자 인증 관련 비즈니스 로직을 처리
 * - JWT 토큰 생성 및 검증 담당
 * - 컨텍스트 서비스를 통해 실제 작업 수행
 */
@Injectable()
export class AuthBusinessService {
    private readonly logger = new Logger(AuthBusinessService.name);

    constructor(private readonly userContextService: UserContextService, private readonly jwtService: JwtService) {}

    /**
     * 로그인 처리 (복잡한 비즈니스 로직이므로 try-catch 유지)
     */
    async login(loginId: string, password: string): Promise<LoginResponseDto> {
        // 1. 아이디와 패스워드 검증, 사용자 활성화 상태 검증
        const user = await this.userContextService.아이디와_패스워드를_검증하고_활성화_상태를_검증한다(
            loginId,
            password,
        );

        // 2. 사용자 토큰 제공
        const token = await this.userContextService.사용자의_토큰을_제공한다(user);

        return {
            token,
            user: plainToInstance(UserResponseDto, user),
        };
    }

    /**
     * JWT 토큰 검증
     */
    verifyToken(token: string): boolean {
        try {
            if (!token || token.trim().length === 0) {
                return false;
            }

            // Bearer 토큰에서 실제 토큰 추출
            const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
            const decoded = this.jwtService.verify(cleanToken);

            return !!decoded;
        } catch (error) {
            this.logger.warn(`토큰 검증 실패: ${token}`, error.message);
            return false;
        }
    }

    /**
     * 비밀번호를 변경한다
     */
    async changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<UserResponseDto> {
        const updatedUser = await this.userContextService.사용자_비밀번호를_변경한다(
            userId,
            currentPassword,
            newPassword,
        );

        return plainToInstance(UserResponseDto, updatedUser);
    }
}
