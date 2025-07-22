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

    // setLamsRoles(role: LamsUserRole) {
    //     // 기존 역할 제거
    //     this.roles = this.roles.filter(
    //         (r) => r !== LamsUserRole.ATTENDANCE_ADMIN && r !== LamsUserRole.ATTENDANCE_USER,
    //     );

    //     // 새로운 역할 추가
    //     this.roles.push(role);
    // }

    // includeAccessableDepartment(department: DepartmentInfoEntity) {
    //     if (!this.accessableDepartments) {
    //         this.accessableDepartments = [];
    //     }

    //     if (!this.isAccessableDepartment(department)) {
    //         this.accessableDepartments.push(department);
    //     }
    // }

    // includeReviewableDepartment(department: DepartmentInfoEntity) {
    //     if (!this.reviewableDepartments) {
    //         this.reviewableDepartments = [];
    //     }

    //     if (!this.isReviewableDepartment(department)) {
    //         this.reviewableDepartments.push(department);
    //     }
    // }

    // excludeAccessableDepartment(department: DepartmentInfoEntity) {
    //     this.accessableDepartments = this.accessableDepartments.filter(
    //         (dept) => dept.departmentId !== department.departmentId,
    //     );
    // }

    // excludeReviewableDepartment(department: DepartmentInfoEntity) {
    //     this.reviewableDepartments = this.reviewableDepartments.filter(
    //         (dept) => dept.departmentId !== department.departmentId,
    //     );
    // }

    // isAccessableDepartment(department: DepartmentInfoEntity) {
    //     return this.accessableDepartments.some((dept) => dept.departmentId === department.departmentId);
    // }

    // isReviewableDepartment(department: DepartmentInfoEntity) {
    //     return this.reviewableDepartments.some((dept) => dept.departmentId === department.departmentId);
    // }

    // @BeforeInsert()
    // hashPassword() {
    //     this.password = bcrypt.hashSync(this.password, 10);
    // }

    // validatePassword(password: string) {
    //     return bcrypt.compareSync(password, this.password);
    // }

    // updateHashedPassword(password: string) {
    //     return bcrypt.hashSync(password, 10);
    // }

    // setSystemRole(role: SystemRole) {
    //     this.roles = this.roles.filter((r) => r !== SystemRole.SYSTEM_ADMIN && r !== SystemRole.SYSTEM_USER);
    //     this.roles.push(role);
    // }

    // toggleIsActive() {
    //     this.isActive = !this.isActive;
    // }

    // @BeforeInsert()
    // setDefaultRoles() {
    //     if (!this.roles || this.roles.length === 0) {
    //         this.roles = [UserRole.SYSTEM_USER, UserRole.ATTENDANCE_USER, UserRole.PROJECT_USER, UserRole.LRIM_USER];
    //     }
    // }

    // @BeforeInsert()
    // @BeforeUpdate()
    // checkRoles() {
    //     if (this.roles) {
    //         this.roles = this.roles.filter((role) => Object.values(UserRole).includes(role as UserRole));
    //     }
    // }

    // @AfterLoad()
    // sortRoles() {
    //     const roleOrder = [
    //         UserRole.SYSTEM_ADMIN,
    //         UserRole.SYSTEM_USER,
    //         UserRole.ATTENDANCE_ADMIN,
    //         UserRole.ATTENDANCE_USER,
    //         UserRole.PROJECT_ADMIN,
    //         UserRole.PROJECT_USER,
    //         UserRole.LRIM_ADMIN,
    //         UserRole.LRIM_USER,
    //     ];

    //     this.roles.sort((a, b) => roleOrder.indexOf(a as UserRole) - roleOrder.indexOf(b as UserRole));
    // }
}
