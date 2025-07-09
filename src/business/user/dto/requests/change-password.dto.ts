import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * 비밀번호 변경 요청 DTO
 */
export class ChangePasswordDto {
    @ApiProperty({
        description: '현재 비밀번호',
        example: 'currentPassword123',
    })
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({
        description: '새 비밀번호',
        example: 'newPassword123',
        minLength: 8,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    newPassword: string;
}
