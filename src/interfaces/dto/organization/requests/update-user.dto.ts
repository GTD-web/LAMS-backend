import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsString, IsBoolean, IsArray, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../../../../domain/user/enum/user.enum';

/**
 * ?�용???�데?�트 ?�청 DTO
 */
export class UpdateUserDto {
    @ApiPropertyOptional({
        description: '?�용?�명',
        example: '?�이??,
    })
    @IsOptional()
    @IsString({ message: '?�용?�명?� 문자?�이?�야 ?�니?? })
    @Transform(({ value }) => value?.trim())
    readonly username?: string;

    @ApiPropertyOptional({
        description: '?�메??주소',
        example: 'woo.mh@lumir.space',
        format: 'email',
    })
    @IsOptional()
    @IsEmail({}, { message: '?�효???�메??주소�??�력?�주?�요' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    readonly email?: string;

    @ApiPropertyOptional({
        description: '?�용??권한 목록',
        example: ['SYSTEM_USER', 'ATTENDANCE_USER', 'PROJECT_USER', 'LRIM_USER'],
        type: [String],
        enum: UserRole,
    })
    @IsOptional()
    @IsArray({ message: '권한?� 배열 ?�태?�야 ?�니?? })
    @IsEnum(UserRole, { each: true, message: '?�효??권한???�택?�주?�요' })
    readonly roles?: UserRole[];

    @ApiPropertyOptional({
        description: '계정 ?�성???�태',
        example: true,
    })
    @IsOptional()
    @IsBoolean({ message: '?�성???�태??boolean 값이?�야 ?�니?? })
    readonly isActive?: boolean;

    @ApiPropertyOptional({
        description: '?�합 계정 ?��?',
        example: true,
    })
    @IsOptional()
    @IsBoolean({ message: '?�합 계정 ?��???boolean 값이?�야 ?�니?? })
    readonly isIntegrated?: boolean;
}
