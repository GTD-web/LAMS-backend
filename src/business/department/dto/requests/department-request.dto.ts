import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length, IsUUID, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * 부서 생성 요청 DTO
 */
export class CreateDepartmentDto {
    @ApiProperty({
        description: '부서명',
        example: '개발팀',
        minLength: 2,
        maxLength: 100,
    })
    @IsString({ message: '부서명은 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '부서명은 필수입니다.' })
    @Length(2, 100, { message: '부서명은 2자 이상 100자 이하여야 합니다.' })
    @Transform(({ value }) => value?.trim())
    readonly departmentName: string;

    @ApiPropertyOptional({
        description: '부서 코드',
        example: 'DEV001',
        minLength: 2,
        maxLength: 20,
    })
    @IsOptional()
    @IsString({ message: '부서 코드는 문자열이어야 합니다.' })
    @Length(2, 20, { message: '부서 코드는 2자 이상 20자 이하여야 합니다.' })
    @Transform(({ value }) => value?.trim())
    readonly departmentCode?: string;

    @ApiPropertyOptional({
        description: '상위 부서 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsOptional()
    @IsString({ message: '상위 부서 ID는 문자열이어야 합니다.' })
    readonly parentDepartmentId?: string;

    @ApiPropertyOptional({
        description: '부서 설명',
        example: '소프트웨어 개발을 담당하는 부서',
        maxLength: 500,
    })
    @IsOptional()
    @IsString({ message: '부서 설명은 문자열이어야 합니다.' })
    @Length(0, 500, { message: '부서 설명은 500자 이하여야 합니다.' })
    @Transform(({ value }) => value?.trim())
    readonly description?: string;
}

/**
 * 부서 수정 요청 DTO
 */
export class UpdateDepartmentDto {
    @ApiPropertyOptional({
        description: '부서명',
        example: '개발팀',
        minLength: 2,
        maxLength: 100,
    })
    @IsOptional()
    @IsString({ message: '부서명은 문자열이어야 합니다.' })
    @Length(2, 100, { message: '부서명은 2자 이상 100자 이하여야 합니다.' })
    @Transform(({ value }) => value?.trim())
    readonly departmentName?: string;

    @ApiPropertyOptional({
        description: '부서 코드',
        example: 'DEV001',
        minLength: 2,
        maxLength: 20,
    })
    @IsOptional()
    @IsString({ message: '부서 코드는 문자열이어야 합니다.' })
    @Length(2, 20, { message: '부서 코드는 2자 이상 20자 이하여야 합니다.' })
    @Transform(({ value }) => value?.trim())
    readonly departmentCode?: string;

    @ApiPropertyOptional({
        description: '상위 부서 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @IsOptional()
    @IsString({ message: '상위 부서 ID는 문자열이어야 합니다.' })
    readonly parentDepartmentId?: string;

    @ApiPropertyOptional({
        description: '부서 설명',
        example: '소프트웨어 개발을 담당하는 부서',
        maxLength: 500,
    })
    @IsOptional()
    @IsString({ message: '부서 설명은 문자열이어야 합니다.' })
    @Length(0, 500, { message: '부서 설명은 500자 이하여야 합니다.' })
    @Transform(({ value }) => value?.trim())
    readonly description?: string;
}

/**
 * 부서 권한 관리 요청 DTO
 */
export class DepartmentAuthorityDto {
    @ApiProperty({
        description: '사용자 ID',
        example: 'user-uuid-v4-string',
        format: 'uuid',
    })
    @IsUUID('4', { message: '사용자 ID는 유효한 UUID여야 합니다.' })
    @IsNotEmpty({ message: '사용자 ID는 필수입니다.' })
    readonly userId: string;
}

/**
 * 부서 검색 요청 DTO
 */
export class SearchDepartmentDto {
    @ApiProperty({
        description: '검색어',
        example: '개발',
        minLength: 1,
        maxLength: 100,
    })
    @IsString({ message: '검색어는 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '검색어는 필수입니다.' })
    @Length(1, 100, { message: '검색어는 1자 이상 100자 이하여야 합니다.' })
    @Transform(({ value }) => value?.trim())
    readonly searchTerm: string;

    @ApiPropertyOptional({
        description: '사용자 ID (권한 필터링용)',
        example: 'user-uuid-v4-string',
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID('4', { message: '사용자 ID는 유효한 UUID여야 합니다.' })
    readonly userId?: string;
}

/**
 * 부서 계층 구조 요청 DTO
 */
export class DepartmentHierarchyDto {
    @ApiPropertyOptional({
        description: '기준 부서 ID (미지정시 최상위부터)',
        example: 'dept-uuid-v4-string',
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID('4', { message: '부서 ID는 유효한 UUID여야 합니다.' })
    readonly departmentId?: string;

    @ApiPropertyOptional({
        description: '하위 부서 포함 여부',
        example: true,
        default: true,
    })
    @IsOptional()
    @IsBoolean({ message: '하위 부서 포함 여부는 boolean 값이어야 합니다.' })
    readonly includeChildren?: boolean = true;

    @ApiPropertyOptional({
        description: '직원 정보 포함 여부',
        example: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean({ message: '직원 정보 포함 여부는 boolean 값이어야 합니다.' })
    readonly includeEmployees?: boolean = false;
}
