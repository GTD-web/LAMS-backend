import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsArray,
    IsBoolean,
    IsOptional,
    MinLength,
    ArrayNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../../../../domain/user/enum/user.enum';

/**
 * 사용자 생성 요청 DTO
 */
export class CreateUserDto {
    @ApiProperty({
        description: '사용자 이름',
        example: '홍길동',
        minLength: 2,
        maxLength: 50,
    })
    @IsString({ message: '사용자 이름은 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '사용자 이름은 필수입니다.' })
    @Transform(({ value }) => value?.trim())
    readonly username: string;

    @ApiProperty({
        description: '이메일 주소',
        example: 'hong@example.com',
        format: 'email',
        uniqueItems: true,
    })
    @IsEmail({}, { message: '올바른 이메일 형식이어야 합니다.' })
    @IsNotEmpty({ message: '이메일은 필수입니다.' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    readonly email: string;

    @ApiProperty({
        description: '비밀번호',
        example: 'securePassword123!',
        minLength: 8,
        format: 'password',
    })
    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    readonly password: string;

    @ApiProperty({
        description: '사용자 권한 목록',
        example: ['SYSTEM_USER', 'ATTENDANCE_USER'],
        type: [String],
        enum: UserRole,
        isArray: true,
        default: ['ATTENDANCE_USER', 'SYSTEM_USER'],
        required: false,
    })
    @IsOptional()
    @IsArray({ message: '권한은 배열이어야 합니다.' })
    @IsString({ each: true, message: '각 권한은 문자열이어야 합니다.' })
    readonly roles?: UserRole[] = [UserRole.ATTENDANCE_USER, UserRole.SYSTEM_USER];

    @ApiProperty({
        description: '계정 활성 여부',
        example: true,
        default: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: '활성 여부는 불린 값이어야 합니다.' })
    readonly isActive?: boolean = true;
}
