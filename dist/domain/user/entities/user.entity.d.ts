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
    createdAt: Date;
    updatedAt: Date;
    accessableDepartments: DepartmentInfoEntity[];
    reviewableDepartments: DepartmentInfoEntity[];
    requests: ApprovalRequestBaseInfoEntity[];
    approvalSteps: ApprovalStepInfoEntity[];
}
