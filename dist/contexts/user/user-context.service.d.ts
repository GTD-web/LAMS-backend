import { JwtService } from '@nestjs/jwt';
import { UserDomainService } from '@src/domain/user/services/user-domain.service';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { AuthPayloadDto } from '@src/interfaces/dto/auth/responses/auth-payload.dto';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { UserEntity } from '@src/domain/user/entities/user.entity';
export declare class UserContextService {
    private readonly userDomainService;
    private readonly jwtService;
    private readonly logger;
    constructor(userDomainService: UserDomainService, jwtService: JwtService);
    사용자는_토큰을_검증받는다(token: string): Promise<UserEntity>;
    사용자의_현재_세션_정보를_조회한다(userId: string): Promise<{
        user: UserEntity;
        sessionValid: boolean;
        roles: UserRole[];
    }>;
    사용자의_권한을_확인한다(userId: string, requiredRoles: UserRole[]): Promise<boolean>;
    extractUserFromToken(token: string): AuthPayloadDto | null;
    isTokenExpired(token: string): boolean;
    validateUserPermission(requestUserId: string, targetUserId?: string, requiredRoles?: UserRole[]): Promise<boolean>;
    자신의_프로필을_조회한다(userId: string): Promise<UserResponseDto>;
    사용자의_프로필을_조회한다(userId: string): Promise<UserResponseDto>;
    페이지네이션된_사용자_목록을_조회한다(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>>;
    findUserById(userId: string): Promise<UserEntity | null>;
    findUserByEmail(email: string): Promise<UserEntity | null>;
    changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<UserEntity>;
    사용자의_부서_권한을_변경한다(userId: string, department: DepartmentInfoEntity, type: 'access' | 'review', action: 'add' | 'remove'): Promise<UserEntity>;
}
