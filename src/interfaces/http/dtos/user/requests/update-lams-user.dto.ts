import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({
        description: '사용자 이름',
        example: '어드민',
    })
    @IsString()
    @IsOptional()
    username: string;

    @ApiProperty({
        description: '사용자 비밀번호',
        example: '',
    })
    @IsString()
    @IsOptional()
    password: string;
}

export class ChangePasswordDto {
    @ApiProperty({
        description: '사용자 ID',
        example: '',
    })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        description: '사용자 비밀번호',
        example: '',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
