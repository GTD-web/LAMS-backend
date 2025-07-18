import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsString, IsBoolean, IsArray, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../../../../domain/user/enum/user.enum';

/**
 * ?¬ìš©???…ë°?´íŠ¸ ?”ì²­ DTO
 */
export class UpdateUserDto {
    @ApiPropertyOptional({
        description: '?¬ìš©?ëª…',
        example: '?´ì´??,
    })
    @IsOptional()
    @IsString({ message: '?¬ìš©?ëª…?€ ë¬¸ì?´ì´?´ì•¼ ?©ë‹ˆ?? })
    @Transform(({ value }) => value?.trim())
    readonly username?: string;

    @ApiPropertyOptional({
        description: '?´ë©”??ì£¼ì†Œ',
        example: 'woo.mh@lumir.space',
        format: 'email',
    })
    @IsOptional()
    @IsEmail({}, { message: '? íš¨???´ë©”??ì£¼ì†Œë¥??…ë ¥?´ì£¼?¸ìš”' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    readonly email?: string;

    @ApiPropertyOptional({
        description: '?¬ìš©??ê¶Œí•œ ëª©ë¡',
        example: ['SYSTEM_USER', 'ATTENDANCE_USER', 'PROJECT_USER', 'LRIM_USER'],
        type: [String],
        enum: UserRole,
    })
    @IsOptional()
    @IsArray({ message: 'ê¶Œí•œ?€ ë°°ì—´ ?•íƒœ?¬ì•¼ ?©ë‹ˆ?? })
    @IsEnum(UserRole, { each: true, message: '? íš¨??ê¶Œí•œ??? íƒ?´ì£¼?¸ìš”' })
    readonly roles?: UserRole[];

    @ApiPropertyOptional({
        description: 'ê³„ì • ?œì„±???íƒœ',
        example: true,
    })
    @IsOptional()
    @IsBoolean({ message: '?œì„±???íƒœ??boolean ê°’ì´?´ì•¼ ?©ë‹ˆ?? })
    readonly isActive?: boolean;

    @ApiPropertyOptional({
        description: '?µí•© ê³„ì • ?¬ë?',
        example: true,
    })
    @IsOptional()
    @IsBoolean({ message: '?µí•© ê³„ì • ?¬ë???boolean ê°’ì´?´ì•¼ ?©ë‹ˆ?? })
    readonly isIntegrated?: boolean;
}
