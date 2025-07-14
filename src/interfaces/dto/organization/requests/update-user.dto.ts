import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsString, IsBoolean, IsArray, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../../../../domain/user/enum/user.enum';

/**
 * 사용자 업데이트 요청 DTO
 */
export class UpdateUserDto {
    @ApiPropertyOptional({
        description: '사용자명',
        example: '우무현',
    })
    @IsOptional()
    @IsString({ message: '사용자명은 문자열이어야 합니다' })
    @Transform(({ value }) => value?.trim())
    readonly username?: string;

    @ApiPropertyOptional({
        description: '이메일 주소',
        example: 'woo.mh@lumir.space',
        format: 'email',
    })
    @IsOptional()
    @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    readonly email?: string;

    @ApiPropertyOptional({
        description: '사용자 권한 목록',
        example: ['SYSTEM_USER', 'ATTENDANCE_USER', 'PROJECT_USER', 'LRIM_USER'],
        type: [String],
        enum: UserRole,
    })
    @IsOptional()
    @IsArray({ message: '권한은 배열 형태여야 합니다' })
    @IsEnum(UserRole, { each: true, message: '유효한 권한을 선택해주세요' })
    readonly roles?: UserRole[];

    @ApiPropertyOptional({
        description: '계정 활성화 상태',
        example: true,
    })
    @IsOptional()
    @IsBoolean({ message: '활성화 상태는 boolean 값이어야 합니다' })
    readonly isActive?: boolean;

    @ApiPropertyOptional({
        description: '통합 계정 여부',
        example: true,
    })
    @IsOptional()
    @IsBoolean({ message: '통합 계정 여부는 boolean 값이어야 합니다' })
    readonly isIntegrated?: boolean;

    @ApiPropertyOptional({
        description: '평가자 권한 여부',
        example: true,
    })
    @IsOptional()
    @IsBoolean({ message: '평가자 권한은 boolean 값이어야 합니다' })
    readonly isEvaluator?: boolean;

    @ApiPropertyOptional({
        description: '면접관 권한 여부',
        example: true,
    })
    @IsOptional()
    @IsBoolean({ message: '면접관 권한은 boolean 값이어야 합니다' })
    readonly isInterviewer?: boolean;

    @ApiPropertyOptional({
        description: '필수 알림 대상 여부',
        example: false,
    })
    @IsOptional()
    @IsBoolean({ message: '필수 알림 대상 여부는 boolean 값이어야 합니다' })
    readonly isRequiredNotifier?: boolean;
}
