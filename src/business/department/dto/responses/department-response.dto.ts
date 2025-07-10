import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/**
 * 부서 응답 DTO
 */
@Exclude()
export class DepartmentResponseDto {
    @ApiProperty({
        description: '부서 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    readonly departmentId: string;

    @ApiProperty({
        description: '부서명',
        example: '개발팀',
    })
    @Expose()
    readonly departmentName: string;

    @ApiPropertyOptional({
        description: '부서 코드',
        example: 'DEV001',
    })
    @Expose()
    readonly departmentCode?: string;

    @ApiPropertyOptional({
        description: 'MMS 부서 ID',
        example: 'mms-dept-001',
    })
    @Expose()
    readonly mmsDepartmentId?: string;

    @ApiProperty({
        description: '제외 여부',
        example: false,
    })
    @Expose()
    readonly isExclude: boolean;

    @ApiPropertyOptional({
        description: '상위 부서 ID',
        example: 'parent-uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    readonly parentDepartmentId?: string;

    @ApiPropertyOptional({
        description: '조직도 정보 ID',
        example: 'org-chart-uuid-v4-string',
        format: 'uuid',
    })
    @Expose()
    readonly orgChartInfoId?: string;

    @ApiProperty({
        description: '생성일시',
        example: '2023-12-01T10:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly createdAt: Date;

    @ApiProperty({
        description: '수정일시',
        example: '2023-12-01T10:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly updatedAt: Date;

    constructor(partial: Partial<DepartmentResponseDto>) {
        Object.assign(this, partial);
    }
}

/**
 * 부서 상세 응답 DTO (권한 정보 포함)
 */
@Exclude()
export class DepartmentDetailResponseDto extends DepartmentResponseDto {
    @ApiProperty({
        description: '접근 권한 사용자 수',
        example: 5,
    })
    @Expose()
    readonly accessAuthorityCount: number;

    @ApiProperty({
        description: '검토 권한 사용자 수',
        example: 2,
    })
    @Expose()
    readonly reviewAuthorityCount: number;

    @ApiProperty({
        description: '부서 직원 수',
        example: 10,
    })
    @Expose()
    readonly employeeCount: number;

    @ApiPropertyOptional({
        description: '하위 부서 목록',
        type: [DepartmentResponseDto],
    })
    @Expose()
    @Type(() => DepartmentResponseDto)
    readonly children?: DepartmentResponseDto[];

    constructor(department: any, employees?: any[], accessAuthorities?: any[], reviewAuthorities?: any[]) {
        super(department);
        this.accessAuthorityCount = accessAuthorities?.length || 0;
        this.reviewAuthorityCount = reviewAuthorities?.length || 0;
        this.employeeCount = employees?.length || 0;
    }
}

/**
 * 부서 목록 응답 DTO
 */
export class DepartmentListResponseDto {
    @ApiProperty({
        description: '부서 목록',
        type: [DepartmentResponseDto],
    })
    @Type(() => DepartmentResponseDto)
    readonly departments: DepartmentResponseDto[];

    @ApiProperty({
        description: '전체 부서 수',
        example: 50,
    })
    readonly total: number;

    constructor(departments: DepartmentResponseDto[], total: number, page?: number, limit?: number) {
        this.departments = departments;
        this.total = total;
    }
}

/**
 * MMS 동기화 결과 응답 DTO
 */
export class MMSSyncResponseDto {
    @ApiProperty({
        description: '동기화 성공 건수',
        example: 45,
    })
    readonly syncedCount: number;

    @ApiProperty({
        description: '동기화 실패 건수',
        example: 5,
    })
    readonly errorCount: number;

    @ApiProperty({
        description: '동기화 완료 시간',
        example: '2023-12-01T10:00:00Z',
        format: 'date-time',
    })
    readonly completedAt: Date;

    constructor(syncedCount: number, errorCount: number) {
        this.syncedCount = syncedCount;
        this.errorCount = errorCount;
        this.completedAt = new Date();
    }
}

/**
 * 부서 상태 응답 DTO
 */
export class DepartmentStatusResponseDto {
    @ApiProperty({
        description: '부서 활성 상태',
        example: true,
    })
    readonly isActive: boolean;

    @ApiProperty({
        description: '부서 제외 상태',
        example: false,
    })
    readonly isExcluded: boolean;

    @ApiProperty({
        description: '부서 직원 수',
        example: 10,
    })
    readonly employeeCount: number;

    @ApiProperty({
        description: '하위 부서 존재 여부',
        example: true,
    })
    readonly hasChildren: boolean;

    constructor(partial: Partial<DepartmentStatusResponseDto>) {
        Object.assign(this, partial);
    }
}
