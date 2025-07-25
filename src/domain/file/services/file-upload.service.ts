import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUploadUtil } from '../../../common/utils/file-upload.util';

/**
 * 파일 업로드 도메인 서비스
 * - FileUploadUtil을 사용한 Supabase Storage 파일 업로드
 * - 도메인 서비스 래퍼 클래스
 */
@Injectable()
export class FileUploadService implements OnModuleInit {
    private readonly logger = new Logger(FileUploadService.name);

    constructor(private readonly configService: ConfigService) {}

    /**
     * 모듈 초기화 시 FileUploadUtil 초기화
     */
    onModuleInit() {
        FileUploadUtil.initialize(this.configService);
        this.logger.log('FileUploadService 초기화 완료');
    }

    /**
     * 파일을 Supabase Storage에 업로드
     */
    async uploadFileToSupabase(
        file: Express.Multer.File,
        folder: string = 'uploads',
    ): Promise<{
        fileId: string;
        originalName: string;
        fileName: string;
        fileUrl: string;
        fileSize: number;
        mimeType: string;
        uploadedAt: Date;
    }> {
        return await FileUploadUtil.uploadSingleFile(file, folder);
    }

    /**
     * 여러 파일을 Supabase Storage에 업로드
     */
    async uploadMultipleFilesToSupabase(
        files: Express.Multer.File[],
        folder: string = 'uploads',
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
        return await FileUploadUtil.uploadMultipleFiles(files, folder);
    }

    /**
     * 대용량 파일 업로드 (진행률 추적 없이 단순화)
     */
    async uploadLargeFileToSupabase(
        file: Express.Multer.File,
        folder: string = 'uploads',
    ): Promise<{
        fileId: string;
        originalName: string;
        fileName: string;
        fileUrl: string;
        fileSize: number;
        mimeType: string;
        uploadedAt: Date;
    }> {
        // Supabase는 내부적으로 대용량 파일을 처리하므로 동일한 메서드 사용
        return await FileUploadUtil.uploadSingleFile(file, folder);
    }

    /**
     * 파일 검증
     */
    validateFile(file: Express.Multer.File): void {
        FileUploadUtil.validateFile(file);
    }

    /**
     * 업로드된 파일의 공개 URL 생성
     */
    generatePublicUrl(fileName: string, folder: string = 'uploads'): string {
        return FileUploadUtil.generatePublicUrl(fileName, folder);
    }

    /**
     * 파일 타입별 폴더 결정
     */
    determineFolderByFileType(file: Express.Multer.File): string {
        return FileUploadUtil.determineFolderByFileType(file);
    }

    /**
     * 파일 삭제
     */
    async deleteFile(fileName: string, folder: string = 'uploads'): Promise<boolean> {
        return await FileUploadUtil.deleteFile(fileName, folder);
    }

    /**
     * 파일 존재 여부 확인
     */
    async fileExists(fileName: string, folder: string = 'uploads'): Promise<boolean> {
        return await FileUploadUtil.fileExists(fileName, folder);
    }
}
