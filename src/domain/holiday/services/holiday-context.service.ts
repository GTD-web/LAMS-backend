import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { HolidayInfoEntity } from '../entities/holiday-info.entity';

/**
 * 휴일 Context 서비스
 * - 비즈니스 로직에서 사용하는 Context 메서드들
 */
@Injectable()
export class HolidayContextService {
    private readonly logger = new Logger(HolidayContextService.name);

    constructor(
        @InjectRepository(HolidayInfoEntity)
        private readonly holidayRepository: Repository<HolidayInfoEntity>,
    ) {}

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
        try {
            const skip = (page - 1) * limit;
            const take = limit;

            const where: FindOptionsWhere<HolidayInfoEntity> = {
                holidayDate: `${year}-%` as any, // 연도로 시작하는 날짜 필터링
            };

            const [holidays, total] = await Promise.all([
                this.holidayRepository.find({
                    where,
                    skip,
                    take,
                    order: { holidayDate: 'ASC' },
                }),
                this.holidayRepository.count({ where }),
            ]);

            this.logger.log(`${year}년 휴일 목록 조회 완료: ${holidays.length}개 (페이지: ${page}, 제한: ${limit})`);

            return {
                holidays,
                total,
                page,
                limit,
                year,
            };
        } catch (error) {
            this.logger.error(`${year}년 휴일 목록 조회 실패`, error);
            throw error;
        }
    }

    /**
     * 휴일 ID 체크
     */
    async 휴일_ID를_체크한다(holidayId: string): Promise<HolidayInfoEntity> {
        try {
            const holiday = await this.holidayRepository.findOne({
                where: { holidayId },
            });

            if (!holiday) {
                throw new Error(`휴일을 찾을 수 없습니다: ${holidayId}`);
            }

            this.logger.log(`휴일 ID 체크 완료: ${holiday.holidayName} (ID: ${holidayId})`);

            return holiday;
        } catch (error) {
            this.logger.error(`휴일 ID 체크 실패: ${holidayId}`, error);
            throw error;
        }
    }

    /**
     * 관리자는 휴일을 생성한다
     */
    async 관리자는_휴일을_생성한다(date: string, holidayName: string): Promise<HolidayInfoEntity> {
        try {
            // 기존 휴일이 있는지 확인
            const existingHoliday = await this.holidayRepository.findOne({
                where: { holidayDate: date },
            });

            if (existingHoliday) {
                throw new Error(`해당 날짜에 이미 휴일이 존재합니다: ${date}`);
            }

            const newHoliday = this.holidayRepository.create({
                holidayDate: date,
                holidayName,
            });

            const savedHoliday = await this.holidayRepository.save(newHoliday);

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
            const existingHoliday = await this.holidayRepository.findOne({
                where: { holidayDate: date },
            });

            if (existingHoliday && existingHoliday.holidayId !== holidayId) {
                throw new Error(`해당 날짜에 이미 휴일이 존재합니다: ${date}`);
            }

            await this.holidayRepository.update(holidayId, {
                holidayDate: date,
                holidayName,
            });

            const updatedHoliday = await this.휴일_ID를_체크한다(holidayId);

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

            const result = await this.holidayRepository.delete(holidayId);
            const isDeleted = result.affected > 0;

            if (isDeleted) {
                this.logger.log(`휴일 삭제 완료: ${holiday.holidayName} (날짜: ${holiday.holidayDate})`);
            }

            return isDeleted;
        } catch (error) {
            this.logger.error(`휴일 삭제 실패: ${holidayId}`, error);
            throw error;
        }
    }

    /**
     * 일간 이벤트 요약에 공휴일이 변경된다
     */
    async 일간_이벤트_요약에_공휴일이_변경된다(date: string): Promise<void> {
        try {
            // TODO: 일간 이벤트 요약 업데이트 로직 구현
            this.logger.log(`일간 이벤트 요약 업데이트 예정: ${date}`);
        } catch (error) {
            this.logger.error(`일간 이벤트 요약 업데이트 실패: ${date}`, error);
            throw error;
        }
    }

    /**
     * 월간 이벤트 요약에 공휴일이 변경된다
     */
    async 월간_이벤트_요약에_공휴일이_변경된다(year: number, month: number): Promise<void> {
        try {
            // TODO: 월간 이벤트 요약 업데이트 로직 구현
            this.logger.log(`월간 이벤트 요약 업데이트 예정: ${year}-${month}`);
        } catch (error) {
            this.logger.error(`월간 이벤트 요약 업데이트 실패: ${year}-${month}`, error);
            throw error;
        }
    }

    /**
     * SEED 데이터 초기화 설정한다
     */
    async SEED_데이터_초기화_설정한다(): Promise<void> {
        try {
            // TODO: SEED 데이터 초기화 로직 구현
            this.logger.log('SEED 데이터 초기화 설정 완료');
        } catch (error) {
            this.logger.error('SEED 데이터 초기화 설정 실패', error);
            throw error;
        }
    }
}
