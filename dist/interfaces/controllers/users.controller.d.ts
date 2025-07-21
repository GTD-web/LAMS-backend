import { UserBusinessService } from '@src/business/user/user.business';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { SearchUserDto } from '@src/interfaces/dto/user/requests/search-user.dto';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { ManageDepartmentAuthorityDto } from '@src/interfaces/dto/organization/requests/manage-department-authority.dto';
import { PaginatedSuccessResponse, SuccessResponseWithData } from '@src/common/types/success-response.type';
import { UserEntity } from '@src/domain/user/entities/user.entity';
export declare class UsersController {
    private readonly userBusinessService;
    constructor(userBusinessService: UserBusinessService);
    getUserList(paginationQuery: PaginationQueryDto): Promise<PaginatedSuccessResponse<UserResponseDto>>;
    searchUsers(searchDto: SearchUserDto, paginationQuery: PaginationQueryDto): Promise<PaginatedSuccessResponse<UserResponseDto>>;
    getUserById(id: string): Promise<SuccessResponseWithData<UserResponseDto>>;
    manageDepartmentAuthority(departmentId: string, type: 'access' | 'review', action: 'add' | 'remove', dto: ManageDepartmentAuthorityDto): Promise<SuccessResponseWithData<UserEntity>>;
}
