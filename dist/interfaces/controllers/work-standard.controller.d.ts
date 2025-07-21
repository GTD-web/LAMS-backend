import { WorkStandardBusinessService } from '../../business/work-standard/work-standard.business';
import { AttendanceTypeResponseDto } from '../dto/work-standard/responses/attendance-type-response.dto';
import { AttendanceTypeListResponseDto } from '../dto/work-standard/responses/attendance-type-list-response.dto';
import { HolidayResponseDto } from '../dto/work-standard/responses/holiday-response.dto';
import { HolidayListResponseDto } from '../dto/work-standard/responses/holiday-list-response.dto';
import { CreateAttendanceTypeDto } from '../dto/work-standard/requests/create-attendance-type.dto';
import { UpdateAttendanceTypeDto } from '../dto/work-standard/requests/update-attendance-type.dto';
import { CreateHolidayDto } from '../dto/work-standard/requests/create-holiday.dto';
import { UpdateHolidayDto } from '../dto/work-standard/requests/update-holiday.dto';
export declare class WorkStandardController {
    private readonly workStandardBusinessService;
    constructor(workStandardBusinessService: WorkStandardBusinessService);
    getAttendanceTypes(page?: number, limit?: number): Promise<AttendanceTypeListResponseDto>;
    getAllAttendanceTypes(): Promise<AttendanceTypeResponseDto[]>;
    getAttendanceTypeById(id: string): Promise<AttendanceTypeResponseDto | null>;
    createAttendanceType(dto: CreateAttendanceTypeDto): Promise<AttendanceTypeResponseDto>;
    updateAttendanceType(id: string, dto: UpdateAttendanceTypeDto): Promise<AttendanceTypeResponseDto>;
    deleteAttendanceType(id: string): Promise<boolean>;
    getHolidays(year: number, page?: number, limit?: number): Promise<HolidayListResponseDto>;
    createHoliday(dto: CreateHolidayDto): Promise<HolidayResponseDto>;
    updateHoliday(id: string, dto: UpdateHolidayDto): Promise<HolidayResponseDto>;
    deleteHoliday(id: string): Promise<boolean>;
    initializeSeedData(): Promise<boolean>;
}
