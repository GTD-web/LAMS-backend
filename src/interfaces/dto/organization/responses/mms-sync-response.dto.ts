import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/**
 * MMS 동기화 결과 응답 DTO
 */
@Exclude()
export class MMSSyncResponseDto {
    @ApiProperty({
        description: '동기화 성공 여부',
        example: true,
    })
    @Expose()
    readonly success: boolean;

    @ApiProperty({
        description: '동기화 결과 메시지',
        example: 'MMS 전체 동기화가 성공적으로 완료되었습니다.',
    })
    @Expose()
    readonly message: string;

    @ApiProperty({
        description: '동기화 실행 시간',
        example: '2025-01-01T12:00:00.000Z',
        format: 'date-time',
    })
    @Expose()
    readonly timestamp: string;

    constructor(partial: Partial<MMSSyncResponseDto>) {
        Object.assign(this, partial);
    }
}
