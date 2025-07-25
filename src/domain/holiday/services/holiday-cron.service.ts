import { Injectable, Logger } from '@nestjs/common';
import { HolidayDomainService } from './holiday-domain.service';

/**
 * 휴일 Cron 작업 도메인 서비스
 * - 정기적인 휴일 데이터 동기화 담당
 * - 매년 1월 1일 0시에 해당 연도 휴일 데이터 갱신
 */
@Injectable()
export class HolidayCronService {
    private readonly logger = new Logger(HolidayCronService.name);

    constructor(private readonly holidayDomainService: HolidayDomainService) {}

    /**
     * 현재 연도 휴일 동기화 작업 (매년 1월 1일 실행 예정)
     */
    async syncCurrentYearHolidays(): Promise<void> {
        const currentYear = new Date().getFullYear().toString();

        try {
            this.logger.log(`연간 휴일 동기화 작업 시작: ${currentYear}년`);

            const syncedHolidays = await this.holidayDomainService.syncHolidaysByYear(currentYear);

            this.logger.log(`연간 휴일 동기화 작업 완료: ${currentYear}년, ${syncedHolidays.length}개 휴일 동기화`);
        } catch (error) {
            this.logger.error(`연간 휴일 동기화 작업 실패: ${currentYear}년`, error.stack);
        }
    }

    /**
     * 수동으로 특정 연도의 휴일 동기화 실행
     */
    async manualSyncHolidays(year?: string): Promise<void> {
        const targetYear = year || new Date().getFullYear().toString();

        try {
            this.logger.log(`수동 휴일 동기화 작업 시작: ${targetYear}년`);

            const syncedHolidays = await this.holidayDomainService.syncHolidaysByYear(targetYear);

            this.logger.log(`수동 휴일 동기화 작업 완료: ${targetYear}년, ${syncedHolidays.length}개 휴일 동기화`);
        } catch (error) {
            this.logger.error(`수동 휴일 동기화 작업 실패: ${targetYear}년`, error.stack);
            throw error;
        }
    }

    /**
     * 다음 연도 휴일 미리 동기화 (12월에 실행 예정)
     */
    async syncNextYearHolidays(): Promise<void> {
        const nextYear = (new Date().getFullYear() + 1).toString();

        try {
            this.logger.log(`내년 휴일 미리 동기화 작업 시작: ${nextYear}년`);

            const syncedHolidays = await this.holidayDomainService.syncHolidaysByYear(nextYear);

            this.logger.log(`내년 휴일 미리 동기화 작업 완료: ${nextYear}년, ${syncedHolidays.length}개 휴일 동기화`);
        } catch (error) {
            this.logger.error(`내년 휴일 미리 동기화 작업 실패: ${nextYear}년`, error.stack);
        }
    }
}
