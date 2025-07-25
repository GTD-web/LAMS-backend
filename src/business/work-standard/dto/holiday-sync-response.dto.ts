import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/**
 * 휴일 동기화 응답 DTO
 */
@Exclude()
export class HolidaySyncResponseDto {
    @ApiProperty({
        description: '동기화 결과 메시지',
        example: '2024년 휴일 동기화가 완료되었습니다.',
    })
    @Expose()
    readonly message: string;

    @ApiProperty({
        description: '동기화된 휴일 개수',
        example: 15,
        type: 'integer',
    })
    @Expose()
    readonly syncedCount: number;

    @ApiProperty({
        description: '동기화 대상 연도',
        example: '2024',
    })
    @Expose()
    readonly year: string;

    @ApiProperty({
        description: '동기화 완료 시간',
        example: '2024-01-01T00:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly completedAt: string;

    constructor(data: { message: string; syncedCount: number; year: string }) {
        this.message = data.message;
        this.syncedCount = data.syncedCount;
        this.year = data.year;
        this.completedAt = new Date().toISOString();
    }
}

/**
 * 수동 휴일 동기화 응답 DTO
 */
@Exclude()
export class ManualHolidaySyncResponseDto {
    @ApiProperty({
        description: '동기화 결과 메시지',
        example: '2024년 휴일 동기화가 완료되었습니다.',
    })
    @Expose()
    readonly message: string;

    @ApiProperty({
        description: '동기화 대상 연도',
        example: '2024',
    })
    @Expose()
    readonly year: string;

    @ApiProperty({
        description: '동기화 완료 시간',
        example: '2024-01-01T00:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly completedAt: string;

    constructor(data: { message: string; year: string }) {
        this.message = data.message;
        this.year = data.year;
        this.completedAt = new Date().toISOString();
    }
}
