import { ApiProperty } from '@nestjs/swagger';
import { HolidayResponseDto } from './holiday-response.dto';

/**
 * 공휴일 목록 응답 DTO
 */
export class HolidayListResponseDto {
    @ApiProperty({
        description: '공휴일 목록',
        type: [HolidayResponseDto],
    })
    readonly holidays: HolidayResponseDto[];

    @ApiProperty({
        description: '전체 개수',
        example: 15,
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

    @ApiProperty({
        description: '조회 연도',
        example: 2024,
        type: 'integer',
    })
    readonly year: number;

    constructor(data: { holidays: HolidayResponseDto[]; total: number; page: number; limit: number; year: number }) {
        this.holidays = data.holidays;
        this.total = data.total;
        this.page = data.page;
        this.limit = data.limit;
        this.year = data.year;
    }
}
