import { ChildEntity, JoinColumn, OneToOne } from 'typeorm';
import { DataSnapshotInfoEntity } from './data-snapshot-info.entity';
import { ApprovalRequestBaseInfoEntity } from '@src/domain/approval/entities/approval-request-info.entity';

export enum SnapshotApprovalRequestStatus {
    CREATE_SNAPSHOT_REQUEST = '??근태 ?�황 ?�냅??결재 ?�청',
    CREATE_SNAPSHOT_APPROVAL = '??근태 ?�황 ?�냅??결재 ?�인',
    CREATE_SNAPSHOT_REJECTION = '??근태 ?�황 ?�냅??결재 거절',
    CANCEL_SNAPSHOT_CANCELLATION = '??근태 ?�황 ?�냅??결재 취소',
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
