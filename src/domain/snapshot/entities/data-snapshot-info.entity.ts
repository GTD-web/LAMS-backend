import {
    AfterLoad,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DataSnapshotChildInfoEntity } from './data-snapshot-child.entity';
import { DataSnapshotApprovalRequestInfoEntity } from './data-snapshot-approval-request-info.entity';
import { DateHelper } from '../../../common/utils/helpers/date.helper';

export enum SnapshotType {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    ANNUAL = 'ANNUAL_LEAVE',
}

@Entity()
export class DataSnapshotInfoEntity {
    @PrimaryGeneratedColumn('uuid')
    dataSnapshotId: string;

    @Column()
    snapshotName: string;

    @Column({ default: '' })
    description: string;

    @Column({ type: 'text' })
    snapshotType: SnapshotType;

    @Column()
    yyyy: string;

    @Column()
    mm: string;

    @OneToMany(() => DataSnapshotChildInfoEntity, (child) => child.parentSnapshot, {
        cascade: ['insert', 'update', 'remove'],
    })
    dataSnapshotChildInfoList: DataSnapshotChildInfoEntity[];
    /* TODO: 추후 제거 예정 - 2025-01-07*/
    // @ManyToOne(() => DepartmentInfoEntity, { eager: true, cascade: true })
    // @JoinColumn({ name: 'departmentId' })
    // department: DepartmentInfoEntity;

    @OneToOne(() => DataSnapshotApprovalRequestInfoEntity, (approvalRequest) => approvalRequest.dataSnapshot)
    approvalRequest: DataSnapshotApprovalRequestInfoEntity;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @AfterLoad()
    afterLoadFunction() {
        this.createdAt = DateHelper.toKoreanDateTime(this.createdAt);

        if (this.dataSnapshotChildInfoList) {
            this.dataSnapshotChildInfoList.sort((a, b) => a.employeeName.localeCompare(b.employeeName, 'ko'));
        }
    }
}
