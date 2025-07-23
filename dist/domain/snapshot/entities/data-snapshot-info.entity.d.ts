import { DataSnapshotChildInfoEntity } from './data-snapshot-child.entity';
import { DataSnapshotApprovalRequestInfoEntity } from './data-snapshot-approval-request-info.entity';
import { DepartmentInfoEntity } from '@src/domain/department/entities/department-info.entity';
export declare enum SnapshotType {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    ANNUAL = "ANNUAL_LEAVE"
}
export declare class DataSnapshotInfoEntity {
    dataSnapshotId: string;
    snapshotName: string;
    description: string;
    snapshotType: SnapshotType;
    yyyy: string;
    mm: string;
    dataSnapshotChildInfoList: DataSnapshotChildInfoEntity[];
    department: DepartmentInfoEntity;
    approvalRequest: DataSnapshotApprovalRequestInfoEntity;
    createdAt: string;
    updatedAt: string;
    updateSnapshot(dto: any): void;
    afterLoadFunction(): void;
    static createSnapshot({ snapshotName, description, snapshotType, yyyy, mm, department, dataSnapshotChildInfoList, }: {
        snapshotName: string;
        description: string;
        snapshotType: SnapshotType;
        yyyy: string;
        mm: string;
        department: DepartmentInfoEntity;
        dataSnapshotChildInfoList: DataSnapshotChildInfoEntity[];
    }): DataSnapshotInfoEntity;
}
