import { Injectable, Logger } from '@nestjs/common';
import { FileUploadService } from '../../domain/file/services/file-upload.service';

/**
 * 파일 컨텍스트 서비스
 * - 파일 업로드 관련 도메인 서비스들을 조합
 * - 파일 처리 워크플로우 관리
 */
@Injectable()
export class FileContextService {
    private readonly logger = new Logger(FileContextService.name);

    constructor(private readonly fileUploadService: FileUploadService) {}

    /**
     * 단일 파일을 업로드한다
     */
    async 단일_파일을_업로드한다(
        file: Express.Multer.File,
        folder?: string,
    ): Promise<{
        fileId: string;
        originalName: string;
        fileName: string;
        fileUrl: string;
        fileSize: number;
        mimeType: string;
        uploadedAt: Date;
    }> {
        const targetFolder = folder || this.fileUploadService.determineFolderByFileType(file);
        return await this.fileUploadService.uploadFileToSupabase(file, targetFolder);
    }

    /**
     * 여러 파일을 업로드한다
     */
    async 여러_파일을_업로드한다(
        files: Express.Multer.File[],
        folder?: string,
    ): Promise<
        Array<{
            fileId: string;
            originalName: string;
            fileName: string;
            fileUrl: string;
            fileSize: number;
            mimeType: string;
            uploadedAt: Date;
        }>
    > {
        const targetFolder = folder || 'uploads';
        return await this.fileUploadService.uploadMultipleFilesToSupabase(files, targetFolder);
    }

    /**
     * 대용량 파일을 업로드한다
     */
    async 대용량_파일을_업로드한다(
        file: Express.Multer.File,
        folder?: string,
    ): Promise<{
        fileId: string;
        originalName: string;
        fileName: string;
        fileUrl: string;
        fileSize: number;
        mimeType: string;
        uploadedAt: Date;
    }> {
        const targetFolder = folder || this.fileUploadService.determineFolderByFileType(file);
        return await this.fileUploadService.uploadLargeFileToSupabase(file, targetFolder);
    }

    /**
     * 파일의 공개 URL을 생성한다
     */
    async 파일의_공개_URL을_생성한다(fileName: string, folder: string = 'uploads'): Promise<string> {
        return this.fileUploadService.generatePublicUrl(fileName, folder);
    }

    /**
     * 엑셀 파일을 업로드한다
     */
    async 엑셀_파일을_업로드한다(file: Express.Multer.File): Promise<{
        fileId: string;
        originalName: string;
        fileName: string;
        fileUrl: string;
        fileSize: number;
        mimeType: string;
        uploadedAt: Date;
    }> {
        return await this.fileUploadService.uploadFileToSupabase(file, 'excel');
    }

    /**
     * 이미지 파일을 업로드한다
     */
    async 이미지_파일을_업로드한다(file: Express.Multer.File): Promise<{
        fileId: string;
        originalName: string;
        fileName: string;
        fileUrl: string;
        fileSize: number;
        mimeType: string;
        uploadedAt: Date;
    }> {
        return await this.fileUploadService.uploadFileToSupabase(file, 'images');
    }

    /**
     * 문서 파일을 업로드한다
     */
    async 문서_파일을_업로드한다(file: Express.Multer.File): Promise<{
        fileId: string;
        originalName: string;
        fileName: string;
        fileUrl: string;
        fileSize: number;
        mimeType: string;
        uploadedAt: Date;
    }> {
        return await this.fileUploadService.uploadFileToSupabase(file, 'documents');
    }
}
