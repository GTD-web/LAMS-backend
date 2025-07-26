import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventInfoEntity } from '../entities/event-info.entity';

/**
 * Event-Info Context 서비스
 * - 비즈니스 로직에서 사용하는 Context 메서드들
 */
@Injectable()
export class EventInfoContextService {
    private readonly logger = new Logger(EventInfoContextService.name);

    constructor(
        @InjectRepository(EventInfoEntity)
        private readonly eventInfoRepository: Repository<EventInfoEntity>,
    ) {}

    /**
     * 엑셀에서_추출한_이벤트_데이터를_저장한다
     */
    async 엑셀에서_추출한_이벤트_데이터를_저장한다(eventsData: Partial<EventInfoEntity>[]): Promise<EventInfoEntity[]> {
        try {
            const newEvents = this.eventInfoRepository.create(eventsData);
            const savedEvents = await this.eventInfoRepository.save(newEvents);

            this.logger.log(`엑셀 이벤트 데이터 저장 완료: ${savedEvents.length}개`);

            return savedEvents;
        } catch (error) {
            this.logger.error('엑셀 이벤트 데이터 저장 실패', error);
            throw error;
        }
    }

    /**
     * 직원별_기간_이벤트_데이터를_조회한다
     */
    async 직원별_기간_이벤트_데이터를_조회한다(
        employeeNumber: string,
        startDate: string,
        endDate: string,
    ): Promise<EventInfoEntity[]> {
        try {
            const events = await this.eventInfoRepository
                .createQueryBuilder('event')
                .where('event.employeeNumber = :employeeNumber', { employeeNumber })
                .andWhere('event.yyyymmdd BETWEEN :startDate AND :endDate', { startDate, endDate })
                .orderBy('event.yyyymmdd', 'ASC')
                .addOrderBy('event.hhmmss', 'ASC')
                .getMany();

            this.logger.log(`직원별 기간 이벤트 조회 완료: ${employeeNumber} (${events.length}개)`);

            return events;
        } catch (error) {
            this.logger.error(`직원별 기간 이벤트 조회 실패: ${employeeNumber}`, error);
            throw error;
        }
    }

    /**
     * 일별_출입_이벤트를_요약한다
     */
    async 일별_출입_이벤트를_요약한다(
        employeeNumber: string,
        date: string,
    ): Promise<{
        firstEvent: EventInfoEntity | null;
        lastEvent: EventInfoEntity | null;
        totalEvents: number;
        events: EventInfoEntity[];
    }> {
        try {
            const events = await this.eventInfoRepository.find({
                where: {
                    employeeNumber,
                    yyyymmdd: date,
                },
                order: { hhmmss: 'ASC' },
            });

            const firstEvent = events.length > 0 ? events[0] : null;
            const lastEvent = events.length > 0 ? events[events.length - 1] : null;

            const summary = {
                firstEvent,
                lastEvent,
                totalEvents: events.length,
                events,
            };

            this.logger.log(`일별 출입 이벤트 요약 완료: ${employeeNumber} (${date}) - ${events.length}개`);

            return summary;
        } catch (error) {
            this.logger.error(`일별 출입 이벤트 요약 실패: ${employeeNumber} (${date})`, error);
            throw error;
        }
    }

    /**
     * 월별_직원_이벤트_통계를_생성한다
     */
    async 월별_직원_이벤트_통계를_생성한다(
        year: string,
        month: string,
        employeeNumbers?: string[],
    ): Promise<{
        totalEvents: number;
        employeeStats: Array<{
            employeeNumber: string;
            employeeName: string;
            eventCount: number;
            firstEventDate: string | null;
            lastEventDate: string | null;
        }>;
        dailyStats: Record<string, number>;
    }> {
        try {
            const startDate = `${year}${month.padStart(2, '0')}01`;
            const endDate = `${year}${month.padStart(2, '0')}31`;

            const queryBuilder = this.eventInfoRepository
                .createQueryBuilder('event')
                .where('event.yyyymmdd BETWEEN :startDate AND :endDate', { startDate, endDate });

            if (employeeNumbers && employeeNumbers.length > 0) {
                queryBuilder.andWhere('event.employeeNumber IN (:...employeeNumbers)', { employeeNumbers });
            }

            const events = await queryBuilder.getMany();

            // 직원별 통계
            const employeeStatsMap = new Map<
                string,
                {
                    employeeNumber: string;
                    employeeName: string;
                    eventCount: number;
                    firstEventDate: string | null;
                    lastEventDate: string | null;
                }
            >();

            // 일별 통계
            const dailyStats: Record<string, number> = {};

            events.forEach((event) => {
                // 직원별 통계 업데이트
                const key = event.employeeNumber;
                if (!employeeStatsMap.has(key)) {
                    employeeStatsMap.set(key, {
                        employeeNumber: event.employeeNumber,
                        employeeName: event.employeeName,
                        eventCount: 0,
                        firstEventDate: null,
                        lastEventDate: null,
                    });
                }

                const employeeStat = employeeStatsMap.get(key)!;
                employeeStat.eventCount++;

                if (!employeeStat.firstEventDate || event.yyyymmdd < employeeStat.firstEventDate) {
                    employeeStat.firstEventDate = event.yyyymmdd;
                }

                if (!employeeStat.lastEventDate || event.yyyymmdd > employeeStat.lastEventDate) {
                    employeeStat.lastEventDate = event.yyyymmdd;
                }

                // 일별 통계 업데이트
                dailyStats[event.yyyymmdd] = (dailyStats[event.yyyymmdd] || 0) + 1;
            });

            const stats = {
                totalEvents: events.length,
                employeeStats: Array.from(employeeStatsMap.values()),
                dailyStats,
            };

            this.logger.log(`월별 직원 이벤트 통계 생성 완료: ${year}-${month} (총 ${stats.totalEvents}개)`);

            return stats;
        } catch (error) {
            this.logger.error(`월별 직원 이벤트 통계 생성 실패: ${year}-${month}`, error);
            throw error;
        }
    }

    /**
     * 기존_이벤트_데이터를_삭제한다
     */
    async 기존_이벤트_데이터를_삭제한다(
        employeeNumbers: string[],
        startDate: string,
        endDate: string,
    ): Promise<number> {
        try {
            const result = await this.eventInfoRepository
                .createQueryBuilder()
                .delete()
                .where('employeeNumber IN (:...employeeNumbers)', { employeeNumbers })
                .andWhere('yyyymmdd BETWEEN :startDate AND :endDate', { startDate, endDate })
                .execute();

            const deletedCount = result.affected || 0;
            this.logger.log(`기존 이벤트 데이터 삭제 완료: ${deletedCount}개`);

            return deletedCount;
        } catch (error) {
            this.logger.error('기존 이벤트 데이터 삭제 실패', error);
            throw error;
        }
    }

    /**
     * 중복_이벤트를_제거한다
     */
    async 중복_이벤트를_제거한다(employeeNumber: string, date: string, time: string): Promise<number> {
        try {
            const duplicateEvents = await this.eventInfoRepository.find({
                where: {
                    employeeNumber,
                    yyyymmdd: date,
                    hhmmss: time,
                },
                order: { eventId: 'ASC' },
            });

            if (duplicateEvents.length <= 1) {
                return 0;
            }

            // 첫 번째 이벤트는 유지하고 나머지 삭제
            const eventsToDelete = duplicateEvents.slice(1);
            const eventIdsToDelete = eventsToDelete.map((event) => event.eventId);

            const result = await this.eventInfoRepository.delete(eventIdsToDelete);
            const deletedCount = result.affected || 0;

            this.logger.log(`중복 이벤트 제거 완료: ${employeeNumber} (${date} ${time}) - ${deletedCount}개 삭제`);

            return deletedCount;
        } catch (error) {
            this.logger.error(`중복 이벤트 제거 실패: ${employeeNumber} (${date} ${time})`, error);
            throw error;
        }
    }

    /**
     * 이벤트_데이터_유효성을_검증한다
     */
    async 이벤트_데이터_유효성을_검증한다(eventsData: Partial<EventInfoEntity>[]): Promise<{
        validEvents: Partial<EventInfoEntity>[];
        invalidEvents: Array<{
            data: Partial<EventInfoEntity>;
            errors: string[];
        }>;
    }> {
        try {
            const validEvents: Partial<EventInfoEntity>[] = [];
            const invalidEvents: Array<{
                data: Partial<EventInfoEntity>;
                errors: string[];
            }> = [];

            eventsData.forEach((eventData) => {
                const errors: string[] = [];

                // 필수 필드 검증
                if (!eventData.employeeNumber) {
                    errors.push('직원번호가 없습니다');
                }

                if (!eventData.yyyymmdd) {
                    errors.push('날짜가 없습니다');
                }

                if (!eventData.hhmmss) {
                    errors.push('시간이 없습니다');
                }

                // 날짜 형식 검증 (YYYYMMDD)
                if (eventData.yyyymmdd && !/^\d{8}$/.test(eventData.yyyymmdd)) {
                    errors.push('날짜 형식이 올바르지 않습니다 (YYYYMMDD)');
                }

                // 시간 형식 검증 (HHMMSS)
                if (eventData.hhmmss && !/^\d{6}$/.test(eventData.hhmmss)) {
                    errors.push('시간 형식이 올바르지 않습니다 (HHMMSS)');
                }

                if (errors.length === 0) {
                    validEvents.push(eventData);
                } else {
                    invalidEvents.push({
                        data: eventData,
                        errors,
                    });
                }
            });

            this.logger.log(
                `이벤트 데이터 유효성 검증 완료: 유효 ${validEvents.length}개, 무효 ${invalidEvents.length}개`,
            );

            return { validEvents, invalidEvents };
        } catch (error) {
            this.logger.error('이벤트 데이터 유효성 검증 실패', error);
            throw error;
        }
    }

    /**
     * 이벤트_데이터를_일괄_업데이트한다
     */
    async 이벤트_데이터를_일괄_업데이트한다(
        eventUpdates: Array<{
            eventId: string;
            updateData: Partial<EventInfoEntity>;
        }>,
    ): Promise<number> {
        try {
            let updatedCount = 0;

            for (const update of eventUpdates) {
                const result = await this.eventInfoRepository.update(update.eventId, update.updateData);
                updatedCount += result.affected || 0;
            }

            this.logger.log(`이벤트 데이터 일괄 업데이트 완료: ${updatedCount}개`);

            return updatedCount;
        } catch (error) {
            this.logger.error('이벤트 데이터 일괄 업데이트 실패', error);
            throw error;
        }
    }
}
