import { ApiProperty } from '@nestjs/swagger';
import { EmployeeResponseDto } from '../../../business/organization/dto/employee-response.dto';
import { DepartmentResponseDto } from '../../../business/organization/dto/department-response.dto';

/**
 * 부서 정보를 포함한 직원 응답 DTO
 */
export class EmployeeWithDepartmentResponseDto extends EmployeeResponseDto {
    @ApiProperty({
        description: '소속 부서 정보',
        type: DepartmentResponseDto,
        required: false,
    })
    readonly department?: DepartmentResponseDto;

    constructor(partial: Partial<EmployeeWithDepartmentResponseDto>) {
        super(partial);
        Object.assign(this, partial);
    }
}
