import { AfterLoad, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApprovalRequestBaseInfoEntity } from './approval-request-info.entity';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';

export enum ApprovalHistoryAction {
    APPROVE = '?�인',
    REJECT = '반려',
    CANCEL = '취소',
    REQUEST = '?�청',
}

@Entity()
export class ApprovalHistoryInfoEntity {
    @PrimaryGeneratedColumn('uuid')
    historyId: string;

    @Column({ length: 20 })
    action: ApprovalHistoryAction;

    @ManyToOne(() => LamsUserEntity)
    actionBy: LamsUserEntity;

    @ManyToOne(() => ApprovalRequestBaseInfoEntity)
    request: ApprovalRequestBaseInfoEntity;

    @CreateDateColumn()
    actionAt: Date;

    @Column('text', { nullable: true })
    comments: string;

    @AfterLoad()
    afterLoad() {
        this.actionAt = new Date(new Date(this.actionAt).toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    }
}
