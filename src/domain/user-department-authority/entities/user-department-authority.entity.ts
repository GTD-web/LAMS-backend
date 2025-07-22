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
import { AuthorityType } from '../enum/authority-type.enum';

/**
 * 사용자-부서 권한 관리 엔티티
 * - 사용자의 부서별 접근 권한과 검토 권한을 관리
 */
@Entity('user_department_authorities')
export class UserDepartmentAuthorityEntity {
    @PrimaryGeneratedColumn('uuid')
    authorityId: string;

    @Column({ type: 'uuid' })
    departmentId: string;

    @Column({ type: 'uuid' })
    userId: string;

    @Column({
        type: 'enum',
        enum: AuthorityType,
        comment: 'access: 접근 권한, review: 검토 권한',
    })
    authorityType: AuthorityType;

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
}
