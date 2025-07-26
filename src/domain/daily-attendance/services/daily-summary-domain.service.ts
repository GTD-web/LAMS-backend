import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between, In } from 'typeorm';
import { DailyEventSummaryEntity } from '../entities/daily-event-summary.entity';

/**
 * Daily-Summary 도메인 서비스
 * - 일별 출근 요약 정보 관련 도메인 로직
 */
@Injectable()
export class DailySummaryDomainService {
    private readonly logger = new Logger(DailySummaryDomainService.name);

    constructor(
        @InjectRepository(DailyEventSummaryEntity)
        private readonly dailySummaryRepository: Repository<DailyEventSummaryEntity>,
    ) {}

    /**
     * 일별 요약을 ID로 조회한다
     */
    async findDailySummaryById(dailyEventSummaryId: string): Promise<DailyEventSummaryEntity | null> {
        try {
            const summary = await this.dailySummaryRepository.findOne({
                where: { dailyEventSummaryId },
                relations: ['employee'],
            });

            if (summary) {
                this.logger.log(`일별 요약 조회 완료: ${dailyEventSummaryId}`);
            }

            return summary;
        } catch (error) {
            this.logger.error(`일별 요약 조회 실패: ${dailyEventSummaryId}`, error);
            throw error;
        }
    }

    /**
     * 직원별 일별 요약을 조회한다
     */
    async findDailySummaryByEmployeeAndDate(employeeId: string, date: string): Promise<DailyEventSummaryEntity | null> {
        try {
            const summary = await this.dailySummaryRepository.findOne({
                where: {
                    employee: { employeeId },
                    date,
                },
                relations: ['employee'],
            });

            if (summary) {
                this.logger.log(`직원별 일별 요약 조회 완료: ${employeeId} (${date})`);
            }

            return summary;
        } catch (error) {
            this.logger.error(`직원별 일별 요약 조회 실패: ${employeeId} (${date})`, error);
            throw error;
        }
    }

    /**
     * 직원별 기간 요약 목록을 조회한다
     */
    async findDailySummariesByEmployeeAndDateRange(
        employeeId: string,
        startDate: string,
        endDate: string,
    ): Promise<DailyEventSummaryEntity[]> {
        try {
            const summaries = await this.dailySummaryRepository.find({
                where: {
                    employee: { employeeId },
                    date: Between(startDate, endDate),
                },
                relations: ['employee'],
                order: { date: 'ASC' },
            });

            this.logger.log(`직원별 기간 요약 조회 완료: ${employeeId} (${summaries.length}개)`);

            return summaries;
        } catch (error) {
            this.logger.error(`직원별 기간 요약 조회 실패: ${employeeId}`, error);
            throw error;
        }
    }

    /**
     * 날짜별 모든 직원 요약을 조회한다
     */
    async findDailySummariesByDate(date: string): Promise<DailyEventSummaryEntity[]> {
        try {
            const summaries = await this.dailySummaryRepository.find({
                where: { date },
                relations: ['employee'],
                order: { employee: { employeeNumber: 'ASC' } },
            });

            this.logger.log(`날짜별 모든 직원 요약 조회 완료: ${date} (${summaries.length}개)`);

            return summaries;
        } catch (error) {
            this.logger.error(`날짜별 모든 직원 요약 조회 실패: ${date}`, error);
            throw error;
        }
    }

    /**
     * 기간별 요약 목록을 조회한다
     */
    async findDailySummariesByDateRange(
        startDate: string,
        endDate: string,
        employeeIds?: string[],
    ): Promise<DailyEventSummaryEntity[]> {
        try {
            const where: FindOptionsWhere<DailyEventSummaryEntity> = {
                date: Between(startDate, endDate),
            };

            if (employeeIds && employeeIds.length > 0) {
                where.employee = { employeeId: In(employeeIds) };
            }

            const summaries = await this.dailySummaryRepository.find({
                where,
                relations: ['employee'],
                order: { date: 'ASC', employee: { employeeNumber: 'ASC' } },
            });

            this.logger.log(`기간별 요약 조회 완료: ${startDate}~${endDate} (${summaries.length}개)`);

            return summaries;
        } catch (error) {
            this.logger.error(`기간별 요약 조회 실패: ${startDate}~${endDate}`, error);
            throw error;
        }
    }

    /**
     * 일별 요약을 생성한다
     */
    async createDailySummary(summaryData: Partial<DailyEventSummaryEntity>): Promise<DailyEventSummaryEntity> {
        try {
            const newSummary = this.dailySummaryRepository.create(summaryData);
            const savedSummary = await this.dailySummaryRepository.save(newSummary);

            this.logger.log(`일별 요약 생성 완료: ${savedSummary.dailyEventSummaryId}`);

            return savedSummary;
        } catch (error) {
            this.logger.error('일별 요약 생성 실패', error);
            throw error;
        }
    }

    /**
     * 여러 일별 요약을 일괄 생성한다
     */
    async createDailySummaries(summariesData: Partial<DailyEventSummaryEntity>[]): Promise<DailyEventSummaryEntity[]> {
        try {
            const newSummaries = this.dailySummaryRepository.create(summariesData);
            const savedSummaries = await this.dailySummaryRepository.save(newSummaries);

            this.logger.log(`일별 요약 일괄 생성 완료: ${savedSummaries.length}개`);

            return savedSummaries;
        } catch (error) {
            this.logger.error('일별 요약 일괄 생성 실패', error);
            throw error;
        }
    }

    /**
     * 일별 요약을 업데이트한다
     */
    async updateDailySummary(
        dailyEventSummaryId: string,
        updateData: Partial<DailyEventSummaryEntity>,
    ): Promise<DailyEventSummaryEntity> {
        try {
            await this.dailySummaryRepository.update(dailyEventSummaryId, updateData);
            const updatedSummary = await this.findDailySummaryById(dailyEventSummaryId);

            if (!updatedSummary) {
                throw new Error(`업데이트된 일별 요약을 찾을 수 없습니다: ${dailyEventSummaryId}`);
            }

            this.logger.log(`일별 요약 업데이트 완료: ${dailyEventSummaryId}`);

            return updatedSummary;
        } catch (error) {
            this.logger.error(`일별 요약 업데이트 실패: ${dailyEventSummaryId}`, error);
            throw error;
        }
    }

    /**
     * 일별 요약을 삭제한다
     */
    async deleteDailySummary(dailyEventSummaryId: string): Promise<boolean> {
        try {
            const result = await this.dailySummaryRepository.delete(dailyEventSummaryId);
            const isDeleted = result.affected > 0;

            if (isDeleted) {
                this.logger.log(`일별 요약 삭제 완료: ${dailyEventSummaryId}`);
            }

            return isDeleted;
        } catch (error) {
            this.logger.error(`일별 요약 삭제 실패: ${dailyEventSummaryId}`, error);
            throw error;
        }
    }

    /**
     * 직원별 기간 요약을 삭제한다
     */
    async deleteDailySummariesByEmployeeAndDateRange(
        employeeId: string,
        startDate: string,
        endDate: string,
    ): Promise<number> {
        try {
            const result = await this.dailySummaryRepository
                .createQueryBuilder()
                .delete()
                .where('employee.employeeId = :employeeId', { employeeId })
                .andWhere('date BETWEEN :startDate AND :endDate', { startDate, endDate })
                .execute();

            const deletedCount = result.affected || 0;
            this.logger.log(`직원별 기간 요약 삭제 완료: ${employeeId} (${deletedCount}개)`);

            return deletedCount;
        } catch (error) {
            this.logger.error(`직원별 기간 요약 삭제 실패: ${employeeId}`, error);
            throw error;
        }
    }

    /**
     * 출근 시간으로 일별 요약을 업데이트한다
     */
    async updateDailySummaryWithEventTimes(
        dailyEventSummaryId: string,
        enterTime: string,
        leaveTime: string,
    ): Promise<DailyEventSummaryEntity> {
        try {
            const summary = await this.findDailySummaryById(dailyEventSummaryId);
            if (!summary) {
                throw new Error(`일별 요약을 찾을 수 없습니다: ${dailyEventSummaryId}`);
            }

            // 이벤트 시간 입력 (엔티티의 메서드 사용)
            summary.inputEventTime(enterTime, leaveTime);

            const updatedSummary = await this.dailySummaryRepository.save(summary);

            this.logger.log(`일별 요약 이벤트 시간 업데이트 완료: ${dailyEventSummaryId}`);

            return updatedSummary;
        } catch (error) {
            this.logger.error(`일별 요약 이벤트 시간 업데이트 실패: ${dailyEventSummaryId}`, error);
            throw error;
        }
    }

    /**
     * 일별 요약의 비고를 업데이트한다
     */
    async updateDailySummaryNote(dailyEventSummaryId: string, note: string): Promise<DailyEventSummaryEntity> {
        try {
            const summary = await this.findDailySummaryById(dailyEventSummaryId);
            if (!summary) {
                throw new Error(`일별 요약을 찾을 수 없습니다: ${dailyEventSummaryId}`);
            }

            summary.updateNote(note);
            const updatedSummary = await this.dailySummaryRepository.save(summary);

            this.logger.log(`일별 요약 비고 업데이트 완료: ${dailyEventSummaryId}`);

            return updatedSummary;
        } catch (error) {
            this.logger.error(`일별 요약 비고 업데이트 실패: ${dailyEventSummaryId}`, error);
            throw error;
        }
    }

    /**
     * 월별 출근 통계를 조회한다
     */
    async getMonthlyAttendanceStats(
        year: string,
        month: string,
        employeeIds?: string[],
    ): Promise<{
        totalWorkDays: number;
        totalWorkTime: number;
        averageWorkTime: number;
        lateCount: number;
        earlyLeaveCount: number;
        absentCount: number;
        employeeStats: Array<{
            employeeId: string;
            employeeNumber: string;
            employeeName: string;
            workDays: number;
            totalWorkTime: number;
            averageWorkTime: number;
            lateCount: number;
            earlyLeaveCount: number;
            absentCount: number;
        }>;
    }> {
        try {
            const startDate = `${year}-${month.padStart(2, '0')}-01`;
            const endDate = `${year}-${month.padStart(2, '0')}-31`;

            const summaries = await this.findDailySummariesByDateRange(startDate, endDate, employeeIds);

            let totalWorkDays = 0;
            let totalWorkTime = 0;
            let lateCount = 0;
            let earlyLeaveCount = 0;
            let absentCount = 0;

            const employeeStatsMap = new Map<
                string,
                {
                    employeeId: string;
                    employeeNumber: string;
                    employeeName: string;
                    workDays: number;
                    totalWorkTime: number;
                    lateCount: number;
                    earlyLeaveCount: number;
                    absentCount: number;
                }
            >();

            summaries.forEach((summary) => {
                if (!summary.isHoliday) {
                    totalWorkDays++;
                    totalWorkTime += summary.workTime || 0;

                    if (summary.isLate) lateCount++;
                    if (summary.isEarlyLeave) earlyLeaveCount++;
                    if (summary.isAbsent) absentCount++;

                    // 직원별 통계
                    const key = summary.employee.employeeId;
                    if (!employeeStatsMap.has(key)) {
                        employeeStatsMap.set(key, {
                            employeeId: summary.employee.employeeId,
                            employeeNumber: summary.employee.employeeNumber,
                            employeeName: summary.employee.employeeName,
                            workDays: 0,
                            totalWorkTime: 0,
                            lateCount: 0,
                            earlyLeaveCount: 0,
                            absentCount: 0,
                        });
                    }

                    const employeeStat = employeeStatsMap.get(key)!;
                    employeeStat.workDays++;
                    employeeStat.totalWorkTime += summary.workTime || 0;
                    if (summary.isLate) employeeStat.lateCount++;
                    if (summary.isEarlyLeave) employeeStat.earlyLeaveCount++;
                    if (summary.isAbsent) employeeStat.absentCount++;
                }
            });

            const employeeStats = Array.from(employeeStatsMap.values()).map((stat) => ({
                ...stat,
                averageWorkTime: stat.workDays > 0 ? Math.round(stat.totalWorkTime / stat.workDays) : 0,
            }));

            const stats = {
                totalWorkDays,
                totalWorkTime,
                averageWorkTime: totalWorkDays > 0 ? Math.round(totalWorkTime / totalWorkDays) : 0,
                lateCount,
                earlyLeaveCount,
                absentCount,
                employeeStats,
            };

            this.logger.log(`월별 출근 통계 조회 완료: ${year}-${month} (${totalWorkDays}일)`);

            return stats;
        } catch (error) {
            this.logger.error(`월별 출근 통계 조회 실패: ${year}-${month}`, error);
            throw error;
        }
    }

    /**
     * 휴일 여부를 업데이트한다
     */
    async updateHolidayStatus(dates: string[], isHoliday: boolean): Promise<number> {
        try {
            const result = await this.dailySummaryRepository
                .createQueryBuilder()
                .update()
                .set({ isHoliday })
                .where('date IN (:...dates)', { dates })
                .execute();

            const updatedCount = result.affected || 0;
            this.logger.log(`휴일 상태 업데이트 완료: ${updatedCount}개 (${isHoliday ? '휴일' : '평일'})`);

            return updatedCount;
        } catch (error) {
            this.logger.error('휴일 상태 업데이트 실패', error);
            throw error;
        }
    }
}
