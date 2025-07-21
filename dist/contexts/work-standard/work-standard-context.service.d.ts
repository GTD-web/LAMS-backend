import { AttendanceTypeDomainService } from '../../domain/attendance-type/services/attendance-type-domain.service';
import { HolidayDomainService } from '../../domain/holiday/services/holiday-domain.service';
import { AttendanceTypeEntity } from '../../domain/attendance-type/entities/attendance-type.entity';
import { HolidayInfoEntity } from '../../domain/holiday/entities/holiday-info.entity';
export declare class WorkStandardContextService {
    private readonly attendanceTypeDomainService;
    private readonly holidayDomainService;
    private readonly logger;
    constructor(attendanceTypeDomainService: AttendanceTypeDomainService, holidayDomainService: HolidayDomainService);
    페이지네이션된_근무_유형_목록_조회한다(limit: number, page: number): Promise<{
        attendanceTypes: AttendanceTypeEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
    근무_유형_ID로_조회한다(attendanceTypeId: string): Promise<AttendanceTypeEntity | null>;
    근무_유형을_생성한다(attendanceTypeData: Partial<AttendanceTypeEntity>): Promise<AttendanceTypeEntity>;
    근무_유형을_업데이트한다(attendanceTypeId: string, updateData: Partial<AttendanceTypeEntity>): Promise<AttendanceTypeEntity>;
    근무_유형을_삭제한다(attendanceTypeId: string): Promise<boolean>;
    모든_근무_유형을_조회한다(): Promise<AttendanceTypeEntity[]>;
    페이지네이션된_연도별_휴일_목록_조회한다(year: number, limit: number, page: number): Promise<{
        holidays: HolidayInfoEntity[];
        total: number;
        page: number;
        limit: number;
        year: number;
    }>;
    휴일_ID를_체크한다(holidayId: string): Promise<HolidayInfoEntity>;
    관리자는_휴일을_생성한다(date: string, holidayName: string): Promise<HolidayInfoEntity>;
    관리자는_휴일을_업데이트한다(holidayId: string, date: string, holidayName: string): Promise<HolidayInfoEntity>;
    관리자는_휴일을_삭제한다(holidayId: string): Promise<boolean>;
    일간_이벤트_요약에_공휴일이_변경된다(date: string): Promise<void>;
    월간_이벤트_요약에_공휴일이_변경된다(year: number, month: number): Promise<void>;
    SEED_데이터_초기화_설정한다(): Promise<void>;
}
