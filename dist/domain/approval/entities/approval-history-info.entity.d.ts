import { ApprovalRequestBaseInfoEntity } from './approval-request-info.entity';
import { UserEntity } from '@src/domain/user/entities/user.entity';
export declare enum ApprovalHistoryAction {
    APPROVE = "\uC2B9\uC778",
    REJECT = "\uBC18\uB824",
    CANCEL = "\uCDE8\uC18C",
    REQUEST = "\uC2E0\uCCAD"
}
export declare class ApprovalHistoryInfoEntity {
    historyId: string;
    action: ApprovalHistoryAction;
    actionBy: UserEntity;
    request: ApprovalRequestBaseInfoEntity;
    actionAt: Date;
    comments: string;
    afterLoad(): void;
}
