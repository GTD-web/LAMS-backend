import { JwtService } from '@nestjs/jwt';
import { UserDomainService } from '@src/domain/user/services/user-domain.service';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { UserEntity } from '@src/domain/user/entities/user.entity';
export declare class UserContextService {
    private readonly userDomainService;
    private readonly jwtService;
    constructor(userDomainService: UserDomainService, jwtService: JwtService);
    아이디와_패스워드를_검증하고_활성화_상태를_검증한다(loginId: string, password: string): Promise<UserEntity>;
    사용자의_토큰을_제공한다(user: UserEntity): Promise<string>;
    자신의_프로필을_조회한다(userId: string): Promise<UserResponseDto>;
    페이지네이션된_사용자_목록을_조회한다(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>>;
    사용자_비밀번호를_변경한다(userId: string, currentPassword: string, newPassword: string): Promise<UserEntity>;
    findUserById(userId: string): Promise<UserEntity>;
}
