import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsString, IsBoolean, IsArray, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../../../../domain/user/enum/user.enum';

/**
 * 사용자 데이터 수정 요청 DTO
 */
export class UpdateUserDto {
    @ApiPropertyOptional({
        description: '사용자 이름',
        example: '이이',
    })
    @IsOptional()
    @IsString({ message: '사용자 이름 문자여야 합니다' })
    @Transform(({ value }) => value?.trim())
    readonly username?: string;

    @ApiPropertyOptional({
        description: '이메일 주소',
        example: 'woo.mh@lumir.space',
        format: 'email',
    })
    @IsOptional()
    @IsEmail({}, { message: '효과적인 이메일 주소를 입력해주세요' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    readonly email?: string;

    @ApiPropertyOptional({
        description: '사용자 권한 목록',
        example: ['SYSTEM_USER', 'ATTENDANCE_USER', 'PROJECT_USER', 'LRIM_USER'],
        type: [String],
        enum: UserRole,
    })
    @IsOptional()
    @IsArray({ message: '권한 배열 타입이어야 합니다' })
    @IsEnum(UserRole, { each: true, message: '효과적인 권한을 선택해주세요' })
    readonly roles?: UserRole[];

    @ApiPropertyOptional({
        description: '계정 상태',
        example: true,
    })
    @IsOptional()
    @IsBoolean({ message: '상태 boolean 값이어야 합니다' })
    readonly isActive?: boolean;

    @ApiPropertyOptional({
        description: '통합 계정 상태',
        example: true,
    })
    @IsOptional()
    @IsBoolean({ message: '통합 계정 상태 boolean 값이어야 합니다' })
    readonly isIntegrated?: boolean;
}
