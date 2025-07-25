import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional } from 'class-validator';

/**
 * 공휴일 수정 요청 DTO
 */
export class UpdateHolidayDto {
    @ApiPropertyOptional({
        description: '공휴일 이름',
        example: '신정',
    })
    @IsOptional()
    @IsString()
    readonly holidayName?: string;

    @ApiPropertyOptional({
        description: '공휴일 날짜',
        example: '2024-01-01',
        format: 'date',
    })
    @IsOptional()
    @IsDateString()
    readonly holidayDate?: string;
}
