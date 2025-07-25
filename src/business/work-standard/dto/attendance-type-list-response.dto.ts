import { ApiProperty } from '@nestjs/swagger';
import { AttendanceTypeResponseDto } from './attendance-type-response.dto';
/**
 * 근무 유형 목록 응답 DTO
 */
export class AttendanceTypeListResponseDto {
    @ApiProperty({
        description: '근무 유형 목록',
        type: [AttendanceTypeResponseDto],
    })
    readonly attendanceTypes: AttendanceTypeResponseDto[];

    @ApiProperty({
        description: '전체 개수',
        example: 10,
        type: 'integer',
    })
    readonly total: number;

    @ApiProperty({
        description: '현재 페이지',
        example: 1,
        type: 'integer',
    })
    readonly page: number;

    @ApiProperty({
        description: '페이지당 항목 수',
        example: 10,
        type: 'integer',
    })
    readonly limit: number;

    constructor(data: { attendanceTypes: AttendanceTypeResponseDto[]; total: number; page: number; limit: number }) {
        this.attendanceTypes = data.attendanceTypes;
        this.total = data.total;
        this.page = data.page;
        this.limit = data.limit;
    }
}
