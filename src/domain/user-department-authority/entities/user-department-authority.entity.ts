import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AuthorityType } from '../enum/authority-type.enum';

/**
 * 사용자-부서 권한 관리 엔티티
 * - 사용자의 부서별 접근 권한과 검토 권한을 관리
 * - 단순 ID 필드만 사용
 */
@Entity('user_department_authorities')
export class UserDepartmentAuthorityEntity {
    @PrimaryGeneratedColumn('uuid')
    authorityId: string;

    @Column({ type: 'uuid', comment: '부서 ID' })
    departmentId: string;

    @Column({ type: 'uuid', comment: '사용자 ID' })
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
}
