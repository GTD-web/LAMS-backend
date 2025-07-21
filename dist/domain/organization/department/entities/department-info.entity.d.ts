import { DepartmentEmployeeEntity } from './department-employee.entity';
import { UserEntity } from '@src/domain/user/entities/user.entity';
export declare class DepartmentInfoEntity {
    departmentId: string;
    departmentName: string;
    departmentCode: string;
    mmsDepartmentId: string;
    accessAuthorities: UserEntity[];
    reviewAuthorities: UserEntity[];
    isExclude: boolean;
    parentDepartmentId: string;
    parent: DepartmentInfoEntity;
    children: DepartmentInfoEntity[];
    employees: DepartmentEmployeeEntity[];
    createdAt: Date;
    updatedAt: Date;
    toggleExclude(): void;
    isAccessAuthority(user: UserEntity): boolean;
    isReviewAuthority(user: UserEntity): boolean;
}
