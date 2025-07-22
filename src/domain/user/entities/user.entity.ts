import * as bcrypt from 'bcrypt';
import {
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    TableInheritance,
    UpdateDateColumn,
} from 'typeorm';
import { SystemRole, UserRole } from '../enum/user.enum';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { ApprovalRequestBaseInfoEntity } from '@src/domain/approval/entities/approval-request-info.entity';
import { ApprovalStepInfoEntity } from '@src/domain/approval/entities/approval-step-info.entity';

export enum LamsUserRole {
    ATTENDANCE_ADMIN = 'ATTENDANCE_ADMIN',
    ATTENDANCE_USER = 'ATTENDANCE_USER',
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({
        nullable: true,
        unique: true,
    })
    email: string;

    @Column('simple-array')
    roles: string[];

    @Column({
        default: true,
    })
    isActive: boolean;

    // @Column({
    //     default: false,
    // })
    // isIntegrated: boolean;

    // @Column({ type: 'varchar', default: 'UserEntity', nullable: false })
    // type: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // @Column({ default: false })
    // hasAccessAuthority: boolean;

    // @Column({ default: false })
    // hasReviewAuthority: boolean;

    @ManyToMany(() => DepartmentInfoEntity, (department) => department.accessAuthorities)
    accessableDepartments: DepartmentInfoEntity[];

    @ManyToMany(() => DepartmentInfoEntity, (department) => department.reviewAuthorities)
    reviewableDepartments: DepartmentInfoEntity[];

    @OneToMany(() => ApprovalRequestBaseInfoEntity, (request) => request.requester)
    requests: ApprovalRequestBaseInfoEntity[];

    @OneToMany(() => ApprovalStepInfoEntity, (step) => step.approver)
    approvalSteps: ApprovalStepInfoEntity[];
}
