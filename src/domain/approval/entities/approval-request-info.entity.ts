import {
    AfterLoad,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    TableInheritance,
    UpdateDateColumn,
} from 'typeorm';
import { ApprovalHistoryInfoEntity } from './approval-history-info.entity';
import { ApprovalStepInfoEntity } from './approval-step-info.entity';
import { UserEntity } from '@src/domain/user/entities/user.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class ApprovalRequestBaseInfoEntity {
    @PrimaryGeneratedColumn('uuid')
    requestId: string;

    @ManyToOne(() => UserEntity, (user) => user.requests)
    requester: UserEntity;

    @Column({ length: 50 })
    requestType: string;

    @Column('text')
    requestTitle: string;

    @Column('text')
    requestContent: string;

    @Column({ length: 20 })
    status: string;

    @OneToMany(() => ApprovalStepInfoEntity, (step) => step.request)
    steps: ApprovalStepInfoEntity[];

    @OneToMany(() => ApprovalHistoryInfoEntity, (history) => history.request)
    histories: ApprovalHistoryInfoEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @AfterLoad()
    setComputed() {
        if (this.steps) {
            this.steps = this.steps.sort((a, b) => a.stepOrder - b.stepOrder);
        }
    }
}
