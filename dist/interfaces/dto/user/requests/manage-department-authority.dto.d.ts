import { AuthorityType } from '@src/domain/user-department-authority/enum/authority-type.enum';
export declare class ManageDepartmentAuthorityDto {
    readonly userId: string;
    readonly action: 'add' | 'delete';
    readonly type: AuthorityType;
}
