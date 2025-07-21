import { BaseNotificationEntity } from './base-notification.entity';
import { DataSnapshotApprovalRequestInfoEntity } from '@src/domain/snapshot/entities/data-snapshot-approval-request-info.entity';
export declare class SnapshotApprovalNotificationEntity extends BaseNotificationEntity {
    status: string;
    approvalRequest: DataSnapshotApprovalRequestInfoEntity;
    read(): void;
}
