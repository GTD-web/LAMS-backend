import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { DepartmentResponseDto } from './department-response.dto';

/**
 * 부서 목록 조회 응답 DTO
 */
@Exclude()
export class DepartmentListResponseDto {
    @ApiProperty({
        description: '부서 목록',
        type: [DepartmentResponseDto],
    })
    @Expose()
    @Type(() => DepartmentResponseDto)
    readonly departments: DepartmentResponseDto[];

    @ApiProperty({
        description: '전체 부서 수',
        example: 25,
    })
    @Expose()
    readonly total: number;

    constructor(partial: Partial<DepartmentListResponseDto>) {
        Object.assign(this, partial);
    }
}
