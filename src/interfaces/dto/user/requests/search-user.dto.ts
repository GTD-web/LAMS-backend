import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, Length, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * 사용자 검색 요청 DTO
 */
export class SearchUserDto {
    @ApiPropertyOptional({
        description: '사용자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID(4, { message: '올바른 UUID 형식이어야 합니다.' })
    readonly userId?: string;

    @ApiPropertyOptional({
        description: '사용자 이메일',
        example: 'user@example.com',
        format: 'email',
    })
    @IsOptional()
    @IsEmail({}, { message: '올바른 이메일 형식이어야 합니다.' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    readonly email?: string;

    @ApiPropertyOptional({
        description: '사용자 이름',
        example: '김철수',
        minLength: 2,
        maxLength: 50,
    })
    @IsOptional()
    @IsString({ message: '이름은 문자열이어야 합니다.' })
    @Length(2, 50, { message: '이름은 2자 이상 50자 이하여야 합니다.' })
    @Transform(({ value }) => value?.trim())
    readonly name?: string;

    @ApiPropertyOptional({
        description: '로그인 ID',
        example: 'user123',
        minLength: 3,
        maxLength: 30,
    })
    @IsOptional()
    @IsString({ message: '로그인 ID는 문자열이어야 합니다.' })
    @Length(3, 30, { message: '로그인 ID는 3자 이상 30자 이하여야 합니다.' })
    @Transform(({ value }) => value?.trim())
    readonly loginId?: string;

    @ApiPropertyOptional({
        description: '검색 키워드 (이름, 이메일, 로그인 ID 통합 검색)',
        example: '김철수',
        minLength: 2,
        maxLength: 100,
    })
    @IsOptional()
    @IsString({ message: '검색 키워드는 문자열이어야 합니다.' })
    @Length(2, 100, { message: '검색 키워드는 2자 이상 100자 이하여야 합니다.' })
    @Transform(({ value }) => value?.trim())
    readonly keyword?: string;
}
