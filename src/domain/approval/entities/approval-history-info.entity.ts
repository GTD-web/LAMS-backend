import { AfterLoad, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApprovalRequestBaseInfoEntity } from './approval-request-info.entity';
import { DateHelper } from '../../../common/utils/helpers/date.helper';
import { UserEntity } from '../../../domain/user/entities/user.entity';

export enum ApprovalHistoryAction {
    APPROVE = '승인',
    REJECT = '반려',
    CANCEL = '취소',
    REQUEST = '신청',
}

@Entity()
export class ApprovalHistoryInfoEntity {
    @PrimaryGeneratedColumn('uuid')
    historyId: string;

    @Column({ length: 20 })
    action: ApprovalHistoryAction;

    @ManyToOne(() => UserEntity)
    actionBy: UserEntity;

    @ManyToOne(() => ApprovalRequestBaseInfoEntity)
    request: ApprovalRequestBaseInfoEntity;

    @CreateDateColumn()
    actionAt: Date;

    @Column('text', { nullable: true })
    comments: string;

    @AfterLoad()
    afterLoad() {
        this.actionAt = DateHelper.parseTime(DateHelper.toKoreanTime(this.actionAt));
    }
}
