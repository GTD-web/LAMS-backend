import { WorkStandardContextService } from '../../contexts/work-standard/work-standard-context.service';
import { AttendanceTypeResponseDto } from '../../interfaces/dto/work-standard/responses/attendance-type-response.dto';
import { AttendanceTypeListResponseDto } from '../../interfaces/dto/work-standard/responses/attendance-type-list-response.dto';
import { HolidayResponseDto } from '../../interfaces/dto/work-standard/responses/holiday-response.dto';
import { HolidayListResponseDto } from '../../interfaces/dto/work-standard/responses/holiday-list-response.dto';
import { CreateAttendanceTypeDto } from '../../interfaces/dto/work-standard/requests/create-attendance-type.dto';
import { UpdateAttendanceTypeDto } from '../../interfaces/dto/work-standard/requests/update-attendance-type.dto';
import { CreateHolidayDto } from '../../interfaces/dto/work-standard/requests/create-holiday.dto';
import { UpdateHolidayDto } from '../../interfaces/dto/work-standard/requests/update-holiday.dto';
export declare class WorkStandardBusinessService {
    private readonly workStandardContextService;
    private readonly logger;
    constructor(workStandardContextService: WorkStandardContextService);
    initializeSeedData(): Promise<void>;
    getAttendanceTypeList(limit: number, page: number): Promise<AttendanceTypeListResponseDto>;
    createAttendanceType(dto: CreateAttendanceTypeDto): Promise<AttendanceTypeResponseDto>;
    updateAttendanceType(attendanceTypeId: string, dto: UpdateAttendanceTypeDto): Promise<AttendanceTypeResponseDto>;
    deleteAttendanceType(attendanceTypeId: string): Promise<boolean>;
    getAttendanceTypeById(attendanceTypeId: string): Promise<AttendanceTypeResponseDto | null>;
    getAllAttendanceTypes(): Promise<AttendanceTypeResponseDto[]>;
    getHolidayList(year: number, limit: number, page: number): Promise<HolidayListResponseDto>;
    createHoliday(dto: CreateHolidayDto): Promise<HolidayResponseDto>;
    updateHoliday(holidayId: string, dto: UpdateHolidayDto): Promise<HolidayResponseDto>;
    deleteHoliday(holidayId: string): Promise<boolean>;
}
