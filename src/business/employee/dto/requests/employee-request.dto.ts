import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

/**
 * 퇴사일 업데이트 요청 DTO
 */
export class UpdateEmployeeQuitedAtDto {
    @ApiProperty({
        description: '퇴사일',
        example: '2023-12-31',
        type: String,
        format: 'date',
    })
    @IsDateString()
    @IsNotEmpty()
    quitedAt: string;
}

/**
 * 입사일 업데이트 요청 DTO
 */
export class UpdateEmployeeEntryAtDto {
    @ApiProperty({
        description: '입사일',
        example: '2023-01-01',
        type: String,
        format: 'date',
    })
    @IsDateString()
    @IsNotEmpty()
    entryAt: string;
}
