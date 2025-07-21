import { OrganizationBusinessService } from '@src/business/organization/organization.business';
import { DepartmentResponseDto } from '@src/interfaces/dto/organization/responses/department-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { SuccessResponseWithData } from '@src/common/types/success-response.type';
export declare class DepartmentsController {
    private readonly organizationBusinessService;
    constructor(organizationBusinessService: OrganizationBusinessService);
    getDepartments(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<DepartmentResponseDto>>;
    toggleDepartmentExclusion(departmentId: string): Promise<SuccessResponseWithData<DepartmentResponseDto>>;
}
