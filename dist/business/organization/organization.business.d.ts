import { OrganizationContextService } from '@src/contexts/organization/organization-context.service';
import { DepartmentResponseDto } from '@src/interfaces/dto/organization/responses/department-response.dto';
import { EmployeeResponseDto } from '@src/interfaces/dto/organization/responses/employee-response.dto';
import { SyncOrganizationResponseDto } from '@src/interfaces/dto/organization/responses/sync-organization-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { UserContextService } from '@src/contexts/user/user-context.service';
export declare class OrganizationBusinessService {
    private readonly organizationContextService;
    private readonly userContextService;
    constructor(organizationContextService: OrganizationContextService, userContextService: UserContextService);
    syncOrganization(): Promise<SyncOrganizationResponseDto>;
    getDepartmentList(paginationQuery: PaginationQueryDto): Promise<import("../../common/dtos/pagination/pagination-response.dto").PaginatedResponseDto<DepartmentResponseDto>>;
    getDepartmentListByUser(userId: string): Promise<import("../../domain/organization/department/entities/department-info.entity").DepartmentInfoEntity[]>;
    toggleDepartmentExclusion(departmentId: string): Promise<DepartmentResponseDto>;
    getEmployeeListByDepartment(departmentId: string, paginationQuery: PaginationQueryDto): Promise<{
        data: any[];
        meta: any;
    }>;
    toggleEmployeeExclusion(employeeId: string): Promise<EmployeeResponseDto>;
    getActiveEmployeesByDepartment(departmentId: string): Promise<EmployeeResponseDto[]>;
}
