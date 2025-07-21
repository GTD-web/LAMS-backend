import { DataSnapshotInfoEntity } from './data-snapshot-info.entity';
type ParentDataType = {
    employeeId: string;
    employeeName: string;
    employeeNumber: string;
    yyyymm: string;
};
export declare class DataSnapshotChildInfoEntity {
    dataSnapshotChildId: string;
    employeeId: string;
    employeeName: string;
    employeeNumber: string;
    yyyy: string;
    mm: string;
    snapshotData: string;
    parentSnapshot: DataSnapshotInfoEntity;
    createdAt: string;
    parseToJSON(): void;
    static createChildSnapshotListFromParent(snapshotData: ParentDataType[]): DataSnapshotChildInfoEntity[];
}
export {};
