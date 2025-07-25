import { ApiProperty } from '@nestjs/swagger';
import { HolidayInfoEntity } from '../../../domain/holiday/entities/holiday-info.entity';

/**
 * 공휴일 응답 DTO
 */
export class HolidayResponseDto {
    @ApiProperty({
        description: '공휴일 ID',
        example: 'uuid-string',
        format: 'uuid',
    })
    readonly holidayId: string;

    @ApiProperty({
        description: '공휴일 이름',
        example: '신정',
    })
    readonly holidayName: string;

    @ApiProperty({
        description: '공휴일 날짜',
        example: '2024-01-01',
        format: 'date',
    })
    readonly holidayDate: string;

    constructor(entity: HolidayInfoEntity) {
        this.holidayId = entity.holidayId;
        this.holidayName = entity.holidayName;
        this.holidayDate = entity.holidayDate;
    }

    static fromEntity(entity: HolidayInfoEntity): HolidayResponseDto {
        return new HolidayResponseDto(entity);
    }

    static fromEntities(entities: HolidayInfoEntity[]): HolidayResponseDto[] {
        return entities.map((entity) => HolidayResponseDto.fromEntity(entity));
    }
}
