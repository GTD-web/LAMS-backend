import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { FileContextService } from '../../contexts/file/file-context.service';
import { FileUploadResponseDto, MultipleFileUploadResponseDto } from './dto/file-response.dto';

/**
 * 파일 비즈니스 서비스
 * - 파일 업로드 비즈니스 로직
 * - 사용자 요청에 대한 파일 처리 워크플로우 관리
 */
@Injectable()
export class FileBusinessService {
    private readonly logger = new Logger(FileBusinessService.name);

    constructor(private readonly fileContextService: FileContextService) {}

    /**
     * 단일 파일 업로드
     */
    async uploadSingleFile(file: Express.Multer.File, folder?: string): Promise<FileUploadResponseDto> {
        try {
            if (!file) {
                throw new BadRequestException('업로드할 파일이 없습니다.');
            }

            const result = await this.fileContextService.단일_파일을_업로드한다(file, folder);

            this.logger.log(`단일 파일 업로드 완료: ${file.originalname}`);

            return new FileUploadResponseDto({
                ...result,
                message: '파일 업로드가 성공적으로 완료되었습니다.',
            });
        } catch (error) {
            this.logger.error(`단일 파일 업로드 실패: ${file?.originalname}`, error.stack);
            throw new BadRequestException('파일 업로드 중 오류가 발생했습니다.');
        }
    }

    /**
     * 다중 파일 업로드
     */
    async uploadMultipleFiles(files: Express.Multer.File[], folder?: string): Promise<MultipleFileUploadResponseDto> {
        try {
            if (!files || files.length === 0) {
                throw new BadRequestException('업로드할 파일이 없습니다.');
            }

            const results = await this.fileContextService.여러_파일을_업로드한다(files, folder);

            this.logger.log(`다중 파일 업로드 완료: ${files.length}개 파일`);

            return new MultipleFileUploadResponseDto({
                files: results,
                totalCount: results.length,
                message: `${results.length}개 파일 업로드가 성공적으로 완료되었습니다.`,
            });
        } catch (error) {
            this.logger.error(`다중 파일 업로드 실패: ${files?.length}개 파일`, error.stack);
            throw new BadRequestException('다중 파일 업로드 중 오류가 발생했습니다.');
        }
    }

    /**
     * 엑셀 파일 업로드
     */
    async uploadExcelFile(file: Express.Multer.File): Promise<FileUploadResponseDto> {
        try {
            if (!file) {
                throw new BadRequestException('업로드할 엑셀 파일이 없습니다.');
            }

            // 엑셀 파일 타입 검증
            const excelMimeTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
                'text/csv',
            ];

            if (!excelMimeTypes.includes(file.mimetype)) {
                throw new BadRequestException('엑셀 파일만 업로드 가능합니다. (.xlsx, .xls, .csv)');
            }

            const result = await this.fileContextService.엑셀_파일을_업로드한다(file);

            this.logger.log(`엑셀 파일 업로드 완료: ${file.originalname}`);

            return new FileUploadResponseDto({
                ...result,
                message: '엑셀 파일 업로드가 성공적으로 완료되었습니다.',
            });
        } catch (error) {
            this.logger.error(`엑셀 파일 업로드 실패: ${file?.originalname}`, error.stack);
            throw new BadRequestException('엑셀 파일 업로드 중 오류가 발생했습니다.');
        }
    }

    /**
     * 이미지 파일 업로드
     */
    async uploadImageFile(file: Express.Multer.File): Promise<FileUploadResponseDto> {
        try {
            if (!file) {
                throw new BadRequestException('업로드할 이미지 파일이 없습니다.');
            }

            // 이미지 파일 타입 검증
            if (!file.mimetype.startsWith('image/')) {
                throw new BadRequestException('이미지 파일만 업로드 가능합니다.');
            }

            const result = await this.fileContextService.이미지_파일을_업로드한다(file);

            this.logger.log(`이미지 파일 업로드 완료: ${file.originalname}`);

            return new FileUploadResponseDto({
                ...result,
                message: '이미지 파일 업로드가 성공적으로 완료되었습니다.',
            });
        } catch (error) {
            this.logger.error(`이미지 파일 업로드 실패: ${file?.originalname}`, error.stack);
            throw new BadRequestException('이미지 파일 업로드 중 오류가 발생했습니다.');
        }
    }

    /**
     * 문서 파일 업로드
     */
    async uploadDocumentFile(file: Express.Multer.File): Promise<FileUploadResponseDto> {
        try {
            if (!file) {
                throw new BadRequestException('업로드할 문서 파일이 없습니다.');
            }

            const result = await this.fileContextService.문서_파일을_업로드한다(file);

            this.logger.log(`문서 파일 업로드 완료: ${file.originalname}`);

            return new FileUploadResponseDto({
                ...result,
                message: '문서 파일 업로드가 성공적으로 완료되었습니다.',
            });
        } catch (error) {
            this.logger.error(`문서 파일 업로드 실패: ${file?.originalname}`, error.stack);
            throw new BadRequestException('문서 파일 업로드 중 오류가 발생했습니다.');
        }
    }

    /**
     * 파일 URL 생성
     */
    async generateFileUrl(fileName: string, folder: string = 'uploads'): Promise<{ fileUrl: string }> {
        try {
            const fileUrl = await this.fileContextService.파일의_공개_URL을_생성한다(fileName, folder);

            return { fileUrl };
        } catch (error) {
            this.logger.error(`파일 URL 생성 실패: ${fileName}`, error.stack);
            throw new BadRequestException('파일 URL 생성 중 오류가 발생했습니다.');
        }
    }
}
