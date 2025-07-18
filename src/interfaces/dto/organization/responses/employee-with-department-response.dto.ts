import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { EmployeeResponseDto } from './employee-response.dto';
import { DepartmentResponseDto } from './department-response.dto';

/**
 * 직원 부서 정보 조회 응답 DTO
 */
@Exclude()
export class EmployeeWithDepartmentResponseDto {
    @ApiProperty({
        description: '직원 정보',
        type: EmployeeResponseDto,
    })
    employee: EmployeeResponseDto;

    @ApiProperty({
        description: '소속 부서 정보',
        type: DepartmentResponseDto,
    })
    department: DepartmentResponseDto;

    constructor(partial: Partial<EmployeeWithDepartmentResponseDto>) {
        Object.assign(this, partial);
    }
}
