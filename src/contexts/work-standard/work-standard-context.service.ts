import { Injectable, Logger } from '@nestjs/common';
import { AttendanceTypeDomainService } from '../../domain/attendance-type/services/attendance-type-domain.service';
import { HolidayDomainService } from '../../domain/holiday/services/holiday-domain.service';
import { AttendanceTypeEntity } from '../../domain/attendance-type/entities/attendance-type.entity';
import { HolidayInfoEntity } from '../../domain/holiday/entities/holiday-info.entity';

/**
 * 근무 기준 Context 서비스
 * - 근무 유형과 공휴일 관련 비즈니스 로직을 통합 관리
 */
@Injectable()
export class WorkStandardContextService {
    private readonly logger = new Logger(WorkStandardContextService.name);

    constructor(
        private readonly attendanceTypeDomainService: AttendanceTypeDomainService,
        private readonly holidayDomainService: HolidayDomainService,
    ) {}

    // ==================== 근무 유형 관련 메서드 ====================

    /**
     * 페이지네이션된 근무 유형 목록 조회
     */
    async 페이지네이션된_근무_유형_목록_조회한다(
        limit: number,
        page: number,
    ): Promise<{
        attendanceTypes: AttendanceTypeEntity[];
        total: number;
        page: number;
        limit: number;
    }> {
        const { attendanceTypes, total } = await this.attendanceTypeDomainService.findAttendanceTypes(
            page,
            limit,
            undefined,
            { createdAt: 'DESC' },
        );

        this.logger.log(`근무 유형 목록 조회 완료: ${attendanceTypes.length}개 (페이지: ${page}, 제한: ${limit})`);

        return {
            attendanceTypes,
            total,
            page,
            limit,
        };
    }

    /**
     * 근무 유형 ID로 조회
     */
    async 근무_유형_ID로_조회한다(attendanceTypeId: string): Promise<AttendanceTypeEntity | null> {
        const attendanceType = await this.attendanceTypeDomainService.findAttendanceTypeById(attendanceTypeId);

        if (attendanceType) {
            this.logger.log(`근무 유형 조회 완료: ${attendanceType.title} (ID: ${attendanceTypeId})`);
        } else {
            this.logger.warn(`근무 유형을 찾을 수 없음: ${attendanceTypeId}`);
        }

        return attendanceType;
    }

    /**
     * 근무 유형을 생성한다
     */
    async 근무_유형을_생성한다(attendanceTypeData: Partial<AttendanceTypeEntity>): Promise<AttendanceTypeEntity> {
        const savedAttendanceType = await this.attendanceTypeDomainService.createAttendanceType(attendanceTypeData);

        this.logger.log(
            `근무 유형 생성 완료: ${savedAttendanceType.title} (ID: ${savedAttendanceType.attendanceTypeId})`,
        );

        return savedAttendanceType;
    }

    /**
     * 근무 유형을 업데이트한다
     */
    async 근무_유형을_업데이트한다(
        attendanceTypeId: string,
        updateData: Partial<AttendanceTypeEntity>,
    ): Promise<AttendanceTypeEntity> {
        const updatedAttendanceType = await this.attendanceTypeDomainService.updateAttendanceType(
            attendanceTypeId,
            updateData,
        );

        if (updatedAttendanceType) {
            this.logger.log(`근무 유형 업데이트 완료: ${updatedAttendanceType.title} (ID: ${attendanceTypeId})`);
        }

        return updatedAttendanceType;
    }

    /**
     * 근무 유형을 삭제한다
     */
    async 근무_유형을_삭제한다(attendanceTypeId: string): Promise<boolean> {
        const isDeleted = await this.attendanceTypeDomainService.deleteAttendanceType(attendanceTypeId);

        if (isDeleted) {
            this.logger.log(`근무 유형 삭제 완료: ${attendanceTypeId}`);
        } else {
            this.logger.warn(`삭제할 근무 유형을 찾을 수 없음: ${attendanceTypeId}`);
        }

        return isDeleted;
    }

    /**
     * 모든 근무 유형을 조회한다
     */
    async 모든_근무_유형을_조회한다(): Promise<AttendanceTypeEntity[]> {
        const attendanceTypes = await this.attendanceTypeDomainService.findAllAttendanceTypes();

        this.logger.log(`모든 근무 유형 조회 완료: ${attendanceTypes.length}개`);

        return attendanceTypes;
    }

    // ==================== 공휴일 관련 메서드 ====================

    /**
     * 페이지네이션된 연도별 휴일 목록 조회
     */
    async 페이지네이션된_연도별_휴일_목록_조회한다(
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
        const { holidays, total } = await this.holidayDomainService.findHolidaysByYear(year, page, limit, {
            holidayDate: 'ASC',
        });

        this.logger.log(`${year}년 휴일 목록 조회 완료: ${holidays.length}개 (페이지: ${page}, 제한: ${limit})`);

        return {
            holidays,
            total,
            page,
            limit,
            year,
        };
    }

    /**
     * 휴일 ID를 체크한다
     */
    async 휴일_ID를_체크한다(holidayId: string): Promise<HolidayInfoEntity> {
        const holiday = await this.holidayDomainService.findHolidayById(holidayId);

        if (!holiday) {
            throw new Error(`휴일을 찾을 수 없습니다: ${holidayId}`);
        }

        this.logger.log(`휴일 ID 체크 완료: ${holiday.holidayName} (ID: ${holidayId})`);

        return holiday;
    }

    /**
     * 관리자는 휴일을 생성한다
     */
    async 관리자는_휴일을_생성한다(date: string, holidayName: string): Promise<HolidayInfoEntity> {
        try {
            // 기존 휴일이 있는지 확인
            const existingHoliday = await this.holidayDomainService.findHolidayByDate(date);

            if (existingHoliday) {
                throw new Error(`해당 날짜에 이미 휴일이 존재합니다: ${date}`);
            }

            const savedHoliday = await this.holidayDomainService.createHoliday({
                holidayDate: date,
                holidayName,
            });

            this.logger.log(`휴일 생성 완료: ${savedHoliday.holidayName} (날짜: ${date})`);

            return savedHoliday;
        } catch (error) {
            this.logger.error(`휴일 생성 실패: ${date} - ${holidayName}`, error);
            throw error;
        }
    }

    /**
     * 관리자는 휴일을 업데이트한다
     */
    async 관리자는_휴일을_업데이트한다(
        holidayId: string,
        date: string,
        holidayName: string,
    ): Promise<HolidayInfoEntity> {
        try {
            // 휴일 존재 확인
            await this.휴일_ID를_체크한다(holidayId);

            // 다른 날짜로 변경하는 경우, 해당 날짜에 이미 휴일이 있는지 확인
            const existingHoliday = await this.holidayDomainService.findHolidayByDate(date);

            if (existingHoliday && existingHoliday.holidayId !== holidayId) {
                throw new Error(`해당 날짜에 이미 휴일이 존재합니다: ${date}`);
            }

            const updatedHoliday = await this.holidayDomainService.updateHoliday(holidayId, {
                holidayDate: date,
                holidayName,
            });

            this.logger.log(`휴일 업데이트 완료: ${updatedHoliday.holidayName} (날짜: ${date})`);

            return updatedHoliday;
        } catch (error) {
            this.logger.error(`휴일 업데이트 실패: ${holidayId} - ${date} - ${holidayName}`, error);
            throw error;
        }
    }

    /**
     * 관리자는 휴일을 삭제한다
     */
    async 관리자는_휴일을_삭제한다(holidayId: string): Promise<boolean> {
        try {
            // 휴일 존재 확인
            const holiday = await this.휴일_ID를_체크한다(holidayId);

            const isDeleted = await this.holidayDomainService.deleteHoliday(holidayId);

            if (isDeleted) {
                this.logger.log(`휴일 삭제 완료: ${holiday.holidayName} (날짜: ${holiday.holidayDate})`);
            }

            return isDeleted;
        } catch (error) {
            this.logger.error(`휴일 삭제 실패: ${holidayId}`, error);
            throw error;
        }
    }

    // ==================== 통합 관리 메서드 ====================

    /**
     * 일간 이벤트 요약에 공휴일이 변경된다
     */
    async 일간_이벤트_요약에_공휴일이_변경된다(date: string): Promise<void> {
        // TODO: 일간 이벤트 요약 업데이트 로직 구현
        this.logger.log(`일간 이벤트 요약 업데이트 예정: ${date}`);
    }

    /**
     * 월간 이벤트 요약에 공휴일이 변경된다
     */
    async 월간_이벤트_요약에_공휴일이_변경된다(year: number, month: number): Promise<void> {
        // TODO: 월간 이벤트 요약 업데이트 로직 구현
        this.logger.log(`월간 이벤트 요약 업데이트 예정: ${year}-${month}`);
    }

    /**
     * SEED 데이터 초기화 설정한다
     */
    async SEED_데이터_초기화_설정한다(): Promise<void> {
        // TODO: SEED 데이터 초기화 로직 구현
        this.logger.log('SEED 데이터 초기화 설정 완료');
    }
}
