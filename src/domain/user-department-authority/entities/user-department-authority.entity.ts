import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Unique,
} from 'typeorm';
import { DepartmentInfoEntity } from '@src/domain/department/entities/department-info.entity';
import { UserEntity } from '@src/domain/user/entities/user.entity';

/**
 * 사용자-부서 권한 관리 엔티티
 * - 사용자의 부서별 접근 권한과 검토 권한을 관리
 */
@Entity('user_department_authorities')
@Unique(['departmentId', 'userId', 'authorityType'])
export class UserDepartmentAuthorityEntity {
    @PrimaryGeneratedColumn('uuid')
    authorityId: string;

    @Column({ type: 'uuid' })
    departmentId: string;

    @Column({ type: 'uuid' })
    userId: string;

    @Column({
        type: 'enum',
        enum: ['access', 'review'],
        comment: 'access: 접근 권한, review: 검토 권한',
    })
    authorityType: 'access' | 'review';

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'uuid', nullable: true })
    grantedByUserId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // 관계 설정
    @ManyToOne(() => DepartmentInfoEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'departmentId' })
    department: DepartmentInfoEntity;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({ name: 'grantedByUserId' })
    grantedBy: UserEntity;

    /**
     * 권한 활성화
     */
    activate(): void {
        this.isActive = true;
    }

    /**
     * 권한 비활성화
     */
    deactivate(): void {
        this.isActive = false;
    }

    /**
     * 권한이 활성화 상태인지 확인
     */
    isActiveAuthority(): boolean {
        return this.isActive;
    }

    /**
     * 접근 권한인지 확인
     */
    isAccessAuthority(): boolean {
        return this.authorityType === 'access';
    }

    /**
     * 검토 권한인지 확인
     */
    isReviewAuthority(): boolean {
        return this.authorityType === 'review';
    }
}
