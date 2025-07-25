import { Injectable, Logger } from '@nestjs/common';
import { WorkStandardContextService } from '../../contexts/work-standard/work-standard-context.service';
import { AttendanceTypeResponseDto } from './dto/attendance-type-response.dto';
import { AttendanceTypeListResponseDto } from './dto/attendance-type-list-response.dto';
import { HolidayResponseDto } from './dto/holiday-response.dto';
import { HolidayListResponseDto } from './dto/holiday-list-response.dto';
import { CreateAttendanceTypeDto } from '../../interfaces/controllers/work-standard/dto/create-attendance-type.dto';
import { UpdateAttendanceTypeDto } from '../../interfaces/controllers/work-standard/dto/update-attendance-type.dto';
import { CreateHolidayDto } from '../../interfaces/controllers/work-standard/dto/create-holiday.dto';
import { UpdateHolidayDto } from '../../interfaces/controllers/work-standard/dto/update-holiday.dto';

/**
 * 근무 기준 비즈니스 서비스
 * - 근무 유형 및 공휴일 관리
 */
@Injectable()
export class WorkStandardBusinessService {
    private readonly logger = new Logger(WorkStandardBusinessService.name);

    constructor(private readonly workStandardContextService: WorkStandardContextService) {}

    /**
     * SEED 데이터 초기화
     */
    async initializeSeedData(): Promise<void> {
        await this.workStandardContextService.SEED_데이터_초기화_설정한다();
        this.logger.log('SEED 데이터 초기화 완료');
    }

    // ==================== 근무 유형 관련 메서드 ====================

    /**
     * 페이지네이션된 근무 유형 목록 조회
     */
    async getAttendanceTypeList(limit: number, page: number): Promise<AttendanceTypeListResponseDto> {
        const result = await this.workStandardContextService.페이지네이션된_근무_유형_목록_조회한다(limit, page);

        return new AttendanceTypeListResponseDto({
            attendanceTypes: AttendanceTypeResponseDto.fromEntities(result.attendanceTypes),
            total: result.total,
            page: result.page,
            limit: result.limit,
        });
    }

    /**
     * 근무 유형 생성
     */
    async createAttendanceType(dto: CreateAttendanceTypeDto): Promise<AttendanceTypeResponseDto> {
        const entity = await this.workStandardContextService.근무_유형을_생성한다(dto);
        return AttendanceTypeResponseDto.fromEntity(entity);
    }

    /**
     * 근무 유형 업데이트
     */
    async updateAttendanceType(
        attendanceTypeId: string,
        dto: UpdateAttendanceTypeDto,
    ): Promise<AttendanceTypeResponseDto> {
        const entity = await this.workStandardContextService.근무_유형을_업데이트한다(attendanceTypeId, dto);
        return AttendanceTypeResponseDto.fromEntity(entity);
    }

    /**
     * 근무 유형 삭제
     */
    async deleteAttendanceType(attendanceTypeId: string): Promise<boolean> {
        return await this.workStandardContextService.근무_유형을_삭제한다(attendanceTypeId);
    }

    /**
     * 근무 유형 ID로 조회
     */
    async getAttendanceTypeById(attendanceTypeId: string): Promise<AttendanceTypeResponseDto | null> {
        const entity = await this.workStandardContextService.근무_유형_ID로_조회한다(attendanceTypeId);
        return entity ? AttendanceTypeResponseDto.fromEntity(entity) : null;
    }

    /**
     * 모든 근무 유형 조회
     */
    async getAllAttendanceTypes(): Promise<AttendanceTypeResponseDto[]> {
        const entities = await this.workStandardContextService.모든_근무_유형을_조회한다();
        return AttendanceTypeResponseDto.fromEntities(entities);
    }

    // ==================== 공휴일 관련 메서드 ====================

    /**
     * 페이지네이션된 연도별 공휴일 목록 조회
     */
    async getHolidayList(year: number, limit: number, page: number): Promise<HolidayListResponseDto> {
        const result = await this.workStandardContextService.페이지네이션된_연도별_휴일_목록_조회한다(
            year,
            limit,
            page,
        );

        return new HolidayListResponseDto({
            holidays: HolidayResponseDto.fromEntities(result.holidays),
            total: result.total,
            page: result.page,
            limit: result.limit,
            year: result.year,
        });
    }

    /**
     * 공휴일 생성
     */
    async createHoliday(dto: CreateHolidayDto): Promise<HolidayResponseDto> {
        const entity = await this.workStandardContextService.관리자는_휴일을_생성한다(dto.holidayDate, dto.holidayName);

        // 일간/월간 이벤트 요약 업데이트
        await this.workStandardContextService.일간_이벤트_요약에_공휴일이_변경된다(dto.holidayDate);

        const year = parseInt(dto.holidayDate.split('-')[0]);
        const month = parseInt(dto.holidayDate.split('-')[1]);
        await this.workStandardContextService.월간_이벤트_요약에_공휴일이_변경된다(year, month);

        return HolidayResponseDto.fromEntity(entity);
    }

    /**
     * 공휴일 업데이트
     */
    async updateHoliday(holidayId: string, dto: UpdateHolidayDto): Promise<HolidayResponseDto> {
        // 기존 공휴일 정보 조회
        const existingHoliday = await this.workStandardContextService.휴일_ID를_체크한다(holidayId);

        // 업데이트할 데이터 준비 (기존 값을 기본값으로 사용)
        const holidayDate = dto.holidayDate ?? existingHoliday.holidayDate;
        const holidayName = dto.holidayName ?? existingHoliday.holidayName;

        const entity = await this.workStandardContextService.관리자는_휴일을_업데이트한다(
            holidayId,
            holidayDate,
            holidayName,
        );

        // 일간/월간 이벤트 요약 업데이트
        await this.workStandardContextService.일간_이벤트_요약에_공휴일이_변경된다(holidayDate);

        const year = parseInt(holidayDate.split('-')[0]);
        const month = parseInt(holidayDate.split('-')[1]);
        await this.workStandardContextService.월간_이벤트_요약에_공휴일이_변경된다(year, month);

        return HolidayResponseDto.fromEntity(entity);
    }

    /**
     * 공휴일 삭제
     */
    async deleteHoliday(holidayId: string): Promise<boolean> {
        // 공휴일 정보 조회 및 삭제
        const holiday = await this.workStandardContextService.휴일_ID를_체크한다(holidayId);
        const isDeleted = await this.workStandardContextService.관리자는_휴일을_삭제한다(holidayId);

        if (isDeleted) {
            // 일간/월간 이벤트 요약 업데이트
            await this.workStandardContextService.일간_이벤트_요약에_공휴일이_변경된다(holiday.holidayDate);

            const year = parseInt(holiday.holidayDate.split('-')[0]);
            const month = parseInt(holiday.holidayDate.split('-')[1]);
            await this.workStandardContextService.월간_이벤트_요약에_공휴일이_변경된다(year, month);
        }

        return isDeleted;
    }
}
