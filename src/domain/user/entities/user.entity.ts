import * as bcrypt from 'bcrypt';
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    TableInheritance,
    UpdateDateColumn,
} from 'typeorm';
import { ApprovalRequestBaseInfoEntity } from '../../../domain/approval/entities/approval-request-info.entity';
// UserDepartmentAuthorityEntity import 제거 (관계 제거)
import { ApprovalStepInfoEntity } from '../../../domain/approval/entities/approval-step-info.entity';

export enum LamsUserRole {
    ATTENDANCE_ADMIN = 'ATTENDANCE_ADMIN',
    ATTENDANCE_USER = 'ATTENDANCE_USER',
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    userId: string;
    w;

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

    // @ManyToMany(() => DepartmentInfoEntity, (department) => department.accessAuthorities)
    // accessableDepartments: DepartmentInfoEntity[];

    // @ManyToMany(() => DepartmentInfoEntity, (department) => department.reviewAuthorities)
    // reviewableDepartments: DepartmentInfoEntity[];

    // UserDepartmentAuthorityEntity와의 관계 제거 (단순 ID 필드 사용)

    @OneToMany(() => ApprovalRequestBaseInfoEntity, (request) => request.requester)
    requests: ApprovalRequestBaseInfoEntity[];

    @OneToMany(() => ApprovalStepInfoEntity, (step) => step.approver)
    approvalSteps: ApprovalStepInfoEntity[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
