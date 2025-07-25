import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';

/**
 * 근무 유형 생성 요청 DTO
 */
export class CreateAttendanceTypeDto {
    @ApiProperty({
        description: '근무 유형 제목',
        example: '정규근무',
    })
    @IsString()
    readonly title: string;

    @ApiProperty({
        description: '근무 시간 (분)',
        example: 480,
        minimum: 0,
        maximum: 1440,
    })
    @IsNumber()
    @Min(0)
    @Max(1440)
    readonly workTime: number;

    @ApiProperty({
        description: '인정 근무 시간 여부',
        example: true,
    })
    @IsBoolean()
    readonly isRecognizedWorkTime: boolean;

    @ApiPropertyOptional({
        description: '시작 근무 시간',
        example: '09:00',
    })
    @IsOptional()
    @IsString()
    readonly startWorkTime?: string;

    @ApiPropertyOptional({
        description: '종료 근무 시간',
        example: '18:00',
    })
    @IsOptional()
    @IsString()
    readonly endWorkTime?: string;

    @ApiPropertyOptional({
        description: '차감 연차',
        example: 0,
        default: 0,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    readonly deductedAnnualLeave?: number = 0;
}
