import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../organization/responses/user-response.dto';

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
}
