import { DataSnapshotInfoEntity } from './data-snapshot-info.entity';
import { ApprovalRequestBaseInfoEntity } from '@src/domain/approval/entities/approval-request-info.entity';
export declare enum SnapshotApprovalRequestStatus {
    CREATE_SNAPSHOT_REQUEST = "?? ?? ??? ?? ??",
    CREATE_SNAPSHOT_APPROVAL = "?? ?? ??? ?? ??",
    CREATE_SNAPSHOT_REJECTION = "?? ?? ??? ?? ??",
    CANCEL_SNAPSHOT_CANCELLATION = "?? ?? ??? ?? ??"
}
export declare class DataSnapshotApprovalRequestInfoEntity extends ApprovalRequestBaseInfoEntity {
    dataSnapshot: DataSnapshotInfoEntity;
    cancel(): void;
    approve(): void;
    reject(): void;
}
