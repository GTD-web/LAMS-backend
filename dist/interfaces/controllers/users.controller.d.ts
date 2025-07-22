import { UserBusinessService } from '@src/business/user/user.business';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { SearchUserDto } from '@src/interfaces/dto/user/requests/search-user.dto';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { ManageDepartmentAuthorityDto } from '@src/interfaces/dto/organization/requests/manage-department-authority.dto';
import { UserEntity } from '@src/domain/user/entities/user.entity';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
export declare class UsersController {
    private readonly userBusinessService;
    constructor(userBusinessService: UserBusinessService);
    getUserList(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>>;
    searchUsers(searchDto: SearchUserDto, paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>>;
    getUserById(id: string): Promise<UserResponseDto>;
    manageDepartmentAuthority(departmentId: string, type: 'access' | 'review', action: 'add' | 'remove', dto: ManageDepartmentAuthorityDto): Promise<UserEntity>;
}
