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
import { HolidaySyncResponseDto, ManualHolidaySyncResponseDto } from './dto/holiday-sync-response.dto';
import {
    AttendanceTypeSeedResponseDto,
    AttendanceTypeExistsResponseDto,
} from './dto/attendance-type-seed-response.dto';
import { PaginationQueryDto } from '../../common/dtos/pagination/pagination-query.dto';

/**
 * 근무 기준 비즈니스 서비스
 * - 근무 유형 및 공휴일 관리
 */
@Injectable()
export class WorkStandardBusinessService {
    constructor(private readonly workStandardContextService: WorkStandardContextService) {}

    // ==================== 근무 유형 관련 메서드 ====================

    /**
     * 페이지네이션된 근무 유형 목록 조회
     */
    async getAttendanceTypeList(paginationQuery: PaginationQueryDto): Promise<AttendanceTypeListResponseDto> {
        const result = await this.workStandardContextService.페이지네이션된_근무_유형_목록_조회한다(paginationQuery);

        return new AttendanceTypeListResponseDto({
            attendanceTypes: AttendanceTypeResponseDto.fromEntities(result.data),
            total: result.meta.total,
            page: result.meta.page,
            limit: result.meta.limit,
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
    async getAttendanceTypeById(attendanceTypeId: string): Promise<AttendanceTypeResponseDto> {
        const entity = await this.workStandardContextService.근무_유형_ID로_조회_예외처리한다(attendanceTypeId);
        return AttendanceTypeResponseDto.fromEntity(entity);
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
    async getHolidayList(year: number, paginationQuery: PaginationQueryDto): Promise<HolidayListResponseDto> {
        const result = await this.workStandardContextService.페이지네이션된_연도별_휴일_목록_조회한다(
            year,
            paginationQuery,
        );

        return new HolidayListResponseDto({
            holidays: HolidayResponseDto.fromEntities(result.data),
            total: result.meta.total,
            page: result.meta.page,
            limit: result.meta.limit,
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

    // ==================== 휴일 동기화 관련 메서드 ====================

    /**
     * 연도별 휴일 동기화
     */
    async syncHolidaysByYear(year?: string): Promise<HolidaySyncResponseDto> {
        const syncedHolidays = await this.workStandardContextService.연도별_휴일_동기화를_실행한다(year);
        const targetYear = year || new Date().getFullYear().toString();

        return new HolidaySyncResponseDto({
            message: `${targetYear}년 휴일 동기화가 완료되었습니다.`,
            syncedCount: syncedHolidays.length,
            year: targetYear,
        });
    }

    /**
     * 수동 휴일 동기화
     */
    async manualSyncHolidays(year?: string): Promise<ManualHolidaySyncResponseDto> {
        await this.workStandardContextService.수동_휴일_동기화를_실행한다(year);
        const targetYear = year || new Date().getFullYear().toString();

        return new ManualHolidaySyncResponseDto({
            message: `${targetYear}년 휴일 동기화가 완료되었습니다.`,
            year: targetYear,
        });
    }

    // ==================== 근무 유형 시드 관련 메서드 ====================

    /**
     * 근무 유형 시드 데이터 초기화
     */
    async initializeAttendanceTypeSeeds(): Promise<AttendanceTypeSeedResponseDto> {
        await this.workStandardContextService.근무_유형_시드_데이터를_초기화한다();
        const count = await this.workStandardContextService.근무_유형_개수를_조회한다();

        return new AttendanceTypeSeedResponseDto({
            message: '근무 유형 시드 데이터 초기화가 완료되었습니다.',
            count,
        });
    }

    /**
     * 근무 유형 시드 데이터 재초기화
     */
    async resetAttendanceTypeSeeds(): Promise<AttendanceTypeSeedResponseDto> {
        await this.workStandardContextService.근무_유형_시드_데이터를_재초기화한다();
        const count = await this.workStandardContextService.근무_유형_개수를_조회한다();

        return new AttendanceTypeSeedResponseDto({
            message: '근무 유형 시드 데이터 재초기화가 완료되었습니다.',
            count,
        });
    }

    /**
     * 근무 유형 존재 여부 확인
     */
    async checkAttendanceTypeExists(title: string): Promise<AttendanceTypeExistsResponseDto> {
        const exists = await this.workStandardContextService.근무_유형_존재_여부를_확인한다(title);

        return new AttendanceTypeExistsResponseDto({
            title,
            exists,
        });
    }
}
