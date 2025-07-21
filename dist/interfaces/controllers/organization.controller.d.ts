import { OrganizationBusinessService } from '@src/business/organization/organization.business';
import { SyncSuccessResponse } from '@src/common/types/success-response.type';
export declare class OrganizationController {
    private readonly organizationBusinessService;
    constructor(organizationBusinessService: OrganizationBusinessService);
    syncOrganization(): Promise<SyncSuccessResponse>;
}
