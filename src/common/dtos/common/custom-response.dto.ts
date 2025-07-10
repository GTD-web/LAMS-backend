import { ApiProperty } from '@nestjs/swagger';

/**
 * 공통 응답 DTO
 * - 일관된 응답 형식을 제공
 * - 데이터와 메시지를 포함
 */
export class CustomResponseDto<T> {
    @ApiProperty({
        description: '응답 데이터',
        type: 'object',
    })
    data: T;

    @ApiProperty({
        description: '응답 메시지',
        type: 'string',
        example: '요청이 성공적으로 처리되었습니다.',
    })
    message: string;

    constructor(data: T, message: string) {
        this.data = data;
        this.message = message;
    }
}
