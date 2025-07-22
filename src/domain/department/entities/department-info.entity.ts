import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DepartmentEmployeeEntity } from '../../department-employee/entities/department-employee.entity';
import { UserEntity } from '@src/domain/user/entities/user.entity';

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

    @ManyToMany(() => UserEntity, (user) => user.accessableDepartments, {
        cascade: true,
        eager: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinTable({ name: 'accessAuthorities' })
    accessAuthorities: UserEntity[];

    @ManyToMany(() => UserEntity, (user) => user.reviewableDepartments, {
        cascade: true,
        eager: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinTable({ name: 'reviewAuthorities' })
    reviewAuthorities: UserEntity[];

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

    @OneToMany(() => DepartmentEmployeeEntity, (employee) => employee.department)
    employees: DepartmentEmployeeEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    toggleExclude() {
        this.isExclude = !this.isExclude;
    }

    // private setAccessAuthorities(authorities: UserEntity[]): void {
    //     this.accessAuthorities = authorities;
    // }

    // private setReviewAuthorities(authorities: UserEntity[]): void {
    //     this.reviewAuthorities = authorities;
    // }

    isAccessAuthority(user: UserEntity): boolean {
        return this.accessAuthorities.some((u) => u.userId === user.userId);
    }

    isReviewAuthority(user: UserEntity): boolean {
        return this.reviewAuthorities.some((u) => u.userId === user.userId);
    }

    // includeAccessAuthority(user: UserEntity): void {
    //     if (!this.accessAuthorities) {
    //         this.accessAuthorities = [];
    //     }
    //     const isAccessAuthority = this.isAccessAuthority(user);
    //     if (!isAccessAuthority) {
    //         this.accessAuthorities.push(user);
    //     }
    // }

    // includeReviewAuthority(user: UserEntity): void {
    //     if (!this.reviewAuthorities) {
    //         this.reviewAuthorities = [];
    //     }

    //     if (!this.isReviewAuthority(user)) {
    //         this.reviewAuthorities.push(user);
    //     }
    // }

    // excludeAccessAuthority(user: UserEntity): void {
    //     try {
    //         const authorities = this.accessAuthorities.filter((u) => u.userId !== user.userId);
    //         this.setAccessAuthorities(authorities);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // excludeReviewAuthority(user: UserEntity): void {
    //     try {
    //         const authorities = this.reviewAuthorities.filter((u) => u.userId !== user.userId);
    //         this.setReviewAuthorities(authorities);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // static async findDepartmentWithChildren(
    //     repository: Repository<DepartmentInfoEntity>,
    //     options: {
    //         departmentId?: string;
    //         withEmployees?: boolean;
    //         withChildren?: boolean;
    //         where?: FindOptionsWhere<DepartmentInfoEntity>;
    //         order?: FindOptionsOrder<DepartmentInfoEntity>;
    //     } = {},
    // ) {
    //     const {
    //         departmentId,
    //         withEmployees = true,
    //         withChildren = true,
    //         where = {},
    //         order,
    //     } = options;
    //     const relations: string[] = [];
    //     if (withEmployees)
    //         relations.push(
    //             'employees',
    //             'employees.employee',
    //             'employees.employee.departments',
    //             'employees.employee.departments.department',
    //         );
    //     if (withChildren) relations.push('children');

    //     if (departmentId) {
    //         where.departmentId = departmentId;
    //     } else {
    //         where.parentDepartmentId = IsNull();
    //     }

    //     const department = await repository.findOne({
    //         where,
    //         relations,
    //         order,
    //     });

    //     return this.getAllChildDepartments(repository, department, relations);
    // }

    // static async getAllChildDepartments(
    //     repository: Repository<DepartmentInfoEntity>,
    //     dept: DepartmentInfoEntity,
    //     relations: string[],
    // ): Promise<DepartmentInfoEntity> {
    //     if (!dept.children?.length) return dept;

    //     const childDepts = await Promise.all(
    //         dept.children.map((child) =>
    //             repository.findOne({
    //                 where: { departmentId: child.departmentId },
    //                 relations,
    //             }),
    //         ),
    //     );

    //     dept.children = await Promise.all(
    //         childDepts.map((child) => this.getAllChildDepartments(repository, child, relations)),
    //     );
    //     return dept;
    // }

    // static async getAllEmployee(
    //     dept: DepartmentInfoEntity,
    //     options: {
    //         withQuited: boolean;
    //         withExclude: boolean;
    //     } = {
    //         withQuited: false,
    //         withExclude: true,
    //     },
    // ): Promise<EmployeeInfoEntity[]> {
    //     const { withQuited, withExclude } = options;
    //     let currentDeptEmployees = dept.employees?.map((emp) => emp.employee) || [];

    //     if (!withQuited) {
    //         currentDeptEmployees = currentDeptEmployees.filter((emp) => emp.quitedAt === null || emp.quitedAt === '');
    //     }
    //     if (!withExclude) {
    //         currentDeptEmployees = currentDeptEmployees.filter((emp) => emp.isExcludedFromCalculation === false);
    //     }
    //     if (dept.children?.length) {
    //         const childDepts = (
    //             await Promise.all(dept.children.map((child) => this.getAllEmployee(child, options)))
    //         ).flat();

    //         return [...currentDeptEmployees, ...childDepts];
    //     }
    //     return currentDeptEmployees;
    // }
}
