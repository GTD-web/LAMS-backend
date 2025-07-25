import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DepartmentInfoEntity {
    @PrimaryGeneratedColumn('uuid')
    departmentId: string;

    @Column()
    departmentName: string;

    @Column({ nullable: true })
    departmentCode: string;

    @Column({ nullable: true })
    mmsDepartmentId: string;

    @Column({ type: 'jsonb', nullable: true })
    flattenedChildrenIds: {
        departmentIds: string[];
        mmsDepartmentIds: string[];
    };

    // @ManyToMany(() => UserEntity, (user) => user.accessableDepartments, {
    //     cascade: true,
    //     eager: true,
    //     onDelete: 'CASCADE',
    //     onUpdate: 'CASCADE',
    // })
    // @JoinTable({ name: 'accessAuthorities' })
    // accessAuthorities: UserEntity[];

    // @ManyToMany(() => UserEntity, (user) => user.reviewableDepartments, {
    //     cascade: true,
    //     eager: true,
    //     onDelete: 'CASCADE',
    //     onUpdate: 'CASCADE',
    // })
    // @JoinTable({ name: 'reviewAuthorities' })
    // reviewAuthorities: UserEntity[];

    // UserDepartmentAuthorityEntity와의 관계 제거 (단순 ID 필드 사용)

    @Column({ default: false })
    isExclude: boolean;

    @Column({ type: 'uuid', nullable: true })
    parentDepartmentId: string;

    @ManyToOne(() => DepartmentInfoEntity, (department) => department.children, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'parentDepartmentId' })
    parent: DepartmentInfoEntity;

    @OneToMany(() => DepartmentInfoEntity, (department) => department.parent)
    children: DepartmentInfoEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    toggleExclude() {
        this.isExclude = !this.isExclude;
    }
}
