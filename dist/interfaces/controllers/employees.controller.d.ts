import { EmployeeResponseDto } from '../dto/organization/responses/employee-response.dto';
import { OrganizationBusinessService } from '@src/business/organization/organization.business';
import { SuccessResponseWithData } from '@src/common/types/success-response.type';
export declare class EmployeesController {
    private readonly organizationBusinessService;
    constructor(organizationBusinessService: OrganizationBusinessService);
    toggleEmployeeExclusion(employeeId: string): Promise<SuccessResponseWithData<EmployeeResponseDto>>;
}
