import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DepartmentInfoEntity } from './department-info.entity';
import { EmployeeInfoEntity } from '../../employee/entities/employee-info.entity';

@Entity()
export class DepartmentEmployeeEntity {
    @PrimaryGeneratedColumn('uuid')
    departmentEmployeeId: string;

    @ManyToOne(() => DepartmentInfoEntity, (department) => department.employees)
    department: DepartmentInfoEntity;

    @ManyToOne(() => EmployeeInfoEntity, (employee) => employee.department)
    employee: EmployeeInfoEntity;
}
