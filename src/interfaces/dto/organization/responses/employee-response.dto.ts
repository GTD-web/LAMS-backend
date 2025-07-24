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

    @ApiProperty({
        description: '직원 이메일',
        example: 'exEmployeeEmail',
    })
    @Expose()
    readonly email: string;

    @ApiProperty({
        description: '입사일',
        example: '2021-01-01',
    })
    @Expose()
    readonly entryAt: string;

    @ApiProperty({
        description: '생일',
        example: '1990-01-01',
    })
    @Expose()
    readonly birthDate: string;

    @ApiProperty({
        description: '퇴사일',
        example: '2023-12-31',
    })
    @Expose()
    readonly quitedAt: string;

    @ApiProperty({
        description: '계산 제외 여부',
        example: false,
    })
    @Expose()
    readonly isExcludedFromCalculation: boolean;

    @ApiProperty({
        description: '소속 부서ID',
        example: 'department-uuid',
        required: false,
    })
    @Expose()
    readonly departmentId: string;

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
