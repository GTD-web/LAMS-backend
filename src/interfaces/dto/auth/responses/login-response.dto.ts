import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty({
        description: '토큰',
        example: 'token',
    })
    token: string;
}
