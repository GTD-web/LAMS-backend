import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: '이메일',
        example: 'test@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: '비밀번호',
        example: 'password',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
