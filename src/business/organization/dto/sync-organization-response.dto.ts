import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 조직 동기화 성공 응답 DTO
 */
export class SyncOrganizationResponseDto {
    @ApiProperty({
        description: '동기화 성공 메시지',
        example: '조직 동기화가 성공적으로 완료되었습니다.',
    })
    readonly message: string;

    @ApiProperty({
        description: '동기화 완료 시간',
        example: '2024-01-21T10:30:00Z',
        format: 'date-time',
    })
    readonly completedAt: string;

    @ApiProperty({
        description: '동기화 성공 여부',
        example: true,
    })
    readonly success: boolean;

    @ApiPropertyOptional({
        description: '동기화 통계 정보',
        type: 'object',
        properties: {
            totalEmployees: { type: 'integer', example: 25 },
            updatedRelations: { type: 'integer', example: 5 },
            skippedRelations: { type: 'integer', example: 20 },
        },
    })
    readonly statistics?: {
        totalEmployees: number;
        updatedRelations: number;
        skippedRelations: number;
    };

    constructor(
        message: string = '조직 동기화가 성공적으로 완료되었습니다.',
        statistics?: {
            totalEmployees: number;
            updatedRelations: number;
            skippedRelations: number;
        },
    ) {
        this.message = message;
        this.completedAt = new Date().toISOString();
        this.success = true;
        this.statistics = statistics;
    }
}
