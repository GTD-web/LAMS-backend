import { ApiProperty } from '@nestjs/swagger';
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
        example: '개발팀',
    })
    @Expose()
    readonly departmentName: string;

    @ApiProperty({
        description: 'MMS 부서 ID',
        example: '67d0f0a79af04fc1b2f65ab1',
    })
    @Expose()
    readonly mmsDepartmentId: string;

    @ApiProperty({
        description: '상위 부서 ID',
        example: 'parent-dept-id',
        required: false,
    })
    @Expose()
    readonly parentDepartmentId?: string;

    @ApiProperty({
        description: '부서 깊이 레벨',
        example: 1,
    })
    @Expose()
    readonly depth: number;

    @ApiProperty({
        description: '평면화된 하위 부서 ID 목록',
        type: 'object',
        required: false,
    })
    @Expose()
    readonly flattenedChildrenIds?: {
        departmentIds: string[];
    };

    @ApiProperty({
        description: '부서 생성 시간',
        example: '2025-07-11T08:05:22.339Z',
        format: 'date-time',
    })
    @Expose()
    @Type(() => Date)
    readonly createdAt: Date;

    @ApiProperty({
        description: '부서 정보 업데이트 시간',
        example: '2025-07-11T08:05:22.339Z',
        format: 'date-time',
    })
    @Expose()
    @Type(() => Date)
    readonly updatedAt: Date;

    constructor(partial: Partial<DepartmentResponseDto>) {
        Object.assign(this, partial);
    }
}
