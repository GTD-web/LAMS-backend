import { ApiProperty } from '@nestjs/swagger';
import { DepartmentResponseDto } from '../../../business/organization/dto/department-response.dto';
import { EmployeeResponseDto } from '../../../business/organization/dto/employee-response.dto';

/**
 * 직원 목록을 포함한 부서 응답 DTO
 */
export class DepartmentWithEmployeesResponseDto extends DepartmentResponseDto {
    @ApiProperty({
        description: '부서 소속 직원 목록',
        type: [EmployeeResponseDto],
    })
    readonly employees: EmployeeResponseDto[];

    constructor(partial: Partial<DepartmentWithEmployeesResponseDto>) {
        super(partial);
        Object.assign(this, partial);
    }
}
