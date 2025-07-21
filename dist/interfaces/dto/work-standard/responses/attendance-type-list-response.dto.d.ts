import { AttendanceTypeResponseDto } from './attendance-type-response.dto';
export declare class AttendanceTypeListResponseDto {
    readonly attendanceTypes: AttendanceTypeResponseDto[];
    readonly total: number;
    readonly page: number;
    readonly limit: number;
    constructor(data: {
        attendanceTypes: AttendanceTypeResponseDto[];
        total: number;
        page: number;
        limit: number;
    });
}
