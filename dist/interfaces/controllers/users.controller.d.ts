import { UserBusinessService } from '@src/business/user/user.business';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
export declare class UsersController {
    private readonly userBusinessService;
    constructor(userBusinessService: UserBusinessService);
    getUserList(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>>;
    getUserById(id: string): Promise<UserResponseDto>;
    grantAccessAuthority(userId: string, departmentId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    grantReviewAuthority(userId: string, departmentId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    removeAccessAuthority(userId: string, departmentId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    removeReviewAuthority(userId: string, departmentId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
