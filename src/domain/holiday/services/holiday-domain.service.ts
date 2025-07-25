import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindOptionsOrder, Between } from 'typeorm';
import { HolidayInfoEntity } from '../entities/holiday-info.entity';
import { PaginationQueryDto } from '../../../common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto, PaginationMetaDto } from '../../../common/dtos/pagination/pagination-response.dto';
import { HolidayApiService } from './holiday-api.service';

/**
 * 휴일 도메인 서비스
 */
@Injectable()
export class HolidayDomainService {
    private readonly logger = new Logger(HolidayDomainService.name);

    constructor(
        @InjectRepository(HolidayInfoEntity)
        private readonly holidayRepository: Repository<HolidayInfoEntity>,
        private readonly holidayApiService: HolidayApiService,
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
     * 휴일 ID로 조회 (예외처리)
     */
    async getHolidayById(holidayId: string): Promise<HolidayInfoEntity> {
        const holiday = await this.holidayRepository.findOne({
            where: { holidayId },
        });

        if (!holiday) {
            throw new NotFoundException('해당 ID의 휴일을 찾을 수 없습니다.');
        }

        return holiday;
    }

    /**
     * 연도별 휴일 목록 조회 (페이지네이션)
     */
    async findPaginatedHolidaysByYear(
        year: number,
        paginationQuery: PaginationQueryDto,
        order?: FindOptionsOrder<HolidayInfoEntity>,
    ): Promise<PaginatedResponseDto<HolidayInfoEntity>> {
        const { page, limit } = paginationQuery;
        const skip = (page - 1) * limit;

        const where: FindOptionsWhere<HolidayInfoEntity> = {
            holidayDate: `${year}-%` as any, // 연도로 시작하는 날짜 필터링
        };

        const [holidays, total] = await this.holidayRepository.findAndCount({
            where,
            order: order || { holidayDate: 'ASC' },
            skip,
            take: limit,
        });

        const meta = new PaginationMetaDto(page, limit, total);
        return new PaginatedResponseDto(holidays, meta);
    }

    /**
     * 휴일 목록 조회 (페이지네이션)
     */
    async findPaginatedHolidays(
        paginationQuery: PaginationQueryDto,
        where?: FindOptionsWhere<HolidayInfoEntity>,
        order?: FindOptionsOrder<HolidayInfoEntity>,
    ): Promise<PaginatedResponseDto<HolidayInfoEntity>> {
        const { page, limit } = paginationQuery;
        const skip = (page - 1) * limit;

        const [holidays, total] = await this.holidayRepository.findAndCount({
            where,
            order: order || { holidayDate: 'ASC' },
            skip,
            take: limit,
        });

        const meta = new PaginationMetaDto(page, limit, total);
        return new PaginatedResponseDto(holidays, meta);
    }

    /**
     * 휴일 생성
     */
    async createHoliday(holidayData: Partial<HolidayInfoEntity>): Promise<HolidayInfoEntity> {
        // 같은 날짜의 휴일이 이미 존재하는지 확인
        if (holidayData.holidayDate) {
            const existingHoliday = await this.holidayRepository.findOne({
                where: { holidayDate: holidayData.holidayDate },
            });

            if (existingHoliday) {
                throw new ConflictException('해당 날짜에 이미 휴일이 등록되어 있습니다.');
            }
        }

        const newHoliday = this.holidayRepository.create(holidayData);
        return await this.holidayRepository.save(newHoliday);
    }

    /**
     * 휴일 업데이트
     */
    async updateHoliday(holidayId: string, updateData: Partial<HolidayInfoEntity>): Promise<HolidayInfoEntity> {
        // 존재하는 휴일인지 확인
        const existingHoliday = await this.getHolidayById(holidayId);

        // 날짜 중복 검사 (자신 제외)
        if (updateData.holidayDate && updateData.holidayDate !== existingHoliday.holidayDate) {
            const duplicateHoliday = await this.holidayRepository.findOne({
                where: { holidayDate: updateData.holidayDate },
            });

            if (duplicateHoliday) {
                throw new ConflictException('해당 날짜에 이미 휴일이 등록되어 있습니다.');
            }
        }

        await this.holidayRepository.update(holidayId, updateData);
        return await this.getHolidayById(holidayId);
    }

    /**
     * 휴일 삭제
     */
    async deleteHoliday(holidayId: string): Promise<boolean> {
        // 존재하는 휴일인지 확인
        await this.getHolidayById(holidayId);

        const result = await this.holidayRepository.delete(holidayId);

        if (result.affected === 0) {
            throw new BadRequestException('휴일 삭제에 실패했습니다.');
        }

        return true;
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
        return await this.holidayRepository.findOne({
            where: { holidayDate },
        });
    }

    /**
     * 특정 날짜의 휴일 조회 (예외처리)
     */
    async getHolidayByDate(holidayDate: string): Promise<HolidayInfoEntity> {
        const holiday = await this.holidayRepository.findOne({
            where: { holidayDate },
        });

        if (!holiday) {
            throw new NotFoundException('해당 날짜에 등록된 휴일을 찾을 수 없습니다.');
        }

        return holiday;
    }

    // ==================== 휴일 동기화 관련 메서드 ====================

    /**
     * 연도별 휴일 동기화 (외부 API에서 데이터 가져와서 저장)
     */
    async syncHolidaysByYear(year: string): Promise<HolidayInfoEntity[]> {
        this.logger.log(`${year}년 휴일 동기화 시작`);

        // 1. 외부 API에서 휴일 데이터 조회
        const apiHolidays = await this.holidayApiService.fetchYearlyHolidays(year);
        const formattedHolidays = this.holidayApiService.formatHolidayData(apiHolidays);

        // 2. 해당 연도의 기존 휴일 데이터 조회
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        const existingHolidays = await this.holidayRepository.find({
            where: {
                holidayDate: Between(startDate, endDate),
            },
        });

        // 3. 기존 휴일 데이터 삭제
        if (existingHolidays.length > 0) {
            await this.holidayRepository.remove(existingHolidays);
            this.logger.log(`${year}년 기존 휴일 ${existingHolidays.length}개 삭제 완료`);
        }

        // 4. 새로운 휴일 데이터 저장
        const savedHolidays: HolidayInfoEntity[] = [];
        for (const holidayData of formattedHolidays) {
            const holidayEntity = this.holidayRepository.create({
                holidayDate: holidayData.holidayDate,
                holidayName: holidayData.holidayName,
            });
            const saved = await this.holidayRepository.save(holidayEntity);
            savedHolidays.push(saved);
        }

        this.logger.log(`${year}년 휴일 ${savedHolidays.length}개 동기화 완료`);
        return savedHolidays;
    }

    /**
     * 특정 연도의 모든 휴일 조회
     */
    async findHolidaysByYear(year: string): Promise<HolidayInfoEntity[]> {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        return await this.holidayRepository.find({
            where: {
                holidayDate: Between(startDate, endDate),
            },
            order: { holidayDate: 'ASC' },
        });
    }

    /**
     * 휴일 대량 저장 (트랜잭션 처리)
     */
    async bulkSaveHolidays(
        holidayData: Array<{ holidayDate: string; holidayName: string }>,
    ): Promise<HolidayInfoEntity[]> {
        const entities = holidayData.map((data) => this.holidayRepository.create(data));
        return await this.holidayRepository.save(entities);
    }

    /**
     * 특정 연도의 휴일 삭제
     */
    async deleteHolidaysByYear(year: string): Promise<number> {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        const holidaysToDelete = await this.holidayRepository.find({
            where: {
                holidayDate: Between(startDate, endDate),
            },
        });

        if (holidaysToDelete.length > 0) {
            await this.holidayRepository.remove(holidaysToDelete);
            this.logger.log(`${year}년 휴일 ${holidaysToDelete.length}개 삭제 완료`);
        }

        return holidaysToDelete.length;
    }
}
