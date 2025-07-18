import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/**
 * 부서 응답 DTO
 */
@Exclude()
export class DepartmentResponseDto {
    @ApiProperty({
        description: '부서 고유 ID',
        example: 'b520bc5c-d90d-4ec6-aa27-d527e05a2f28',
        format: 'uuid',
    })
    @Expose()
    readonly departmentId: string;

    @ApiProperty({
        description: '부서명',
        example: '개발',
    })
    @Expose()
    readonly departmentName: string;

    @ApiProperty({
        description: '부서코드',
        example: 'DEV001',
    })
    @Expose()
    readonly departmentCode: string;

    @ApiPropertyOptional({
        description: 'MMS 부서ID',
        example: 'mms_dept_001',
    })
    @Expose()
    readonly mmsDepartmentId?: string;

    @ApiProperty({
        description: '부서 제외 여부',
        example: false,
    })
    @Expose()
    readonly isExclude: boolean;

    @ApiPropertyOptional({
        description: '상위 부서ID',
        example: 'parent-dept-uuid',
        format: 'uuid',
    })
    @Expose()
    readonly parentDepartmentId?: string;

    @ApiPropertyOptional({
        description: '조직 정보 ID',
        example: 'org-chart-uuid',
        format: 'uuid',
    })
    @Expose()
    readonly orgChartInfoId?: string;

    @ApiProperty({
        description: '부서 생성일',
        example: '2025-01-01T00:00:00.000Z',
        format: 'date-time',
    })
    @Expose()
    @Type(() => Date)
    readonly createdAt: Date;

    @ApiProperty({
        description: '부서 수정일',
        example: '2025-01-01T00:00:00.000Z',
        format: 'date-time',
    })
    @Expose()
    @Type(() => Date)
    readonly updatedAt: Date;

    constructor(partial: Partial<DepartmentResponseDto>) {
        Object.assign(this, partial);
    }
}
