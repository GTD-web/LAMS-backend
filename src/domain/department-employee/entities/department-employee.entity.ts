import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DepartmentEmployeeEntity {
    @PrimaryGeneratedColumn('uuid')
    departmentEmployeeId: string;

    @Column({ type: 'uuid' })
    departmentId: string;

    @Column({ type: 'uuid' })
    employeeId: string;
}
