import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

/**
 * 파일 업로드 도메인 서비스
 * - Supabase Storage 파일 업로드 핵심 로직
 * - 파일 검증, 메타데이터 생성, 업로드 처리
 */
@Injectable()
export class FileUploadService {
    private readonly logger = new Logger(FileUploadService.name);
    private readonly supabase: SupabaseClient;
    private readonly bucketName: string;
    private readonly endpoint: string;

    constructor(private readonly configService: ConfigService) {
        const supabaseConfig = this.configService.get('supabase');

        this.supabase = createClient(
            supabaseConfig.url,
            supabaseConfig.serviceRoleKey, // 서버에서는 service role key 사용
        );

        this.bucketName = supabaseConfig.bucketName;
        this.endpoint = supabaseConfig.endpoint;
        this.logger.log(`Supabase Storage 클라이언트 초기화 완료: ${supabaseConfig.url}/${this.bucketName}`);
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
        try {
            // 파일 검증
            this.validateFile(file);

            // 고유한 파일명 생성
            const fileId = uuidv4();
            const fileExtension = path.extname(file.originalname);
            const fileName = `${fileId}${fileExtension}`;
            const filePath = `${folder}/${fileName}`;

            // Supabase Storage에 업로드
            const { data, error } = await this.supabase.storage.from(this.bucketName).upload(filePath, file.buffer, {
                contentType: file.mimetype,
                metadata: {
                    originalName: file.originalname,
                    uploadedBy: 'system',
                    uploadedAt: new Date().toISOString(),
                },
            });

            if (error) {
                this.logger.error(`Supabase 업로드 실패: ${file.originalname}`, error);
                throw new BadRequestException('파일 업로드 중 오류가 발생했습니다.');
            }

            // 공개 URL 생성
            const { data: urlData } = this.supabase.storage.from(this.bucketName).getPublicUrl(filePath);

            const fileUrl = urlData.publicUrl;

            this.logger.log(`파일 업로드 완료: ${file.originalname} -> ${filePath}`);

            return {
                fileId,
                originalName: file.originalname,
                fileName,
                fileUrl,
                fileSize: file.size,
                mimeType: file.mimetype,
                uploadedAt: new Date(),
            };
        } catch (error) {
            this.logger.error(`파일 업로드 실패: ${file.originalname}`, error.stack);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('파일 업로드 중 오류가 발생했습니다.');
        }
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
        try {
            const uploadPromises = files.map((file) => this.uploadFileToSupabase(file, folder));
            const results = await Promise.all(uploadPromises);

            this.logger.log(`다중 파일 업로드 완료: ${files.length}개 파일`);
            return results;
        } catch (error) {
            this.logger.error('다중 파일 업로드 실패', error.stack);
            throw new BadRequestException('다중 파일 업로드 중 오류가 발생했습니다.');
        }
    }

    /**
     * 파일 검증
     */
    private validateFile(file: Express.Multer.File): void {
        // 파일 크기 검증 (10MB 제한)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            throw new BadRequestException('파일 크기는 10MB를 초과할 수 없습니다.');
        }

        // 허용된 파일 타입 검증
        const allowedMimeTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
            'text/csv', // .csv
            'image/jpeg', // .jpg, .jpeg
            'image/png', // .png
            'image/gif', // .gif
            'application/pdf', // .pdf
            'text/plain', // .txt
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                '허용되지 않는 파일 형식입니다. (허용: Excel, CSV, 이미지, PDF, 텍스트 파일)',
            );
        }

        this.logger.debug(`파일 검증 통과: ${file.originalname} (${file.mimetype}, ${file.size}bytes)`);
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
        return await this.uploadFileToSupabase(file, folder);
    }

    /**
     * 업로드된 파일의 공개 URL 생성
     */
    generatePublicUrl(fileName: string, folder: string = 'uploads'): string {
        const filePath = `${folder}/${fileName}`;
        const { data } = this.supabase.storage.from(this.bucketName).getPublicUrl(filePath);

        return data.publicUrl;
    }

    /**
     * 파일 타입별 폴더 결정
     */
    determineFolderByFileType(file: Express.Multer.File): string {
        if (file.mimetype.startsWith('image/')) {
            return 'images';
        } else if (
            file.mimetype.includes('spreadsheet') ||
            file.mimetype.includes('excel') ||
            file.mimetype.includes('csv')
        ) {
            return 'excel';
        } else if (file.mimetype === 'application/pdf') {
            return 'documents';
        } else {
            return 'uploads';
        }
    }

    /**
     * 파일 삭제
     */
    async deleteFile(fileName: string, folder: string = 'uploads'): Promise<boolean> {
        try {
            const filePath = `${folder}/${fileName}`;
            const { error } = await this.supabase.storage.from(this.bucketName).remove([filePath]);

            if (error) {
                this.logger.error(`파일 삭제 실패: ${filePath}`, error);
                return false;
            }

            this.logger.log(`파일 삭제 완료: ${filePath}`);
            return true;
        } catch (error) {
            this.logger.error(`파일 삭제 중 오류: ${fileName}`, error.stack);
            return false;
        }
    }

    /**
     * 파일 존재 여부 확인
     */
    async fileExists(fileName: string, folder: string = 'uploads'): Promise<boolean> {
        try {
            const filePath = `${folder}/${fileName}`;
            const { data, error } = await this.supabase.storage.from(this.bucketName).list(folder, {
                search: fileName,
            });

            if (error) {
                this.logger.error(`파일 존재 확인 실패: ${filePath}`, error);
                return false;
            }

            return data && data.length > 0;
        } catch (error) {
            this.logger.error(`파일 존재 확인 중 오류: ${fileName}`, error.stack);
            return false;
        }
    }
}
