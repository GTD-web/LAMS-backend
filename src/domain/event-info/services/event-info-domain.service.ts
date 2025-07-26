import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindOptionsOrder, Between } from 'typeorm';
import { EventInfoEntity } from '../entities/event-info.entity';

/**
 * Event-Info 도메인 서비스
 * - 출입 이벤트 정보 관련 도메인 로직
 */
@Injectable()
export class EventInfoDomainService {
    private readonly logger = new Logger(EventInfoDomainService.name);

    constructor(
        @InjectRepository(EventInfoEntity)
        private readonly eventInfoRepository: Repository<EventInfoEntity>,
    ) {}

    /**
     * 이벤트 정보를 ID로 조회한다
     */
    async findEventById(eventId: string): Promise<EventInfoEntity | null> {
        try {
            const event = await this.eventInfoRepository.findOne({
                where: { eventId },
            });

            if (event) {
                this.logger.log(`이벤트 조회 완료: ${eventId}`);
            }

            return event;
        } catch (error) {
            this.logger.error(`이벤트 조회 실패: ${eventId}`, error);
            throw error;
        }
    }

    /**
     * 직원번호로 이벤트 목록을 조회한다
     */
    async findEventsByEmployeeNumber(
        employeeNumber: string,
        startDate?: string,
        endDate?: string,
    ): Promise<EventInfoEntity[]> {
        try {
            const where: FindOptionsWhere<EventInfoEntity> = {
                employeeNumber,
            };

            if (startDate && endDate) {
                where.yyyymmdd = Between(startDate, endDate);
            }

            const events = await this.eventInfoRepository.find({
                where,
                order: { yyyymmdd: 'DESC', hhmmss: 'DESC' },
            });

            this.logger.log(`직원별 이벤트 조회 완료: ${employeeNumber} (${events.length}개)`);

            return events;
        } catch (error) {
            this.logger.error(`직원별 이벤트 조회 실패: ${employeeNumber}`, error);
            throw error;
        }
    }

    /**
     * 날짜별 이벤트 목록을 조회한다
     */
    async findEventsByDate(date: string, employeeNumber?: string): Promise<EventInfoEntity[]> {
        try {
            const where: FindOptionsWhere<EventInfoEntity> = {
                yyyymmdd: date,
            };

            if (employeeNumber) {
                where.employeeNumber = employeeNumber;
            }

            const events = await this.eventInfoRepository.find({
                where,
                order: { hhmmss: 'ASC' },
            });

            this.logger.log(`날짜별 이벤트 조회 완료: ${date} (${events.length}개)`);

            return events;
        } catch (error) {
            this.logger.error(`날짜별 이벤트 조회 실패: ${date}`, error);
            throw error;
        }
    }

    /**
     * 기간별 이벤트 목록을 조회한다
     */
    async findEventsByDateRange(
        startDate: string,
        endDate: string,
        employeeNumbers?: string[],
    ): Promise<EventInfoEntity[]> {
        try {
            const queryBuilder = this.eventInfoRepository
                .createQueryBuilder('event')
                .where('event.yyyymmdd BETWEEN :startDate AND :endDate', {
                    startDate,
                    endDate,
                });

            if (employeeNumbers && employeeNumbers.length > 0) {
                queryBuilder.andWhere('event.employeeNumber IN (:...employeeNumbers)', {
                    employeeNumbers,
                });
            }

            const events = await queryBuilder
                .orderBy('event.yyyymmdd', 'ASC')
                .addOrderBy('event.employeeNumber', 'ASC')
                .addOrderBy('event.hhmmss', 'ASC')
                .getMany();

            this.logger.log(`기간별 이벤트 조회 완료: ${startDate}~${endDate} (${events.length}개)`);

            return events;
        } catch (error) {
            this.logger.error(`기간별 이벤트 조회 실패: ${startDate}~${endDate}`, error);
            throw error;
        }
    }

    /**
     * 이벤트 정보를 생성한다
     */
    async createEvent(eventData: Partial<EventInfoEntity>): Promise<EventInfoEntity> {
        try {
            const newEvent = this.eventInfoRepository.create(eventData);
            const savedEvent = await this.eventInfoRepository.save(newEvent);

            this.logger.log(`이벤트 생성 완료: ${savedEvent.eventId}`);

            return savedEvent;
        } catch (error) {
            this.logger.error('이벤트 생성 실패', error);
            throw error;
        }
    }

    /**
     * 여러 이벤트 정보를 일괄 생성한다
     */
    async createEvents(eventsData: Partial<EventInfoEntity>[]): Promise<EventInfoEntity[]> {
        try {
            const newEvents = this.eventInfoRepository.create(eventsData);
            const savedEvents = await this.eventInfoRepository.save(newEvents);

            this.logger.log(`이벤트 일괄 생성 완료: ${savedEvents.length}개`);

            return savedEvents;
        } catch (error) {
            this.logger.error('이벤트 일괄 생성 실패', error);
            throw error;
        }
    }

    /**
     * 이벤트 정보를 업데이트한다
     */
    async updateEvent(eventId: string, updateData: Partial<EventInfoEntity>): Promise<EventInfoEntity> {
        try {
            await this.eventInfoRepository.update(eventId, updateData);
            const updatedEvent = await this.findEventById(eventId);

            if (!updatedEvent) {
                throw new Error(`업데이트된 이벤트를 찾을 수 없습니다: ${eventId}`);
            }

            this.logger.log(`이벤트 업데이트 완료: ${eventId}`);

            return updatedEvent;
        } catch (error) {
            this.logger.error(`이벤트 업데이트 실패: ${eventId}`, error);
            throw error;
        }
    }

    /**
     * 이벤트 정보를 삭제한다
     */
    async deleteEvent(eventId: string): Promise<boolean> {
        try {
            const result = await this.eventInfoRepository.delete(eventId);
            const isDeleted = result.affected > 0;

            if (isDeleted) {
                this.logger.log(`이벤트 삭제 완료: ${eventId}`);
            }

            return isDeleted;
        } catch (error) {
            this.logger.error(`이벤트 삭제 실패: ${eventId}`, error);
            throw error;
        }
    }

    /**
     * 직원번호와 날짜로 이벤트를 삭제한다
     */
    async deleteEventsByEmployeeAndDate(employeeNumber: string, startDate: string, endDate: string): Promise<number> {
        try {
            const result = await this.eventInfoRepository
                .createQueryBuilder()
                .delete()
                .where('employeeNumber = :employeeNumber', { employeeNumber })
                .andWhere('yyyymmdd BETWEEN :startDate AND :endDate', { startDate, endDate })
                .execute();

            const deletedCount = result.affected || 0;
            this.logger.log(`직원별 기간 이벤트 삭제 완료: ${employeeNumber} (${deletedCount}개)`);

            return deletedCount;
        } catch (error) {
            this.logger.error(`직원별 기간 이벤트 삭제 실패: ${employeeNumber}`, error);
            throw error;
        }
    }

    /**
     * 직원의 일별 첫 출입과 마지막 출입 시간을 조회한다
     */
    async findDailyFirstAndLastEvent(
        employeeNumber: string,
        date: string,
    ): Promise<{ firstEvent: EventInfoEntity | null; lastEvent: EventInfoEntity | null }> {
        try {
            const events = await this.findEventsByDate(date, employeeNumber);

            if (events.length === 0) {
                return { firstEvent: null, lastEvent: null };
            }

            // 시간순으로 정렬
            const sortedEvents = events.sort((a, b) => a.hhmmss.localeCompare(b.hhmmss));

            const firstEvent = sortedEvents[0];
            const lastEvent = sortedEvents[sortedEvents.length - 1];

            this.logger.log(`일별 첫/마지막 이벤트 조회 완료: ${employeeNumber} (${date})`);

            return { firstEvent, lastEvent };
        } catch (error) {
            this.logger.error(`일별 첫/마지막 이벤트 조회 실패: ${employeeNumber} (${date})`, error);
            throw error;
        }
    }

    /**
     * 월별 이벤트 통계를 조회한다
     */
    async getMonthlyEventStats(
        year: string,
        month: string,
        employeeNumbers?: string[],
    ): Promise<{
        totalEvents: number;
        employeeEventCounts: Record<string, number>;
        dailyEventCounts: Record<string, number>;
    }> {
        try {
            const startDate = `${year}${month.padStart(2, '0')}01`;
            const endDate = `${year}${month.padStart(2, '0')}31`;

            const events = await this.findEventsByDateRange(startDate, endDate, employeeNumbers);

            const employeeEventCounts: Record<string, number> = {};
            const dailyEventCounts: Record<string, number> = {};

            events.forEach((event) => {
                // 직원별 카운트
                employeeEventCounts[event.employeeNumber] = (employeeEventCounts[event.employeeNumber] || 0) + 1;

                // 일별 카운트
                dailyEventCounts[event.yyyymmdd] = (dailyEventCounts[event.yyyymmdd] || 0) + 1;
            });

            const stats = {
                totalEvents: events.length,
                employeeEventCounts,
                dailyEventCounts,
            };

            this.logger.log(`월별 이벤트 통계 조회 완료: ${year}-${month} (총 ${stats.totalEvents}개)`);

            return stats;
        } catch (error) {
            this.logger.error(`월별 이벤트 통계 조회 실패: ${year}-${month}`, error);
            throw error;
        }
    }

    /**
     * 중복 이벤트를 확인한다
     */
    async findDuplicateEvents(employeeNumber: string, date: string, time: string): Promise<EventInfoEntity[]> {
        try {
            const events = await this.eventInfoRepository.find({
                where: {
                    employeeNumber,
                    yyyymmdd: date,
                    hhmmss: time,
                },
            });

            if (events.length > 1) {
                this.logger.warn(`중복 이벤트 발견: ${employeeNumber} (${date} ${time}) - ${events.length}개`);
            }

            return events;
        } catch (error) {
            this.logger.error(`중복 이벤트 확인 실패: ${employeeNumber} (${date} ${time})`, error);
            throw error;
        }
    }
}
