import { HolidayResponseDto } from './holiday-response.dto';
export declare class HolidayListResponseDto {
    readonly holidays: HolidayResponseDto[];
    readonly total: number;
    readonly page: number;
    readonly limit: number;
    readonly year: number;
    constructor(data: {
        holidays: HolidayResponseDto[];
        total: number;
        page: number;
        limit: number;
        year: number;
    });
}
