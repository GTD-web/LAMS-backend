import * as bcrypt from 'bcrypt';
import {
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    TableInheritance,
    UpdateDateColumn,
} from 'typeorm';
import { SystemRole, UserRole } from '../enum/user.enum';

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

    @Column({
        default: false,
    })
    isIntegrated: boolean;

    @Column({ type: 'varchar', default: 'LamsUserEntity', nullable: false })
    type: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10);
    }

    validatePassword(password: string) {
        return bcrypt.compareSync(password, this.password);
    }

    updateHashedPassword(password: string) {
        return bcrypt.hashSync(password, 10);
    }

    setSystemRole(role: SystemRole) {
        this.roles = this.roles.filter((r) => r !== SystemRole.SYSTEM_ADMIN && r !== SystemRole.SYSTEM_USER);
        this.roles.push(role);
    }

    toggleIsActive() {
        this.isActive = !this.isActive;
    }

    @BeforeInsert()
    setDefaultRoles() {
        if (!this.roles || this.roles.length === 0) {
            this.roles = [UserRole.SYSTEM_USER, UserRole.ATTENDANCE_USER, UserRole.PROJECT_USER, UserRole.LRIM_USER];
        }
    }

    @BeforeInsert()
    @BeforeUpdate()
    checkRoles() {
        if (this.roles) {
            this.roles = this.roles.filter((role) => Object.values(UserRole).includes(role as UserRole));
        }
    }

    @AfterLoad()
    sortRoles() {
        const roleOrder = [
            UserRole.SYSTEM_ADMIN,
            UserRole.SYSTEM_USER,
            UserRole.ATTENDANCE_ADMIN,
            UserRole.ATTENDANCE_USER,
            UserRole.PROJECT_ADMIN,
            UserRole.PROJECT_USER,
            UserRole.LRIM_ADMIN,
            UserRole.LRIM_USER,
        ];

        this.roles.sort((a, b) => roleOrder.indexOf(a as UserRole) - roleOrder.indexOf(b as UserRole));
    }
}
