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
    };

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
