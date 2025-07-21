import { ApprovalRequestBaseInfoEntity } from './approval-request-info.entity';
import { UserEntity } from '@src/domain/user/entities/user.entity';
export declare enum ApprovalStepStatus {
    PENDING = "\uB300\uAE30\uC911",
    APPROVED = "\uC2B9\uC778",
    REJECTED = "\uAC70\uC808",
    CANCELLED = "\uCDE8\uC18C"
}
export declare class ApprovalStepInfoEntity {
    stepId: string;
    approver: UserEntity;
    request: ApprovalRequestBaseInfoEntity;
    stepOrder: number;
    status: ApprovalStepStatus;
    reason: string;
    cancel(): void;
    approve(): void;
    reject(reason: string): void;
    pending(): void;
}
