import { Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { HolidayInfoEntity } from '../entities/holiday-info.entity';
export declare class HolidayDomainService {
    private readonly holidayRepository;
    private readonly logger;
    constructor(holidayRepository: Repository<HolidayInfoEntity>);
    findHolidayById(holidayId: string): Promise<HolidayInfoEntity | null>;
    findHolidaysByYear(year: number, page?: number, limit?: number, order?: FindOptionsOrder<HolidayInfoEntity>): Promise<{
        holidays: HolidayInfoEntity[];
        total: number;
    }>;
    findHolidays(page?: number, limit?: number, where?: FindOptionsWhere<HolidayInfoEntity>, order?: FindOptionsOrder<HolidayInfoEntity>): Promise<{
        holidays: HolidayInfoEntity[];
        total: number;
    }>;
    createHoliday(holidayData: Partial<HolidayInfoEntity>): Promise<HolidayInfoEntity>;
    updateHoliday(holidayId: string, updateData: Partial<HolidayInfoEntity>): Promise<HolidayInfoEntity>;
    deleteHoliday(holidayId: string): Promise<boolean>;
    saveHoliday(holiday: HolidayInfoEntity): Promise<HolidayInfoEntity>;
    findAllHolidays(): Promise<HolidayInfoEntity[]>;
    findHolidayByDate(holidayDate: string): Promise<HolidayInfoEntity | null>;
}
