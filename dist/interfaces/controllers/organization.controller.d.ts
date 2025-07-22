import { OrganizationBusinessService } from '@src/business/organization/organization.business';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { SyncOrganizationResponseDto } from '@src/interfaces/dto/organization/responses/sync-organization-response.dto';
import { DepartmentResponseDto } from '@src/interfaces/dto/organization/responses/department-response.dto';
import { EmployeeResponseDto } from '@src/interfaces/dto/organization/responses/employee-response.dto';
export declare class OrganizationController {
    private readonly organizationBusinessService;
    constructor(organizationBusinessService: OrganizationBusinessService);
    syncOrganization(): Promise<SyncOrganizationResponseDto>;
    getDepartmentList(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<DepartmentResponseDto>>;
    toggleDepartmentExclusion(departmentId: string): Promise<DepartmentResponseDto>;
    getEmployeeListByDepartment(departmentId: string, paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<EmployeeResponseDto>>;
    toggleEmployeeExclusion(employeeId: string): Promise<EmployeeResponseDto>;
    getActiveEmployeesByDepartment(departmentId: string): Promise<EmployeeResponseDto[]>;
}
