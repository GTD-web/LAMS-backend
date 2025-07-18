import { ChildEntity, JoinColumn, OneToOne } from 'typeorm';
import { DataSnapshotInfoEntity } from './data-snapshot-info.entity';
import { ApprovalRequestBaseInfoEntity } from '@src/domain/approval/entities/approval-request-info.entity';

export enum SnapshotApprovalRequestStatus {
    CREATE_SNAPSHOT_REQUEST = '?? ?? ??? ?? ??',
    CREATE_SNAPSHOT_APPROVAL = '?? ?? ??? ?? ??',
    CREATE_SNAPSHOT_REJECTION = '?? ?? ??? ?? ??',
    CANCEL_SNAPSHOT_CANCELLATION = '?? ?? ??? ?? ??',
}
@ChildEntity()
export class DataSnapshotApprovalRequestInfoEntity extends ApprovalRequestBaseInfoEntity {
    @OneToOne(() => DataSnapshotInfoEntity, { cascade: true })
    @JoinColumn()
    dataSnapshot: DataSnapshotInfoEntity;

    cancel() {
        this.status = SnapshotApprovalRequestStatus.CANCEL_SNAPSHOT_CANCELLATION;
    }

    approve() {
        this.status = SnapshotApprovalRequestStatus.CREATE_SNAPSHOT_APPROVAL;
    }

    reject() {
        this.status = SnapshotApprovalRequestStatus.CREATE_SNAPSHOT_REJECTION;
    }
}
