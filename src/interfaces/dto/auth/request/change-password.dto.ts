import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({
        description: '비밀번호',
        example: 'password',
    })
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({
        description: '새 비밀번호',
        example: 'newPassword',
    })
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
