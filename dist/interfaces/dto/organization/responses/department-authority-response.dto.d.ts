import { AuthorityType } from '@src/domain/user-department-authority/enum/authority-type.enum';
export declare class DepartmentAuthorityResponse {
    readonly departmentId: string;
    readonly departmentName: string;
    readonly userId: string;
    readonly authorityType: AuthorityType;
    readonly action: 'add' | 'delete';
    readonly success: boolean;
    readonly message: string;
    constructor(partial: Partial<DepartmentAuthorityResponse>);
}
