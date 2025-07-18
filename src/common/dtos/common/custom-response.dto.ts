import { ApiProperty } from '@nestjs/swagger';

/**
 * 瓿淀喌 ?戨嫷 DTO
 * - ?缄????戨嫷 ?曥嫕???滉车
 * - ?办澊?办? 氅旍嫓歆�毳??暔
 */
export class CustomResponseDto<T> {
    @ApiProperty({
        description: '?戨嫷 ?办澊??,
        type: 'object',
    })
    data: T;

    @ApiProperty({
        description: '?戨嫷 氅旍嫓歆�',
        type: 'string',
        example: '?旍箔???标车?侅溂搿?觳橂Μ?橃棃?惦媹??',
    })
    message: string;

    constructor(data: T, message: string) {
        this.data = data;
        this.message = message;
    }
}
