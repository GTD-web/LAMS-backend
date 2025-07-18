import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 조직도 직원 정보 DTO
 */
export class OrganizationEmployeeDto {
    @ApiProperty({
        description: '직원 ID',
        example: 'emp-123',
    })
    @IsString()
    @IsNotEmpty()
    employeeId: string;

    @ApiPropertyOptional({
        description: '직원 이름',
        example: '홍길동',
    })
    @IsString()
    @IsOptional()
    employeeName?: string;
}

/**
 * 조직도 저장 요청 DTO
 */
export class SaveOrganizationDto {
    @ApiPropertyOptional({
        description: '부서 ID (신규 생성시 생략 가능)',
        example: 'dept-123',
    })
    @IsString()
    @IsOptional()
    id?: string;

    @ApiProperty({
        description: '부서명',
        example: '개발팀',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: '지원 부서 여부',
        example: false,
    })
    @IsBoolean()
    isSupport: boolean;

    @ApiPropertyOptional({
        description: '상위 부서 ID',
        example: 'dept-parent-123',
    })
    @IsString()
    @IsOptional()
    parentId?: string;

    @ApiPropertyOptional({
        description: '부서 소속 직원 목록',
        type: [OrganizationEmployeeDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrganizationEmployeeDto)
    @IsOptional()
    employees?: OrganizationEmployeeDto[];

    @ApiPropertyOptional({
        description: '하위 부서 목록',
        type: [SaveOrganizationDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SaveOrganizationDto)
    @IsOptional()
    children?: SaveOrganizationDto[];
}

/**
 * 조직도 트리 응답 DTO
 */
export class OrganizationTreeResponseDto {
    @ApiProperty({
        description: '부서 ID',
        example: 'dept-123',
    })
    id: string;

    @ApiProperty({
        description: '부서명',
        example: '개발팀',
    })
    name: string;

    @ApiProperty({
        description: '지원 부서 여부',
        example: false,
    })
    isSupport: boolean;

    @ApiPropertyOptional({
        description: '상위 부서 ID',
        example: 'dept-parent-123',
    })
    parentId?: string;

    @ApiProperty({
        description: '부서 소속 직원 목록',
        type: [OrganizationEmployeeDto],
    })
    employees: OrganizationEmployeeDto[];

    @ApiProperty({
        description: '하위 부서 목록',
        type: [OrganizationTreeResponseDto],
    })
    children: OrganizationTreeResponseDto[];

    constructor(
        id: string,
        name: string,
        isSupport: boolean,
        parentId: string | undefined,
        employees: OrganizationEmployeeDto[],
        children: OrganizationTreeResponseDto[],
    ) {
        this.id = id;
        this.name = name;
        this.isSupport = isSupport;
        this.parentId = parentId;
        this.employees = employees;
        this.children = children;
    }
}
