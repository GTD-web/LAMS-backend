import {
    Controller,
    Post,
    Get,
    Query,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    BadRequestException,
    Param,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiOperation,
    ApiConsumes,
    ApiBody,
    ApiCreatedResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
    ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { FileBusinessService } from '../../../business/file/file.business';
import {
    FileUploadResponseDto,
    MultipleFileUploadResponseDto,
    FileUrlResponseDto,
} from '../../../business/file/dto/file-response.dto';
import { ErrorResponseDto } from '../../../common/dtos/common/error-response.dto';

/**
 * 파일 업로드 컨트롤러
 * - Supabase Storage 파일 업로드 API 엔드포인트
 * - 단일/다중 파일 업로드, 타입별 업로드
 */
@ApiTags('files')
@Controller({ path: 'files', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class FileController {
    constructor(private readonly fileBusinessService: FileBusinessService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({
        summary: '단일 파일 업로드',
        description: 'Supabase Storage에 단일 파일을 업로드합니다. 파일 타입에 따라 자동으로 폴더가 분류됩니다.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: '업로드할 파일',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: '업로드할 파일 (최대 10MB)',
                },
                folder: {
                    type: 'string',
                    description: '저장할 폴더명 (선택사항)',
                    example: 'documents',
                },
            },
            required: ['file'],
        },
    })
    @ApiCreatedResponse({
        description: '파일 업로드 성공',
        type: FileUploadResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 (파일 없음, 크기 초과, 허용되지 않는 타입)',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 필요',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '권한 없음',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
        type: ErrorResponseDto,
    })
    async uploadSingleFile(
        @UploadedFile() file: Express.Multer.File,
        @Query('folder') folder?: string,
    ): Promise<FileUploadResponseDto> {
        if (!file) {
            throw new BadRequestException('업로드할 파일이 없습니다.');
        }
        return await this.fileBusinessService.uploadSingleFile(file, folder);
    }

    @Post('upload/multiple')
    @UseInterceptors(FilesInterceptor('files', 10))
    @ApiOperation({
        summary: '다중 파일 업로드',
        description: 'Supabase Storage에 여러 파일을 동시에 업로드합니다. 최대 10개 파일까지 업로드 가능합니다.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: '업로드할 파일들',
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: '업로드할 파일들 (각각 최대 10MB)',
                },
                folder: {
                    type: 'string',
                    description: '저장할 폴더명 (선택사항)',
                    example: 'documents',
                },
            },
            required: ['files'],
        },
    })
    @ApiCreatedResponse({
        description: '다중 파일 업로드 성공',
        type: MultipleFileUploadResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 필요',
        type: ErrorResponseDto,
    })
    async uploadMultipleFiles(
        @UploadedFiles() files: Express.Multer.File[],
        @Query('folder') folder?: string,
    ): Promise<MultipleFileUploadResponseDto> {
        if (!files || files.length === 0) {
            throw new BadRequestException('업로드할 파일이 없습니다.');
        }
        return await this.fileBusinessService.uploadMultipleFiles(files, folder);
    }

    @Post('upload/excel')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({
        summary: '엑셀 파일 업로드',
        description: 'Excel 파일(.xlsx, .xls, .csv)을 업로드합니다. excel 폴더에 저장됩니다.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: '업로드할 엑셀 파일',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: '엑셀 파일 (.xlsx, .xls, .csv)',
                },
            },
            required: ['file'],
        },
    })
    @ApiCreatedResponse({
        description: '엑셀 파일 업로드 성공',
        type: FileUploadResponseDto,
    })
    @ApiBadRequestResponse({
        description: '엑셀 파일이 아니거나 잘못된 요청',
        type: ErrorResponseDto,
    })
    async uploadExcelFile(@UploadedFile() file: Express.Multer.File): Promise<FileUploadResponseDto> {
        if (!file) {
            throw new BadRequestException('업로드할 엑셀 파일이 없습니다.');
        }
        return await this.fileBusinessService.uploadExcelFile(file);
    }

    @Post('upload/image')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({
        summary: '이미지 파일 업로드',
        description: '이미지 파일(jpg, png, gif)을 업로드합니다. images 폴더에 저장됩니다.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: '업로드할 이미지 파일',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: '이미지 파일 (jpg, png, gif)',
                },
            },
            required: ['file'],
        },
    })
    @ApiCreatedResponse({
        description: '이미지 파일 업로드 성공',
        type: FileUploadResponseDto,
    })
    @ApiBadRequestResponse({
        description: '이미지 파일이 아니거나 잘못된 요청',
        type: ErrorResponseDto,
    })
    async uploadImageFile(@UploadedFile() file: Express.Multer.File): Promise<FileUploadResponseDto> {
        if (!file) {
            throw new BadRequestException('업로드할 이미지 파일이 없습니다.');
        }
        return await this.fileBusinessService.uploadImageFile(file);
    }

    @Post('upload/document')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({
        summary: '문서 파일 업로드',
        description: '문서 파일(PDF, 텍스트 등)을 업로드합니다. documents 폴더에 저장됩니다.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: '업로드할 문서 파일',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: '문서 파일 (PDF, TXT 등)',
                },
            },
            required: ['file'],
        },
    })
    @ApiCreatedResponse({
        description: '문서 파일 업로드 성공',
        type: FileUploadResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        type: ErrorResponseDto,
    })
    async uploadDocumentFile(@UploadedFile() file: Express.Multer.File): Promise<FileUploadResponseDto> {
        if (!file) {
            throw new BadRequestException('업로드할 문서 파일이 없습니다.');
        }
        return await this.fileBusinessService.uploadDocumentFile(file);
    }

    @Get('url/:fileName')
    @ApiOperation({
        summary: '파일 URL 생성',
        description: '저장된 파일의 공개 URL을 생성합니다.',
    })
    @ApiParam({
        name: 'fileName',
        description: '파일명',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479.xlsx',
    })
    @ApiQuery({
        name: 'folder',
        description: '파일이 저장된 폴더명',
        example: 'excel',
        required: false,
    })
    @ApiOkResponse({
        description: '파일 URL 생성 성공',
        type: FileUrlResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        type: ErrorResponseDto,
    })
    async generateFileUrl(
        @Param('fileName') fileName: string,
        @Query('folder') folder: string = 'uploads',
    ): Promise<FileUrlResponseDto> {
        const result = await this.fileBusinessService.generateFileUrl(fileName, folder);
        return new FileUrlResponseDto(result.fileUrl);
    }
}
