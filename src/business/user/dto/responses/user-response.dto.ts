import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@src/domain/user/entities/user.entity';
import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UserResponseDto {
    @ApiProperty({ description: '사용자 ID' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ description: '사용자명' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ description: '이메일' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: '역할' })
    @IsArray()
    @IsNotEmpty()
    roles: UserRole[];

    @ApiProperty({ description: '활성 상태' })
    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;
}
