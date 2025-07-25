import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFiles,
    ParseUUIDPipe,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam,
    ApiQuery,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiInternalServerErrorResponse,
    ApiConsumes,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { UserEntity } from '../../../domain/user/entities/user.entity';
import { ExcelBusinessService } from '../../../business/excel/excel.business';
import {
    CreateExcelImportProcessDto,
    SaveExcelImportProcessDto,
    ApplyExcelImportProcessDto,
} from './dto/excel-import.dto';
import {
    ExcelImportProcessCreateResponseDto,
    ExcelImportProcessResponseDto,
    ExcelImportProcessApplyResponseDto,
    ExcelImportProcessDeleteResponseDto,
} from '../../../business/excel/dto/excel-import-response.dto';
import { ErrorResponseDto } from '../../../common/dtos/common/error-response.dto';

/**
 * Excel Import Process 컨트롤러
 * - Excel 파일 업로드 및 import process 관리
 * - 중간 진행 상황 저장 및 삭제 기능
 */
@ApiTags('excel-import')
@Controller({ path: 'excel-import', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ExcelController {
    constructor(private readonly excelBusinessService: ExcelBusinessService) {}

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files', 2)) // 최대 2개 파일 (eventInfo, usedAttendance)
    @ApiOperation({
        summary: 'Excel 파일 업로드 및 import process 생성',
        description: '출입 이벤트 파일과 근태 사용 파일을 업로드하여 Excel import process를 생성합니다.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'Excel 파일들 (최대 2개)',
                },
                year: {
                    type: 'string',
                    example: '2024',
                    description: '처리할 연도',
                },
                month: {
                    type: 'string',
                    example: '01',
                    description: '처리할 월',
                },
                eventInfoFileType: {
                    type: 'boolean',
                    example: true,
                    description: '첫 번째 파일이 출입 이벤트 파일인지 여부',
                },
                usedAttendanceFileType: {
                    type: 'boolean',
                    example: true,
                    description: '두 번째 파일이 근태 사용 파일인지 여부',
                },
            },
            required: ['year', 'month'],
        },
    })
    @ApiCreatedResponse({
        description: 'Excel import process 생성 성공',
        type: ExcelImportProcessCreateResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 데이터',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '권한 없음',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: '서버 내부 오류',
        type: ErrorResponseDto,
    })
    async uploadExcelFiles(
        @GetUser() user: UserEntity,
        @Body() dto: CreateExcelImportProcessDto,
        @UploadedFiles() files: Express.Multer.File[],
    ): Promise<ExcelImportProcessCreateResponseDto> {
        // 파일 타입 구분
        let eventInfoFile: Express.Multer.File | undefined;
        let usedAttendanceFile: Express.Multer.File | undefined;

        if (files && files.length > 0) {
            // 파일 구분 로직 (실제 구현에서는 파일명이나 메타데이터로 구분)
            eventInfoFile = files[0];
            if (files.length > 1) {
                usedAttendanceFile = files[1];
            }
        }

        return await this.excelBusinessService.createExcelImportProcessWithFiles(
            user.userId,
            dto.year,
            dto.month,
            eventInfoFile,
            usedAttendanceFile,
        );
    }

    @Post(':id/save')
    @ApiOperation({
        summary: 'Excel import process 저장',
        description: '중간 진행 상황을 저장합니다.',
    })
    @ApiParam({
        name: 'id',
        description: 'Excel import process ID',
        type: 'string',
        format: 'uuid',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    })
    @ApiBody({
        type: SaveExcelImportProcessDto,
        description: '저장할 프로세스 데이터',
    })
    @ApiOkResponse({
        description: 'Excel import process 저장 성공',
        type: ExcelImportProcessResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 데이터',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Excel import process를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    async saveExcelImportProcess(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: SaveExcelImportProcessDto,
    ): Promise<ExcelImportProcessResponseDto> {
        return await this.excelBusinessService.saveExcelImportProcess(
            id,
            dto.status,
            dto.departmentInfoJson,
            dto.employeeInfoJson,
            dto.dataJson,
        );
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Excel import process 조회',
        description: 'ID로 Excel import process를 조회합니다.',
    })
    @ApiParam({
        name: 'id',
        description: 'Excel import process ID',
        type: 'string',
        format: 'uuid',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    })
    @ApiOkResponse({
        description: 'Excel import process 조회 성공',
        type: ExcelImportProcessResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Excel import process를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    async getExcelImportProcess(@Param('id', ParseUUIDPipe) id: string): Promise<ExcelImportProcessResponseDto> {
        return await this.excelBusinessService.getExcelImportProcessById(id);
    }

    @Get()
    @ApiOperation({
        summary: '사용자별 Excel import process 조회',
        description: '특정 연도/월의 사용자 Excel import process를 조회합니다.',
    })
    @ApiQuery({
        name: 'year',
        description: '조회할 연도',
        type: 'string',
        example: '2024',
        required: true,
    })
    @ApiQuery({
        name: 'month',
        description: '조회할 월',
        type: 'string',
        example: '01',
        required: true,
    })
    @ApiOkResponse({
        description: '사용자별 Excel import process 조회 성공',
        type: ExcelImportProcessResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Excel import process를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    async getUserExcelImportProcess(
        @GetUser() user: UserEntity,
        @Query('year') year: string,
        @Query('month') month: string,
    ): Promise<ExcelImportProcessResponseDto> {
        return await this.excelBusinessService.getExcelImportProcessByUserAndDate(user.userId, year, month);
    }

    @Post(':id/apply')
    @ApiOperation({
        summary: 'Excel import process 적용',
        description: 'Excel import process를 실제 시스템에 적용합니다.',
    })
    @ApiParam({
        name: 'id',
        description: 'Excel import process ID',
        type: 'string',
        format: 'uuid',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    })
    @ApiBody({
        type: ApplyExcelImportProcessDto,
        description: '적용할 프로세스 정보',
    })
    @ApiOkResponse({
        description: 'Excel import process 적용 성공',
        type: ExcelImportProcessApplyResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 데이터 또는 적용 불가능한 상태',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Excel import process를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    async applyExcelImportProcess(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: ApplyExcelImportProcessDto,
    ): Promise<ExcelImportProcessApplyResponseDto> {
        return await this.excelBusinessService.applyExcelImportProcessById(id);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Excel import process 삭제',
        description: 'Excel import process와 관련 파일들을 삭제합니다.',
    })
    @ApiParam({
        name: 'id',
        description: 'Excel import process ID',
        type: 'string',
        format: 'uuid',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    })
    @ApiOkResponse({
        description: 'Excel import process 삭제 성공',
        type: ExcelImportProcessDeleteResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Excel import process를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    async deleteExcelImportProcess(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ExcelImportProcessDeleteResponseDto> {
        return await this.excelBusinessService.deleteExcelImportProcess(id);
    }
}
