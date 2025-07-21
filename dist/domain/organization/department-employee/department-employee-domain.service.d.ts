import { Repository } from 'typeorm';
import { DepartmentEmployeeEntity } from '../department/entities/department-employee.entity';
import { DepartmentInfoEntity } from '../department/entities/department-info.entity';
import { EmployeeInfoEntity } from '../employee/entities/employee-info.entity';
export declare class DepartmentEmployeeDomainService {
    private readonly departmentEmployeeRepository;
    private readonly logger;
    constructor(departmentEmployeeRepository: Repository<DepartmentEmployeeEntity>);
    createDepartmentEmployee(department: DepartmentInfoEntity, employee: EmployeeInfoEntity): Promise<DepartmentEmployeeEntity>;
    saveDepartmentEmployee(departmentEmployee: DepartmentEmployeeEntity): Promise<DepartmentEmployeeEntity>;
    deleteDepartmentEmployeeByEmployeeId(employeeId: string): Promise<void>;
    deleteDepartmentEmployeeByDepartmentId(departmentId: string): Promise<void>;
    findDepartmentEmployeesByDepartmentId(departmentId: string): Promise<DepartmentEmployeeEntity[]>;
    findDepartmentEmployeesByEmployeeId(employeeId: string): Promise<DepartmentEmployeeEntity[]>;
    deleteAllDepartmentEmployees(): Promise<void>;
    existsDepartmentEmployee(departmentId: string, employeeId: string): Promise<boolean>;
}
