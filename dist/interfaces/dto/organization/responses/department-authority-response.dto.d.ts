export declare class DepartmentAuthorityResponse {
    readonly departmentId: string;
    readonly departmentName: string;
    readonly userId: string;
    readonly authorityType: 'access' | 'review';
    readonly action: 'add' | 'delete';
    readonly success: boolean;
    readonly message: string;
    constructor(partial: Partial<DepartmentAuthorityResponse>);
}
