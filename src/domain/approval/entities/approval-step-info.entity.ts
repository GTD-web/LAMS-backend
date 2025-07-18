import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApprovalRequestBaseInfoEntity } from './approval-request-info.entity';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';

export enum ApprovalStepStatus {
    PENDING = '?�기중',
    APPROVED = '?�인',
    REJECTED = '거절',
    CANCELLED = '취소',
}

@Entity()
export class ApprovalStepInfoEntity {
    @PrimaryGeneratedColumn('uuid')
    stepId: string;

    @ManyToOne(() => LamsUserEntity, (user) => user.approvalSteps)
    approver: LamsUserEntity;

    @ManyToOne(() => ApprovalRequestBaseInfoEntity, (request) => request.steps)
    request: ApprovalRequestBaseInfoEntity;

    @Column()
    stepOrder: number;

    @Column({ length: 20 })
    status: ApprovalStepStatus;

    @Column({ length: 200, nullable: true })
    reason: string;

    cancel() {
        this.status = ApprovalStepStatus.CANCELLED;
    }

    approve() {
        this.status = ApprovalStepStatus.APPROVED;
    }

    reject(reason: string) {
        this.status = ApprovalStepStatus.REJECTED;
        this.reason = reason;
    }

    pending() {
        this.status = ApprovalStepStatus.PENDING;
    }
}
