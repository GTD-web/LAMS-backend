import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { EmployeeResponseDto } from './employee-response.dto';
import { DepartmentResponseDto } from './department-response.dto';

/**
 * 직원과 부서 정보 함께 조회 응답 DTO
 */
@Exclude()
export class EmployeeWithDepartmentResponseDto {
    @ApiPropertyOptional({
        description: '직원 정보',
        type: EmployeeResponseDto,
    })
    @Expose()
    @Type(() => EmployeeResponseDto)
    readonly employee: EmployeeResponseDto | null;

    @ApiPropertyOptional({
        description: '소속 부서 정보',
        type: DepartmentResponseDto,
    })
    @Expose()
    @Type(() => DepartmentResponseDto)
    readonly department: DepartmentResponseDto | null;

    constructor(partial: Partial<EmployeeWithDepartmentResponseDto>) {
        Object.assign(this, partial);
    }
}
