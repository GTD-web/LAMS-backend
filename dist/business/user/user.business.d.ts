import { UserContextService } from '@src/contexts/user/user-context.service';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { AuthorityType } from '@src/domain/user-department-authority/enum/authority-type.enum';
import { UserDepartmentAuthorityContext } from '@src/contexts/user-department-authority/user-department-authority-context';
export declare class UserBusinessService {
    private readonly userContextService;
    private readonly userDepartmentAuthorityContext;
    constructor(userContextService: UserContextService, userDepartmentAuthorityContext: UserDepartmentAuthorityContext);
    getUserList(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>>;
    getUserProfile(userId: string): Promise<UserResponseDto>;
    grantAuthority(userId: string, departmentId: string, authorityType: AuthorityType): Promise<boolean>;
    removeAuthority(userId: string, departmentId: string, authorityType: AuthorityType): Promise<boolean>;
}
