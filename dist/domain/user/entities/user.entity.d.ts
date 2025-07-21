import { SystemRole } from '../enum/user.enum';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { ApprovalRequestBaseInfoEntity } from '@src/domain/approval/entities/approval-request-info.entity';
import { ApprovalStepInfoEntity } from '@src/domain/approval/entities/approval-step-info.entity';
export declare enum LamsUserRole {
    ATTENDANCE_ADMIN = "ATTENDANCE_ADMIN",
    ATTENDANCE_USER = "ATTENDANCE_USER"
}
export declare class UserEntity {
    userId: string;
    username: string;
    password: string;
    email: string;
    roles: string[];
    isActive: boolean;
    isIntegrated: boolean;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    hasAccessAuthority: boolean;
    hasReviewAuthority: boolean;
    accessableDepartments: DepartmentInfoEntity[];
    reviewableDepartments: DepartmentInfoEntity[];
    requests: ApprovalRequestBaseInfoEntity[];
    approvalSteps: ApprovalStepInfoEntity[];
    setLamsRoles(role: LamsUserRole): void;
    includeAccessableDepartment(department: DepartmentInfoEntity): void;
    includeReviewableDepartment(department: DepartmentInfoEntity): void;
    excludeAccessableDepartment(department: DepartmentInfoEntity): void;
    excludeReviewableDepartment(department: DepartmentInfoEntity): void;
    isAccessableDepartment(department: DepartmentInfoEntity): boolean;
    isReviewableDepartment(department: DepartmentInfoEntity): boolean;
    hashPassword(): void;
    validatePassword(password: string): any;
    updateHashedPassword(password: string): any;
    setSystemRole(role: SystemRole): void;
    toggleIsActive(): void;
    setDefaultRoles(): void;
    checkRoles(): void;
    sortRoles(): void;
}
