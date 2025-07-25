import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/**
 * 근무 유형 시드 초기화 응답 DTO
 */
@Exclude()
export class AttendanceTypeSeedResponseDto {
    @ApiProperty({
        description: '시드 초기화 결과 메시지',
        example: '근무 유형 시드 데이터 초기화가 완료되었습니다.',
    })
    @Expose()
    readonly message: string;

    @ApiProperty({
        description: '총 근무 유형 개수',
        example: 26,
        type: 'integer',
    })
    @Expose()
    readonly count: number;

    @ApiProperty({
        description: '초기화 완료 시간',
        example: '2024-01-01T00:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly completedAt: string;

    constructor(data: { message: string; count: number }) {
        this.message = data.message;
        this.count = data.count;
        this.completedAt = new Date().toISOString();
    }
}

/**
 * 근무 유형 존재 여부 확인 응답 DTO
 */
@Exclude()
export class AttendanceTypeExistsResponseDto {
    @ApiProperty({
        description: '확인한 근무 유형 제목',
        example: '연차',
    })
    @Expose()
    readonly title: string;

    @ApiProperty({
        description: '근무 유형 존재 여부',
        example: true,
        type: 'boolean',
    })
    @Expose()
    readonly exists: boolean;

    @ApiProperty({
        description: '확인 완료 시간',
        example: '2024-01-01T00:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly checkedAt: string;

    constructor(data: { title: string; exists: boolean }) {
        this.title = data.title;
        this.exists = data.exists;
        this.checkedAt = new Date().toISOString();
    }
}
