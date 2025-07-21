import { DepartmentResponseDto } from './department-response.dto';
export declare class EmployeeInDepartmentDto {
    readonly employeeId: string;
    readonly employeeName: string;
    readonly employeeNumber: string;
    readonly isExcludedFromCalculation: boolean;
    constructor(partial: Partial<EmployeeInDepartmentDto>);
}
export declare class DepartmentWithEmployeesResponseDto {
    readonly department: DepartmentResponseDto | null;
    readonly employees: EmployeeInDepartmentDto[];
    constructor(partial: Partial<DepartmentWithEmployeesResponseDto>);
}
