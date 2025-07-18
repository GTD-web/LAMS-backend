import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/**
 * 직원 응답 DTO
 */
@Exclude()
export class EmployeeResponseDto {
    @ApiProperty({
        description: '직원 고유 ID',
        example: 'employee-uuid-123',
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

    @ApiPropertyOptional({
        description: 'MMS 직원 ID',
        example: 'mms_emp_001',
    })
    @Expose()
    readonly mmsEmployeeId?: string;

    @ApiProperty({
        description: '계산 제외 여부',
        example: false,
    })
    @Expose()
    readonly isExcludedFromCalculation: boolean;

    @ApiPropertyOptional({
        description: '속 부서ID',
        example: 'dept-uuid-123',
        format: 'uuid',
    })
    @Expose()
    readonly departmentId?: string;

    @ApiProperty({
        description: '직원 생성일',
        example: '2025-01-01T00:00:00.000Z',
        format: 'date-time',
    })
    @Expose()
    @Type(() => Date)
    readonly createdAt: Date;

    @ApiProperty({
        description: '직원 수정일',
        example: '2025-01-01T00:00:00.000Z',
        format: 'date-time',
    })
    @Expose()
    @Type(() => Date)
    readonly updatedAt: Date;

    constructor(partial: Partial<EmployeeResponseDto>) {
        Object.assign(this, partial);
    }
}
