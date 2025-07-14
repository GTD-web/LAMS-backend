import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { EmployeeResponseDto } from './employee-response.dto';

/**
 * 직원 목록 조회 응답 DTO
 */
@Exclude()
export class EmployeeListResponseDto {
    @ApiProperty({
        description: '직원 목록',
        type: [EmployeeResponseDto],
    })
    @Expose()
    @Type(() => EmployeeResponseDto)
    readonly employees: EmployeeResponseDto[];

    @ApiProperty({
        description: '전체 직원 수',
        example: 120,
    })
    @Expose()
    readonly total: number;

    constructor(partial: Partial<EmployeeListResponseDto>) {
        Object.assign(this, partial);
    }
}
