import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { DepartmentResponseDto } from './department-response.dto';

/**
 * 직원 정보 DTO (부서 포함 응답)
 */
@Exclude()
export class EmployeeInDepartmentDto {
    @ApiProperty({
        description: '직원 고유 ID',
        example: 'employee-uuid',
        format: 'uuid',
    })
    @Expose()
    readonly employeeId: string;

    @ApiProperty({
        description: '직원명',
        example: '김개발',
    })
    @Expose()
    readonly employeeName: string;

    @ApiProperty({
        description: '직원 번호',
        example: 'EMP001',
    })
    @Expose()
    readonly employeeNumber: string;

    @ApiProperty({
        description: '계산 제외 여부',
        example: false,
    })
    @Expose()
    readonly isExcludedFromCalculation: boolean;

    constructor(partial: Partial<EmployeeInDepartmentDto>) {
        Object.assign(this, partial);
    }
}

/**
 * 부서 직원 정보 조회 응답 DTO
 */
@Exclude()
export class DepartmentWithEmployeesResponseDto {
    @ApiPropertyOptional({
        description: '부서 정보',
        type: DepartmentResponseDto,
    })
    @Expose()
    @Type(() => DepartmentResponseDto)
    readonly department: DepartmentResponseDto | null;

    @ApiProperty({
        description: '부서 소속 직원 목록',
        type: [EmployeeInDepartmentDto],
        isArray: true,
    })
    @Expose()
    @Type(() => EmployeeInDepartmentDto)
    readonly employees: EmployeeInDepartmentDto[];

    constructor(partial: Partial<DepartmentWithEmployeesResponseDto>) {
        Object.assign(this, partial);
    }
}
