import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';

/**
 * 공휴일 생성 요청 DTO
 */
export class CreateHolidayDto {
    @ApiProperty({
        description: '공휴일 이름',
        example: '신정',
    })
    @IsString()
    readonly holidayName: string;

    @ApiProperty({
        description: '공휴일 날짜',
        example: '2024-01-01',
        format: 'date',
    })
    @IsDateString()
    readonly holidayDate: string;
}
