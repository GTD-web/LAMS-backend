import { DepartmentInfoEntity } from '@src/domain/department/entities/department-info.entity';
import { UserEntity } from '@src/domain/user/entities/user.entity';
import { AuthorityType } from '../enum/authority-type.enum';
export declare class UserDepartmentAuthorityEntity {
    authorityId: string;
    departmentId: string;
    userId: string;
    authorityType: AuthorityType;
    createdAt: Date;
    updatedAt: Date;
    department: DepartmentInfoEntity;
    user: UserEntity;
}
