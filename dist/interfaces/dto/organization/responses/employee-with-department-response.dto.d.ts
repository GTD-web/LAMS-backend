import { EmployeeResponseDto } from './employee-response.dto';
import { DepartmentResponseDto } from './department-response.dto';
export declare class EmployeeWithDepartmentResponseDto {
    employee: EmployeeResponseDto;
    department: DepartmentResponseDto;
    constructor(partial: Partial<EmployeeWithDepartmentResponseDto>);
}
