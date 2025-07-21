import { ApprovalHistoryInfoEntity } from './approval-history-info.entity';
import { ApprovalStepInfoEntity } from './approval-step-info.entity';
import { UserEntity } from '@src/domain/user/entities/user.entity';
export declare class ApprovalRequestBaseInfoEntity {
    requestId: string;
    requester: UserEntity;
    requestType: string;
    requestTitle: string;
    requestContent: string;
    status: string;
    steps: ApprovalStepInfoEntity[];
    histories: ApprovalHistoryInfoEntity[];
    createdAt: Date;
    updatedAt: Date;
    setComputed(): void;
}
