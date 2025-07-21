import { OrganizationContextService } from '@src/contexts/organization/organization-context.service';
import { DepartmentResponseDto } from '@src/interfaces/dto/organization/responses/department-response.dto';
import { EmployeeResponseDto } from '@src/interfaces/dto/organization/responses/employee-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { SyncSuccessResponse, SuccessResponseWithData, PaginatedSuccessResponse } from '@src/common/types/success-response.type';
export declare class OrganizationBusinessService {
    private readonly organizationContextService;
    private readonly logger;
    constructor(organizationContextService: OrganizationContextService);
    syncOrganization(): Promise<SyncSuccessResponse>;
    getDepartmentList(paginationQuery: PaginationQueryDto): Promise<PaginatedSuccessResponse<DepartmentResponseDto>>;
    toggleDepartmentExclusion(departmentId: string): Promise<SuccessResponseWithData<DepartmentResponseDto>>;
    getEmployeeListByDepartment(departmentId: string, paginationQuery: PaginationQueryDto): Promise<PaginatedSuccessResponse<EmployeeResponseDto>>;
    toggleEmployeeExclusion(employeeId: string): Promise<SuccessResponseWithData<EmployeeResponseDto>>;
    getActiveEmployeesByDepartment(departmentId: string): Promise<SuccessResponseWithData<EmployeeResponseDto[]>>;
}
