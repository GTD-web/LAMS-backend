import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../../../business/user/dto/user-response.dto';

export class LoginResponseDto {
    @ApiProperty({
        description: '토큰',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    token: string;

    @ApiProperty({
        description: '사용자 정보',
        type: UserResponseDto,
    })
    user: UserResponseDto;

    constructor(token: string, user: UserResponseDto) {
        this.token = token;
        this.user = user;
    }
}
