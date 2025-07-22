import { Repository } from 'typeorm';
import { EmployeeInfoEntity } from '../entities/employee-info.entity';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { EmployeeResponseDto } from '@src/interfaces/dto/organization/responses/employee-response.dto';
export declare class EmployeeDomainService {
    private readonly employeeRepository;
    private readonly logger;
    constructor(employeeRepository: Repository<EmployeeInfoEntity>);
    toggleEmployeeExclude(employeeId: string): Promise<EmployeeInfoEntity>;
    findEmployeeById(employeeId: string): Promise<EmployeeInfoEntity | null>;
    findEmployeeByEmployeeNumber(employeeNumber: string): Promise<EmployeeInfoEntity | null>;
    findAllEmployees(isExclude?: boolean): Promise<EmployeeInfoEntity[]>;
    findEmployeesByDepartmentWithQuitFilter(departmentId: string): Promise<EmployeeInfoEntity[]>;
    findActiveEmployees(): Promise<EmployeeInfoEntity[]>;
    findInactiveEmployees(): Promise<EmployeeInfoEntity[]>;
    searchEmployeesWithCriteria(searchCriteria: {
        employeeName?: string;
        employeeNumber?: string;
        departmentId?: string;
        isExcludedFromCalculation?: boolean;
        keyword?: string;
        limit?: number;
        page?: number;
    }): Promise<PaginatedResponseDto<EmployeeResponseDto>>;
    searchEmployees(searchTerm: string): Promise<EmployeeInfoEntity[]>;
    searchEmployeesByNumber(employeeNumber: string): Promise<EmployeeInfoEntity[]>;
    findActiveEmployeesByDepartment(departmentId: string): Promise<EmployeeInfoEntity[]>;
    findIncludedEmployees(): Promise<EmployeeInfoEntity[]>;
    findExcludedEmployees(): Promise<EmployeeInfoEntity[]>;
    saveEmployee(employee: EmployeeInfoEntity): Promise<EmployeeInfoEntity>;
}
