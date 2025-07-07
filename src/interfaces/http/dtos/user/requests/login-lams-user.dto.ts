import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: '사용자 이메일',
        example: 'lams.admin@lumir.space',
    })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: '사용자 비밀번호',
        example: 'admin',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
