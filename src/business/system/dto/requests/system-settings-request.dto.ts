import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';

/**
 * 근무 유형 생성 요청 DTO
 */
export class CreateAttendanceTypeDto {
    @ApiProperty({
        description: '근무 유형 제목',
        example: '정상 근무',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: '근무 시간 (분)',
        example: 480,
    })
    @IsNumber()
    workTime: number;

    @ApiProperty({
        description: '인정 근무 시간 여부',
        example: true,
    })
    @IsBoolean()
    isRecognizedWorkTime: boolean;

    @ApiProperty({
        description: '시작 근무 시간',
        example: '09:00',
        required: false,
    })
    @IsOptional()
    @IsString()
    startWorkTime?: string;

    @ApiProperty({
        description: '종료 근무 시간',
        example: '18:00',
        required: false,
    })
    @IsOptional()
    @IsString()
    endWorkTime?: string;

    @ApiProperty({
        description: '차감 연차 일수',
        example: 0,
        default: 0,
    })
    @IsOptional()
    @IsNumber()
    deductedAnnualLeave?: number = 0;
}

/**
 * 근무 유형 업데이트 요청 DTO
 */
export class UpdateAttendanceTypeDto {
    @ApiProperty({
        description: '근무 유형 제목',
        example: '정상 근무',
        required: false,
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        description: '근무 시간 (분)',
        example: 480,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    workTime?: number;

    @ApiProperty({
        description: '인정 근무 시간 여부',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isRecognizedWorkTime?: boolean;

    @ApiProperty({
        description: '시작 근무 시간',
        example: '09:00',
        required: false,
    })
    @IsOptional()
    @IsString()
    startWorkTime?: string;

    @ApiProperty({
        description: '종료 근무 시간',
        example: '18:00',
        required: false,
    })
    @IsOptional()
    @IsString()
    endWorkTime?: string;

    @ApiProperty({
        description: '차감 연차 일수',
        example: 0,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    deductedAnnualLeave?: number;
}

/**
 * 휴일 생성 요청 DTO
 */
export class CreateHolidayDto {
    @ApiProperty({
        description: '휴일 날짜',
        example: '2024-01-01',
        format: 'date',
    })
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @ApiProperty({
        description: '휴일명',
        example: '신정',
    })
    @IsString()
    @IsNotEmpty()
    holidayName: string;
}

/**
 * 휴일 업데이트 요청 DTO
 */
export class UpdateHolidayDto {
    @ApiProperty({
        description: '휴일 날짜',
        example: '2024-01-01',
        format: 'date',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiProperty({
        description: '휴일명',
        example: '신정',
        required: false,
    })
    @IsOptional()
    @IsString()
    holidayName?: string;
}

/**
 * 페이지네이션 쿼리 DTO
 */
export class PaginationQueryDto {
    @ApiProperty({
        description: '페이지 번호',
        example: 1,
        default: 1,
    })
    @IsOptional()
    @IsNumber()
    page?: number = 1;

    @ApiProperty({
        description: '페이지당 항목 수',
        example: 10,
        default: 10,
    })
    @IsOptional()
    @IsNumber()
    limit?: number = 10;
}

/**
 * 연도별 휴일 조회 쿼리 DTO
 */
export class HolidayYearQueryDto extends PaginationQueryDto {
    @ApiProperty({
        description: '연도',
        example: 2024,
    })
    @IsNumber()
    @IsNotEmpty()
    year: number;
}
