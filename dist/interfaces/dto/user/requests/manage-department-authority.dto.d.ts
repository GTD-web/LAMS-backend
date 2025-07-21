export declare class ManageDepartmentAuthorityDto {
    readonly userId: string;
    readonly action: 'add' | 'delete';
    readonly type: 'access' | 'review';
}
