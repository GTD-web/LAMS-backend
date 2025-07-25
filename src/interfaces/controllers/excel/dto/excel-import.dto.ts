import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';

/**
 * Excel 파일 업로드 및 프로세스 생성 DTO
 */
export class CreateExcelImportProcessDto {
    @ApiProperty({
        description: '처리할 연도',
        example: '2024',
    })
    @IsNotEmpty({ message: '연도는 필수입니다.' })
    @IsString({ message: '연도는 문자열이어야 합니다.' })
    readonly year: string;

    @ApiProperty({
        description: '처리할 월',
        example: '01',
    })
    @IsNotEmpty({ message: '월은 필수입니다.' })
    @IsString({ message: '월은 문자열이어야 합니다.' })
    readonly month: string;

    @ApiPropertyOptional({
        description: '출입 이벤트 파일 ID',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    })
    @IsOptional()
    @IsUUID(4, { message: '유효한 UUID 형식이어야 합니다.' })
    readonly eventInfoFileId?: string;

    @ApiPropertyOptional({
        description: '근태 사용 파일 ID',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    })
    @IsOptional()
    @IsUUID(4, { message: '유효한 UUID 형식이어야 합니다.' })
    readonly usedAttendanceFileId?: string;
}

/**
 * Excel import process 저장 DTO
 */
export class SaveExcelImportProcessDto {
    @ApiProperty({
        description: 'Excel import process ID',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    })
    @IsNotEmpty({ message: 'Excel import process ID는 필수입니다.' })
    @IsUUID(4, { message: '유효한 UUID 형식이어야 합니다.' })
    readonly excelImportProcessId: string;

    @ApiProperty({
        description: '프로세스 상태',
        example: 'READYTOAPPLY',
        enum: ['PENDING', 'PROCESSING', 'READYTOAPPLY', 'COMPLETED', 'FAILED'],
    })
    @IsNotEmpty({ message: '상태는 필수입니다.' })
    @IsEnum(['PENDING', 'PROCESSING', 'READYTOAPPLY', 'COMPLETED', 'FAILED'], {
        message: '유효한 상태값이어야 합니다.',
    })
    readonly status: string;

    @ApiProperty({
        description: '부서 정보 JSON',
        example: {
            extractedDepartments: [],
            undefinedDepartments: [],
            departments: [],
            newDepartments: [],
        },
    })
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
    readonly employeeInfoJson: any;

    @ApiProperty({
        description: '데이터 JSON',
        example: {
            extractedExcelDataWithoutEventAndAttendanceList: [],
            selectedDataList: [],
        },
    })
    readonly dataJson: any;
}

/**
 * Excel import process 적용 DTO
 */
export class ApplyExcelImportProcessDto {
    @ApiProperty({
        description: 'Excel import process ID',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    })
    @IsNotEmpty({ message: 'Excel import process ID는 필수입니다.' })
    @IsUUID(4, { message: '유효한 UUID 형식이어야 합니다.' })
    readonly excelImportProcessId: string;
}
