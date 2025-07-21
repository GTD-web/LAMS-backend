import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { HolidayInfoEntity } from '../entities/holiday-info.entity';

/**
 * 휴일 도메인 서비스
 */
@Injectable()
export class HolidayDomainService {
    private readonly logger = new Logger(HolidayDomainService.name);

    constructor(
        @InjectRepository(HolidayInfoEntity)
        private readonly holidayRepository: Repository<HolidayInfoEntity>,
    ) {}

    /**
     * 휴일 ID로 조회
     */
    async findHolidayById(holidayId: string): Promise<HolidayInfoEntity | null> {
        return await this.holidayRepository.findOne({
            where: { holidayId },
        });
    }

    /**
     * 연도별 휴일 목록 조회 (페이지네이션)
     */
    async findHolidaysByYear(
        year: number,
        page: number = 1,
        limit: number = 10,
        order?: FindOptionsOrder<HolidayInfoEntity>,
    ): Promise<{ holidays: HolidayInfoEntity[]; total: number }> {
        const where: FindOptionsWhere<HolidayInfoEntity> = {
            holidayDate: `${year}-%` as any, // 연도로 시작하는 날짜 필터링
        };

        const skip = (page - 1) * limit;
        const take = limit;

        const [holidays, total] = await Promise.all([
            this.holidayRepository.find({ where, order, skip, take }),
            this.holidayRepository.count({ where }),
        ]);

        return { holidays, total };
    }

    /**
     * 휴일 목록 조회 (페이지네이션)
     */
    async findHolidays(
        page: number = 1,
        limit: number = 10,
        where?: FindOptionsWhere<HolidayInfoEntity>,
        order?: FindOptionsOrder<HolidayInfoEntity>,
    ): Promise<{ holidays: HolidayInfoEntity[]; total: number }> {
        const skip = (page - 1) * limit;
        const take = limit;

        const [holidays, total] = await Promise.all([
            this.holidayRepository.find({ where, order, skip, take }),
            this.holidayRepository.count({ where }),
        ]);

        return { holidays, total };
    }

    /**
     * 휴일 생성
     */
    async createHoliday(holidayData: Partial<HolidayInfoEntity>): Promise<HolidayInfoEntity> {
        const newHoliday = this.holidayRepository.create(holidayData);
        return await this.holidayRepository.save(newHoliday);
    }

    /**
     * 휴일 업데이트
     */
    async updateHoliday(holidayId: string, updateData: Partial<HolidayInfoEntity>): Promise<HolidayInfoEntity> {
        await this.holidayRepository.update(holidayId, updateData);
        return await this.findHolidayById(holidayId);
    }

    /**
     * 휴일 삭제
     */
    async deleteHoliday(holidayId: string): Promise<boolean> {
        const result = await this.holidayRepository.delete(holidayId);
        return result.affected > 0;
    }

    /**
     * 휴일 저장
     */
    async saveHoliday(holiday: HolidayInfoEntity): Promise<HolidayInfoEntity> {
        return await this.holidayRepository.save(holiday);
    }

    /**
     * 모든 휴일 조회
     */
    async findAllHolidays(): Promise<HolidayInfoEntity[]> {
        return await this.holidayRepository.find();
    }

    /**
     * 특정 날짜의 휴일 조회
     */
    async findHolidayByDate(holidayDate: string): Promise<HolidayInfoEntity | null> {
        const holidays = await this.holidayRepository.find({
            where: { holidayDate },
        });
        return holidays.length > 0 ? holidays[0] : null;
    }
}
