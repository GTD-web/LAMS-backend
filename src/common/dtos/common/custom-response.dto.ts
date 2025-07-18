import { ApiProperty } from '@nestjs/swagger';

/**
 * 공통 ?�답 DTO
 * - ?��????�답 ?�식???�공
 * - ?�이?��? 메시지�??�함
 */
export class CustomResponseDto<T> {
    @ApiProperty({
        description: '?�답 ?�이??,
        type: 'object',
    })
    data: T;

    @ApiProperty({
        description: '?�답 메시지',
        type: 'string',
        example: '?�청???�공?�으�?처리?�었?�니??',
    })
    message: string;

    constructor(data: T, message: string) {
        this.data = data;
        this.message = message;
    }
}
