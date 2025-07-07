import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SignUpDto {
    @ApiProperty({
        description: '사용자 이름',
        example: '어드민',
    })
    @IsString()
    @IsNotEmpty()
    username: string;

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
