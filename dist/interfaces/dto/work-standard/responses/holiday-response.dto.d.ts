import { HolidayInfoEntity } from '../../../../domain/holiday/entities/holiday-info.entity';
export declare class HolidayResponseDto {
    readonly holidayId: string;
    readonly holidayName: string;
    readonly holidayDate: string;
    constructor(entity: HolidayInfoEntity);
    static fromEntity(entity: HolidayInfoEntity): HolidayResponseDto;
    static fromEntities(entities: HolidayInfoEntity[]): HolidayResponseDto[];
}
