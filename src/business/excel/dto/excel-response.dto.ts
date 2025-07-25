import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/**
 * 엑셀 파일 읽기 응답 DTO
 */
@Exclude()
export class ExcelReadResponseDto {
    @ApiProperty({
        description: '엑셀 데이터',
        type: 'array',
        items: { type: 'object' },
    })
    @Expose()
    readonly data: any[];

    @ApiProperty({
        description: '처리 결과 메시지',
        example: '엑셀 파일 읽기가 완료되었습니다.',
    })
    @Expose()
    readonly message: string;

    constructor(data: { data: any[]; message: string }) {
        this.data = data.data;
        this.message = data.message;
    }
}

/**
 * 출입 이벤트 엑셀 처리 응답 DTO
 */
@Exclude()
export class EventHistoriesProcessResponseDto {
    @ApiProperty({
        description: '처리 결과 메시지',
        example: '출입 이벤트 엑셀 파일 처리가 완료되었습니다.',
    })
    @Expose()
    readonly message: string;

    @ApiProperty({
        description: '처리된 직원 수',
        example: 150,
        type: 'integer',
    })
    @Expose()
    readonly processedEmployees: number;

    @ApiProperty({
        description: '처리된 이벤트 수',
        example: 3500,
        type: 'integer',
    })
    @Expose()
    readonly processedEvents: number;

    @ApiProperty({
        description: '처리 연도',
        example: '2024',
    })
    @Expose()
    readonly year: string;

    @ApiProperty({
        description: '처리 월',
        example: '01',
    })
    @Expose()
    readonly month: string;

    @ApiProperty({
        description: '처리 완료 시간',
        example: '2024-01-01T00:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly processedAt: string;

    constructor(data: {
        message: string;
        processedEmployees: number;
        processedEvents: number;
        year: string;
        month: string;
    }) {
        this.message = data.message;
        this.processedEmployees = data.processedEmployees;
        this.processedEvents = data.processedEvents;
        this.year = data.year;
        this.month = data.month;
        this.processedAt = new Date().toISOString();
    }
}

/**
 * 근태 엑셀 처리 응답 DTO
 */
@Exclude()
export class AttendanceProcessResponseDto {
    @ApiProperty({
        description: '처리 결과 메시지',
        example: '근태 엑셀 파일 처리가 완료되었습니다.',
    })
    @Expose()
    readonly message: string;

    @ApiProperty({
        description: '처리된 직원 수',
        example: 150,
        type: 'integer',
    })
    @Expose()
    readonly processedEmployees: number;

    @ApiProperty({
        description: '처리된 부서 수',
        example: 25,
        type: 'integer',
    })
    @Expose()
    readonly processedDepartments: number;

    @ApiProperty({
        description: '처리 연도',
        example: '2024',
    })
    @Expose()
    readonly year: string;

    @ApiProperty({
        description: '처리 월',
        example: '01',
    })
    @Expose()
    readonly month: string;

    @ApiProperty({
        description: '처리 완료 시간',
        example: '2024-01-01T00:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly processedAt: string;

    constructor(data: {
        message: string;
        processedEmployees: number;
        processedDepartments: number;
        year: string;
        month: string;
    }) {
        this.message = data.message;
        this.processedEmployees = data.processedEmployees;
        this.processedDepartments = data.processedDepartments;
        this.year = data.year;
        this.month = data.month;
        this.processedAt = new Date().toISOString();
    }
}

/**
 * 엑셀 임포트 프로세스 생성 응답 DTO
 */
@Exclude()
export class ExcelImportProcessCreateResponseDto {
    @ApiProperty({
        description: '프로세스 ID',
        example: 'process-1704067200000',
    })
    @Expose()
    readonly processId: string;

    @ApiProperty({
        description: '생성 결과 메시지',
        example: '엑셀 임포트 프로세스가 생성되었습니다.',
    })
    @Expose()
    readonly message: string;

    @ApiProperty({
        description: '프로세스 상태',
        example: 'PENDING',
        enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
    })
    @Expose()
    readonly status: string;

    @ApiProperty({
        description: '생성 시간',
        example: '2024-01-01T00:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly createdAt: string;

    constructor(data: { processId: string; message: string; status: string }) {
        this.processId = data.processId;
        this.message = data.message;
        this.status = data.status;
        this.createdAt = new Date().toISOString();
    }
}

/**
 * 엑셀 임포트 프로세스 적용 응답 DTO
 */
@Exclude()
export class ExcelImportProcessApplyResponseDto {
    @ApiProperty({
        description: '적용 결과 메시지',
        example: '엑셀 임포트 프로세스가 성공적으로 적용되었습니다.',
    })
    @Expose()
    readonly message: string;

    @ApiProperty({
        description: '프로세스 ID',
        example: 'process-1704067200000',
    })
    @Expose()
    readonly processId: string;

    @ApiProperty({
        description: '프로세스 상태',
        example: 'COMPLETED',
        enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
    })
    @Expose()
    readonly status: string;

    @ApiProperty({
        description: '적용 완료 시간',
        example: '2024-01-01T00:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly appliedAt: string;

    constructor(data: { message: string; processId: string; status: string; appliedAt: string }) {
        this.message = data.message;
        this.processId = data.processId;
        this.status = data.status;
        this.appliedAt = data.appliedAt;
    }
}

/**
 * 엑셀 임포트 프로세스 조회 응답 DTO
 */
@Exclude()
export class ExcelImportProcessResponseDto {
    @ApiProperty({
        description: '프로세스 ID',
        example: 'process-user123-2024-01',
    })
    @Expose()
    readonly processId: string;

    @ApiProperty({
        description: '프로세스 상태',
        example: 'PENDING',
        enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
    })
    @Expose()
    readonly status: string;

    @ApiProperty({
        description: '처리 연도',
        example: '2024',
    })
    @Expose()
    readonly year: string;

    @ApiProperty({
        description: '처리 월',
        example: '01',
    })
    @Expose()
    readonly month: string;

    @ApiProperty({
        description: '생성 시간',
        example: '2024-01-01T00:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly createdAt: string;

    constructor(data: { processId: string; status: string; year: string; month: string; createdAt: string }) {
        this.processId = data.processId;
        this.status = data.status;
        this.year = data.year;
        this.month = data.month;
        this.createdAt = data.createdAt;
    }
}
