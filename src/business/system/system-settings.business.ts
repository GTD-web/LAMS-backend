import { Injectable, Logger } from '@nestjs/common';
import { AttendanceTypeContextService } from '@src/domain/attendance/attendance-type/services/attendance-type-context.service';
import { HolidayContextService } from '@src/domain/holiday/services/holiday-context.service';
import { AttendanceTypeEntity } from '@src/domain/attendance/attendance-type/entities/attendance-type.entity';
import { HolidayInfoEntity } from '@src/domain/holiday/entities/holiday-info.entity';

/**
 * 시스템 설정 비즈니스 서비스
 * - 근무 유형 및 휴일 관리
 */
@Injectable()
export class SystemSettingsBusinessService {
    private readonly logger = new Logger(SystemSettingsBusinessService.name);

    constructor(
        private readonly attendanceTypeContextService: AttendanceTypeContextService,
        private readonly holidayContextService: HolidayContextService,
    ) {}

    /**
     * SEED 데이터 초기화
     */
    async initializeSeedData(): Promise<void> {
        try {
            await this.holidayContextService.SEED_데이터_초기화_설정한다();
            this.logger.log('SEED 데이터 초기화 완료');
        } catch (error) {
            this.logger.error('SEED 데이터 초기화 실패', error);
            throw error;
        }
    }

    /**
     * 페이지네이션된 근무 유형 목록 조회
     */
    async getAttendanceTypeList(
        limit: number,
        page: number,
    ): Promise<{
        attendanceTypes: AttendanceTypeEntity[];
        total: number;
        page: number;
        limit: number;
    }> {
        try {
            return await this.attendanceTypeContextService.페이지네이션된_근무_유형_목록_조회한다(limit, page);
        } catch (error) {
            this.logger.error('근무 유형 목록 조회 실패', error);
            throw error;
        }
    }

    /**
     * 페이지네이션된 연도별 휴일 목록 조회
     */
    async getHolidayList(
        year: number,
        limit: number,
        page: number,
    ): Promise<{
        holidays: HolidayInfoEntity[];
        total: number;
        page: number;
        limit: number;
        year: number;
    }> {
        try {
            return await this.holidayContextService.페이지네이션된_연도별_휴일_목록_조회한다(year, limit, page);
        } catch (error) {
            this.logger.error('휴일 목록 조회 실패', error);
            throw error;
        }
    }

    /**
     * 휴일 생성
     */
    async createHoliday(date: string, holidayName: string): Promise<HolidayInfoEntity> {
        try {
            const holiday = await this.holidayContextService.관리자는_휴일을_생성한다(date, holidayName);

            // 일간/월간 이벤트 요약 업데이트
            await this.holidayContextService.일간_이벤트_요약에_공휴일이_변경된다(date);

            const year = parseInt(date.split('-')[0]);
            const month = parseInt(date.split('-')[1]);
            await this.holidayContextService.월간_이벤트_요약에_공휴일이_변경된다(year, month);

            return holiday;
        } catch (error) {
            this.logger.error('휴일 생성 실패', error);
            throw error;
        }
    }

    /**
     * 휴일 업데이트
     */
    async updateHoliday(holidayId: string, date: string, holidayName: string): Promise<HolidayInfoEntity> {
        try {
            // 휴일 ID 체크
            await this.holidayContextService.휴일_ID를_체크한다(holidayId);

            const holiday = await this.holidayContextService.관리자는_휴일을_업데이트한다(holidayId, date, holidayName);

            // 일간/월간 이벤트 요약 업데이트
            await this.holidayContextService.일간_이벤트_요약에_공휴일이_변경된다(date);

            const year = parseInt(date.split('-')[0]);
            const month = parseInt(date.split('-')[1]);
            await this.holidayContextService.월간_이벤트_요약에_공휴일이_변경된다(year, month);

            return holiday;
        } catch (error) {
            this.logger.error('휴일 업데이트 실패', error);
            throw error;
        }
    }

    /**
     * 휴일 삭제
     */
    async deleteHoliday(holidayId: string): Promise<boolean> {
        try {
            // 휴일 ID 체크 및 삭제
            const holiday = await this.holidayContextService.휴일_ID를_체크한다(holidayId);
            const isDeleted = await this.holidayContextService.관리자는_휴일을_삭제한다(holidayId);

            if (isDeleted) {
                // 일간/월간 이벤트 요약 업데이트
                await this.holidayContextService.일간_이벤트_요약에_공휴일이_변경된다(holiday.holidayDate);

                const year = parseInt(holiday.holidayDate.split('-')[0]);
                const month = parseInt(holiday.holidayDate.split('-')[1]);
                await this.holidayContextService.월간_이벤트_요약에_공휴일이_변경된다(year, month);
            }

            return isDeleted;
        } catch (error) {
            this.logger.error('휴일 삭제 실패', error);
            throw error;
        }
    }

    /**
     * 근무 유형 생성
     */
    async createAttendanceType(attendanceTypeData: Partial<AttendanceTypeEntity>): Promise<AttendanceTypeEntity> {
        try {
            return await this.attendanceTypeContextService.근무_유형을_생성한다(attendanceTypeData);
        } catch (error) {
            this.logger.error('근무 유형 생성 실패', error);
            throw error;
        }
    }

    /**
     * 근무 유형 업데이트
     */
    async updateAttendanceType(
        attendanceTypeId: string,
        updateData: Partial<AttendanceTypeEntity>,
    ): Promise<AttendanceTypeEntity> {
        try {
            return await this.attendanceTypeContextService.근무_유형을_업데이트한다(attendanceTypeId, updateData);
        } catch (error) {
            this.logger.error('근무 유형 업데이트 실패', error);
            throw error;
        }
    }

    /**
     * 근무 유형 삭제
     */
    async deleteAttendanceType(attendanceTypeId: string): Promise<boolean> {
        try {
            return await this.attendanceTypeContextService.근무_유형을_삭제한다(attendanceTypeId);
        } catch (error) {
            this.logger.error('근무 유형 삭제 실패', error);
            throw error;
        }
    }

    /**
     * 근무 유형 ID로 조회
     */
    async getAttendanceTypeById(attendanceTypeId: string): Promise<AttendanceTypeEntity | null> {
        try {
            return await this.attendanceTypeContextService.근무_유형_ID로_조회한다(attendanceTypeId);
        } catch (error) {
            this.logger.error('근무 유형 조회 실패', error);
            throw error;
        }
    }

    /**
     * 모든 근무 유형 조회
     */
    async getAllAttendanceTypes(): Promise<AttendanceTypeEntity[]> {
        try {
            return await this.attendanceTypeContextService.모든_근무_유형을_조회한다();
        } catch (error) {
            this.logger.error('모든 근무 유형 조회 실패', error);
            throw error;
        }
    }
}
