import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({
        description: '현재 비밀번호',
        example: 'password',
    })
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({
        description: '새로운 비밀번호',
        example: 'newPassword',
    })
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
