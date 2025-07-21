import { DepartmentInfoEntity } from './department-info.entity';
import { EmployeeInfoEntity } from '../../employee/entities/employee-info.entity';
export declare class DepartmentEmployeeEntity {
    departmentEmployeeId: string;
    department: DepartmentInfoEntity;
    employee: EmployeeInfoEntity;
}
