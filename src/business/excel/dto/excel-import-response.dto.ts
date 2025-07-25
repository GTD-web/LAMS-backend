import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/**
 * Excel import process 생성 응답 DTO
 */
@Exclude()
export class ExcelImportProcessCreateResponseDto {
    @ApiProperty({
        description: 'Excel import process ID',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    })
    @Expose()
    readonly excelImportProcessId: string;

    @ApiProperty({
        description: '프로세스 상태',
        example: 'PENDING',
        enum: ['PENDING', 'PROCESSING', 'READYTOAPPLY', 'COMPLETED', 'FAILED'],
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
        description: '출입 이벤트 파일 ID',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        nullable: true,
    })
    @Expose()
    readonly eventInfoFileId?: string;

    @ApiProperty({
        description: '근태 사용 파일 ID',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        nullable: true,
    })
    @Expose()
    readonly usedAttendanceFileId?: string;

    @ApiProperty({
        description: '부서 정보 JSON',
        example: {
            extractedDepartments: [],
            undefinedDepartments: [],
            departments: [],
            newDepartments: [],
        },
    })
    @Expose()
    readonly departmentInfoJson: any;

    @ApiProperty({
        description: '직원 정보 JSON',
        example: {
            tempEnteredEmployeeInfoList: [],
            tempExitedEmployeeInfoList: [],
            enteredEmployeeInfoList: [],
            exitedEmployeeInfoList: [],
        },
    })
    @Expose()
    readonly employeeInfoJson: any;

    @ApiProperty({
        description: '데이터 JSON',
        example: {
            extractedExcelDataWithoutEventAndAttendanceList: [],
            selectedDataList: [],
        },
    })
    @Expose()
    readonly dataJson: any;

    @ApiProperty({
        description: '생성 시간',
        example: '2024-01-01T00:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly createdAt: Date;

    @ApiProperty({
        description: '처리 결과 메시지',
        example: 'Excel import process가 성공적으로 생성되었습니다.',
    })
    @Expose()
    readonly message: string;

    constructor(data: {
        excelImportProcessId: string;
        status: string;
        year: string;
        month: string;
        eventInfoFileId?: string;
        usedAttendanceFileId?: string;
        departmentInfoJson: any;
        employeeInfoJson: any;
        dataJson: any;
        createdAt: Date;
        message: string;
    }) {
        Object.assign(this, data);
    }
}

/**
 * Excel import process 조회 응답 DTO
 */
@Exclude()
export class ExcelImportProcessResponseDto {
    @ApiProperty({
        description: 'Excel import process ID',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    })
    @Expose()
    readonly excelImportProcessId: string;

    @ApiProperty({
        description: '프로세스 상태',
        example: 'PENDING',
        enum: ['PENDING', 'PROCESSING', 'READYTOAPPLY', 'COMPLETED', 'FAILED'],
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
        description: '출입 이벤트 파일 ID',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        nullable: true,
    })
    @Expose()
    readonly eventInfoFileId?: string;

    @ApiProperty({
        description: '근태 사용 파일 ID',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        nullable: true,
    })
    @Expose()
    readonly usedAttendanceFileId?: string;

    @ApiProperty({
        description: '부서 정보 JSON',
        example: {
            extractedDepartments: [],
            undefinedDepartments: [],
            departments: [],
            newDepartments: [],
        },
    })
    @Expose()
    readonly departmentInfoJson: any;

    @ApiProperty({
        description: '직원 정보 JSON',
        example: {
            tempEnteredEmployeeInfoList: [],
            tempExitedEmployeeInfoList: [],
            enteredEmployeeInfoList: [],
            exitedEmployeeInfoList: [],
        },
    })
    @Expose()
    readonly employeeInfoJson: any;

    @ApiProperty({
        description: '데이터 JSON',
        example: {
            extractedExcelDataWithoutEventAndAttendanceList: [],
            selectedDataList: [],
        },
    })
    @Expose()
    readonly dataJson: any;

    @ApiProperty({
        description: '생성 시간',
        example: '2024-01-01T00:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly createdAt: Date;

    constructor(data: {
        excelImportProcessId: string;
        status: string;
        year: string;
        month: string;
        eventInfoFileId?: string;
        usedAttendanceFileId?: string;
        departmentInfoJson: any;
        employeeInfoJson: any;
        dataJson: any;
        createdAt: Date;
    }) {
        Object.assign(this, data);
    }
}

/**
 * Excel import process 적용 응답 DTO
 */
@Exclude()
export class ExcelImportProcessApplyResponseDto {
    @ApiProperty({
        description: 'Excel import process ID',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    })
    @Expose()
    readonly excelImportProcessId: string;

    @ApiProperty({
        description: '프로세스 상태',
        example: 'COMPLETED',
        enum: ['PENDING', 'PROCESSING', 'READYTOAPPLY', 'COMPLETED', 'FAILED'],
    })
    @Expose()
    readonly status: string;

    @ApiProperty({
        description: '적용 완료 시간',
        example: '2024-01-01T00:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly appliedAt: Date;

    @ApiProperty({
        description: '처리 결과 메시지',
        example: 'Excel import process가 성공적으로 적용되었습니다.',
    })
    @Expose()
    readonly message: string;

    constructor(data: { excelImportProcessId: string; status: string; message: string }) {
        this.excelImportProcessId = data.excelImportProcessId;
        this.status = data.status;
        this.message = data.message;
        this.appliedAt = new Date();
    }
}

/**
 * Excel import process 삭제 응답 DTO
 */
@Exclude()
export class ExcelImportProcessDeleteResponseDto {
    @ApiProperty({
        description: 'Excel import process ID',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    })
    @Expose()
    readonly excelImportProcessId: string;

    @ApiProperty({
        description: '삭제 완료 시간',
        example: '2024-01-01T00:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly deletedAt: Date;

    @ApiProperty({
        description: '처리 결과 메시지',
        example: 'Excel import process가 성공적으로 삭제되었습니다.',
    })
    @Expose()
    readonly message: string;

    constructor(data: { excelImportProcessId: string; message: string }) {
        this.excelImportProcessId = data.excelImportProcessId;
        this.message = data.message;
        this.deletedAt = new Date();
    }
}
