import { UserContextService } from '@src/contexts/user/user-context.service';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { SearchUserDto } from '@src/interfaces/dto/user/requests/search-user.dto';
import { UserEntity } from '@src/domain/user/entities/user.entity';
import { OrganizationContextService } from '@src/contexts/organization/organization-context.service';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
export declare class UserBusinessService {
    private readonly userContextService;
    private readonly organizationContextService;
    private readonly logger;
    constructor(userContextService: UserContextService, organizationContextService: OrganizationContextService);
    getUserList(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>>;
    searchUsers(searchDto: SearchUserDto, paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>>;
    getUserProfile(userId: string): Promise<UserResponseDto>;
    manageDepartmentAuthority(departmentId: string, userId: string, type: 'access' | 'review', action: 'add' | 'remove'): Promise<UserEntity>;
}
