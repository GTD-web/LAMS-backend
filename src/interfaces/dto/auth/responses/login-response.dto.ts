import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../organization/responses/user-response.dto';

export class LoginResponseDto {
    @ApiProperty({
        description: '?†ÌÅ∞',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    token: string;

    @ApiProperty({
        description: '?¨Ïö©???ïÎ≥¥',
        type: UserResponseDto,
    })
    user: UserResponseDto;
}
