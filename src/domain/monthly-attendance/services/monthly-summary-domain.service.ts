import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { MonthlyEmployeeAttendanceInfoEntity } from '../entities/monthly-event-summary.entity';

/**
 * Monthly-Summary 도메인 서비스
 * - 월별 출근 요약 정보 관련 도메인 로직
 */
@Injectable()
export class MonthlySummaryDomainService {
    private readonly logger = new Logger(MonthlySummaryDomainService.name);

    constructor(
        @InjectRepository(MonthlyEmployeeAttendanceInfoEntity)
        private readonly monthlySummaryRepository: Repository<MonthlyEmployeeAttendanceInfoEntity>,
    ) {}

    /**
     * 월별 요약을 ID로 조회한다
     */
    async findMonthlySummaryById(monthlyEventSummaryId: string): Promise<MonthlyEmployeeAttendanceInfoEntity | null> {
        try {
            const summary = await this.monthlySummaryRepository.findOne({
                where: { monthlyEventSummaryId },
            });

            if (summary) {
                this.logger.log(`월별 요약 조회 완료: ${monthlyEventSummaryId}`);
            }

            return summary;
        } catch (error) {
            this.logger.error(`월별 요약 조회 실패: ${monthlyEventSummaryId}`, error);
            throw error;
        }
    }

    /**
     * 직원별 월별 요약을 조회한다
     */
    async findMonthlySummaryByEmployeeAndMonth(
        employeeId: string,
        yyyymm: string,
    ): Promise<MonthlyEmployeeAttendanceInfoEntity | null> {
        try {
            const summary = await this.monthlySummaryRepository.findOne({
                where: {
                    employeeId,
                    yyyymm,
                },
            });

            if (summary) {
                this.logger.log(`직원별 월별 요약 조회 완료: ${employeeId} (${yyyymm})`);
            }

            return summary;
        } catch (error) {
            this.logger.error(`직원별 월별 요약 조회 실패: ${employeeId} (${yyyymm})`, error);
            throw error;
        }
    }

    /**
     * 직원번호로 월별 요약을 조회한다
     */
    async findMonthlySummaryByEmployeeNumberAndMonth(
        employeeNumber: string,
        yyyymm: string,
    ): Promise<MonthlyEmployeeAttendanceInfoEntity | null> {
        try {
            const summary = await this.monthlySummaryRepository.findOne({
                where: {
                    employeeNumber,
                    yyyymm,
                },
            });

            if (summary) {
                this.logger.log(`직원번호별 월별 요약 조회 완료: ${employeeNumber} (${yyyymm})`);
            }

            return summary;
        } catch (error) {
            this.logger.error(`직원번호별 월별 요약 조회 실패: ${employeeNumber} (${yyyymm})`, error);
            throw error;
        }
    }

    /**
     * 월별 모든 직원 요약을 조회한다
     */
    async findMonthlySummariesByMonth(yyyymm: string): Promise<MonthlyEmployeeAttendanceInfoEntity[]> {
        try {
            const summaries = await this.monthlySummaryRepository.find({
                where: { yyyymm },
                order: { employeeNumber: 'ASC' },
            });

            this.logger.log(`월별 모든 직원 요약 조회 완료: ${yyyymm} (${summaries.length}개)`);

            return summaries;
        } catch (error) {
            this.logger.error(`월별 모든 직원 요약 조회 실패: ${yyyymm}`, error);
            throw error;
        }
    }

    /**
     * 직원별 연도 요약 목록을 조회한다
     */
    async findMonthlySummariesByEmployeeAndYear(
        employeeId: string,
        year: string,
    ): Promise<MonthlyEmployeeAttendanceInfoEntity[]> {
        try {
            const summaries = await this.monthlySummaryRepository
                .createQueryBuilder('summary')
                .where('summary.employeeId = :employeeId', { employeeId })
                .andWhere('summary.yyyymm LIKE :year', { year: `${year}%` })
                .orderBy('summary.yyyymm', 'ASC')
                .getMany();

            this.logger.log(`직원별 연도 요약 조회 완료: ${employeeId} (${year}) - ${summaries.length}개`);

            return summaries;
        } catch (error) {
            this.logger.error(`직원별 연도 요약 조회 실패: ${employeeId} (${year})`, error);
            throw error;
        }
    }

    /**
     * 여러 직원의 월별 요약을 조회한다
     */
    async findMonthlySummariesByEmployeesAndMonth(
        employeeIds: string[],
        yyyymm: string,
    ): Promise<MonthlyEmployeeAttendanceInfoEntity[]> {
        try {
            const summaries = await this.monthlySummaryRepository
                .createQueryBuilder('summary')
                .where('summary.employeeId IN (:...employeeIds)', { employeeIds })
                .andWhere('summary.yyyymm = :yyyymm', { yyyymm })
                .orderBy('summary.employeeNumber', 'ASC')
                .getMany();

            this.logger.log(`여러 직원 월별 요약 조회 완료: ${yyyymm} (${summaries.length}개)`);

            return summaries;
        } catch (error) {
            this.logger.error(`여러 직원 월별 요약 조회 실패: ${yyyymm}`, error);
            throw error;
        }
    }

    /**
     * 월별 요약을 생성한다
     */
    async createMonthlySummary(
        summaryData: Partial<MonthlyEmployeeAttendanceInfoEntity>,
    ): Promise<MonthlyEmployeeAttendanceInfoEntity> {
        try {
            const newSummary = this.monthlySummaryRepository.create(summaryData);
            const savedSummary = await this.monthlySummaryRepository.save(newSummary);

            this.logger.log(`월별 요약 생성 완료: ${savedSummary.monthlyEventSummaryId}`);

            return savedSummary;
        } catch (error) {
            this.logger.error('월별 요약 생성 실패', error);
            throw error;
        }
    }

    /**
     * 여러 월별 요약을 일괄 생성한다
     */
    async createMonthlySummaries(
        summariesData: Partial<MonthlyEmployeeAttendanceInfoEntity>[],
    ): Promise<MonthlyEmployeeAttendanceInfoEntity[]> {
        try {
            const newSummaries = this.monthlySummaryRepository.create(summariesData);
            const savedSummaries = await this.monthlySummaryRepository.save(newSummaries);

            this.logger.log(`월별 요약 일괄 생성 완료: ${savedSummaries.length}개`);

            return savedSummaries;
        } catch (error) {
            this.logger.error('월별 요약 일괄 생성 실패', error);
            throw error;
        }
    }

    /**
     * 월별 요약을 업데이트한다
     */
    async updateMonthlySummary(
        monthlyEventSummaryId: string,
        updateData: Partial<MonthlyEmployeeAttendanceInfoEntity>,
    ): Promise<MonthlyEmployeeAttendanceInfoEntity> {
        try {
            await this.monthlySummaryRepository.update(monthlyEventSummaryId, updateData);
            const updatedSummary = await this.findMonthlySummaryById(monthlyEventSummaryId);

            if (!updatedSummary) {
                throw new Error(`업데이트된 월별 요약을 찾을 수 없습니다: ${monthlyEventSummaryId}`);
            }

            this.logger.log(`월별 요약 업데이트 완료: ${monthlyEventSummaryId}`);

            return updatedSummary;
        } catch (error) {
            this.logger.error(`월별 요약 업데이트 실패: ${monthlyEventSummaryId}`, error);
            throw error;
        }
    }

    /**
     * 월별 요약을 삭제한다
     */
    async deleteMonthlySummary(monthlyEventSummaryId: string): Promise<boolean> {
        try {
            const result = await this.monthlySummaryRepository.delete(monthlyEventSummaryId);
            const isDeleted = result.affected > 0;

            if (isDeleted) {
                this.logger.log(`월별 요약 삭제 완료: ${monthlyEventSummaryId}`);
            }

            return isDeleted;
        } catch (error) {
            this.logger.error(`월별 요약 삭제 실패: ${monthlyEventSummaryId}`, error);
            throw error;
        }
    }

    /**
     * 직원별 월별 요약을 삭제한다
     */
    async deleteMonthlySummaryByEmployeeAndMonth(employeeId: string, yyyymm: string): Promise<boolean> {
        try {
            const result = await this.monthlySummaryRepository.delete({
                employeeId,
                yyyymm,
            });

            const isDeleted = result.affected > 0;

            if (isDeleted) {
                this.logger.log(`직원별 월별 요약 삭제 완료: ${employeeId} (${yyyymm})`);
            }

            return isDeleted;
        } catch (error) {
            this.logger.error(`직원별 월별 요약 삭제 실패: ${employeeId} (${yyyymm})`, error);
            throw error;
        }
    }

    /**
     * 월별 요약을 엔티티 메서드로 업데이트한다
     */
    async updateMonthlySummaryWithData(
        monthlyEventSummaryId: string,
        updateParams: {
            employeeInfo: { employeeNumber: string; employeeId: string; employeeName: string };
            yyyymm: string;
            totalWorkableTime: number;
            totalWorkTime: number;
            workDaysCount: number;
            avgWorkTimes: number;
            attendanceTypeCount: Record<string, number>;
            weeklyWorkTimeSummary: any[];
            dailyEventSummary: any[];
            lateDetails: any[];
            absenceDetails: any[];
            earlyLeaveDetails: any[];
            note: string;
        },
    ): Promise<MonthlyEmployeeAttendanceInfoEntity> {
        try {
            const summary = await this.findMonthlySummaryById(monthlyEventSummaryId);
            if (!summary) {
                throw new Error(`월별 요약을 찾을 수 없습니다: ${monthlyEventSummaryId}`);
            }

            summary.updateSummary(updateParams);
            const updatedSummary = await this.monthlySummaryRepository.save(summary);

            this.logger.log(`월별 요약 데이터 업데이트 완료: ${monthlyEventSummaryId}`);

            return updatedSummary;
        } catch (error) {
            this.logger.error(`월별 요약 데이터 업데이트 실패: ${monthlyEventSummaryId}`, error);
            throw error;
        }
    }

    /**
     * 월별 요약을 생성하거나 업데이트한다
     */
    async createOrUpdateMonthlySummary(
        employeeId: string,
        yyyymm: string,
        summaryData: Partial<MonthlyEmployeeAttendanceInfoEntity>,
    ): Promise<MonthlyEmployeeAttendanceInfoEntity> {
        try {
            const existingSummary = await this.findMonthlySummaryByEmployeeAndMonth(employeeId, yyyymm);

            if (existingSummary) {
                // 업데이트
                const updatedSummary = await this.updateMonthlySummary(
                    existingSummary.monthlyEventSummaryId,
                    summaryData,
                );
                this.logger.log(`월별 요약 업데이트 완료: ${employeeId} (${yyyymm})`);
                return updatedSummary;
            } else {
                // 생성
                const createdSummary = await this.createMonthlySummary({
                    ...summaryData,
                    employeeId,
                    yyyymm,
                });
                this.logger.log(`월별 요약 생성 완료: ${employeeId} (${yyyymm})`);
                return createdSummary;
            }
        } catch (error) {
            this.logger.error(`월별 요약 생성/업데이트 실패: ${employeeId} (${yyyymm})`, error);
            throw error;
        }
    }

    /**
     * 월별 근무 시간 통계를 조회한다
     */
    async getMonthlyWorkTimeStats(yyyymm: string): Promise<{
        totalEmployees: number;
        totalWorkTime: number;
        averageWorkTime: number;
        maxWorkTime: number;
        minWorkTime: number;
        workTimeDistribution: {
            range: string;
            count: number;
        }[];
    }> {
        try {
            const summaries = await this.findMonthlySummariesByMonth(yyyymm);

            if (summaries.length === 0) {
                return {
                    totalEmployees: 0,
                    totalWorkTime: 0,
                    averageWorkTime: 0,
                    maxWorkTime: 0,
                    minWorkTime: 0,
                    workTimeDistribution: [],
                };
            }

            const workTimes = summaries.map((s) => s.totalWorkTime);
            const totalWorkTime = workTimes.reduce((sum, time) => sum + time, 0);
            const averageWorkTime = Math.round(totalWorkTime / workTimes.length);
            const maxWorkTime = Math.max(...workTimes);
            const minWorkTime = Math.min(...workTimes);

            // 근무 시간 분포 (시간 단위로 변환)
            const workTimeDistribution = [
                { range: '0-40시간', count: 0 },
                { range: '40-80시간', count: 0 },
                { range: '80-120시간', count: 0 },
                { range: '120-160시간', count: 0 },
                { range: '160시간 이상', count: 0 },
            ];

            workTimes.forEach((time) => {
                const hours = Math.floor(time / 60);
                if (hours < 40) workTimeDistribution[0].count++;
                else if (hours < 80) workTimeDistribution[1].count++;
                else if (hours < 120) workTimeDistribution[2].count++;
                else if (hours < 160) workTimeDistribution[3].count++;
                else workTimeDistribution[4].count++;
            });

            const stats = {
                totalEmployees: summaries.length,
                totalWorkTime,
                averageWorkTime,
                maxWorkTime,
                minWorkTime,
                workTimeDistribution,
            };

            this.logger.log(`월별 근무 시간 통계 조회 완료: ${yyyymm} (${stats.totalEmployees}명)`);

            return stats;
        } catch (error) {
            this.logger.error(`월별 근무 시간 통계 조회 실패: ${yyyymm}`, error);
            throw error;
        }
    }

    /**
     * 월별 근태 유형 통계를 조회한다
     */
    async getMonthlyAttendanceTypeStats(yyyymm: string): Promise<{
        totalAttendanceTypes: Record<string, number>;
        employeeAttendanceTypes: Array<{
            employeeId: string;
            employeeNumber: string;
            employeeName: string;
            attendanceTypeCount: Record<string, number>;
        }>;
    }> {
        try {
            const summaries = await this.findMonthlySummariesByMonth(yyyymm);

            const totalAttendanceTypes: Record<string, number> = {};
            const employeeAttendanceTypes = summaries.map((summary) => {
                // 전체 통계에 합산
                Object.entries(summary.attendanceTypeCount).forEach(([type, count]) => {
                    totalAttendanceTypes[type] = (totalAttendanceTypes[type] || 0) + count;
                });

                return {
                    employeeId: summary.employeeId,
                    employeeNumber: summary.employeeNumber,
                    employeeName: summary.employeeName,
                    attendanceTypeCount: summary.attendanceTypeCount,
                };
            });

            const stats = {
                totalAttendanceTypes,
                employeeAttendanceTypes,
            };

            this.logger.log(`월별 근태 유형 통계 조회 완료: ${yyyymm}`);

            return stats;
        } catch (error) {
            this.logger.error(`월별 근태 유형 통계 조회 실패: ${yyyymm}`, error);
            throw error;
        }
    }

    /**
     * 비고를 업데이트한다
     */
    async updateMonthlySummaryNote(
        monthlyEventSummaryId: string,
        note: string,
        additionalNote?: string,
    ): Promise<MonthlyEmployeeAttendanceInfoEntity> {
        try {
            const updateData: Partial<MonthlyEmployeeAttendanceInfoEntity> = { note };
            if (additionalNote !== undefined) {
                updateData.additionalNote = additionalNote;
            }

            const updatedSummary = await this.updateMonthlySummary(monthlyEventSummaryId, updateData);

            this.logger.log(`월별 요약 비고 업데이트 완료: ${monthlyEventSummaryId}`);

            return updatedSummary;
        } catch (error) {
            this.logger.error(`월별 요약 비고 업데이트 실패: ${monthlyEventSummaryId}`, error);
            throw error;
        }
    }
}
