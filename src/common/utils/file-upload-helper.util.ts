import { FileUploadUtil } from './file-upload.util';

/**
 * 파일 업로드 헬퍼 유틸리티
 * - FileUploadUtil의 편의 메서드들
 * - 자주 사용되는 패턴들을 간소화
 */
export class FileUploadHelper {
    /**
     * Excel 파일들을 일괄 업로드
     */
    static async uploadExcelFiles(
        files: Express.Multer.File[],
        metadata?: {
            uploadedBy?: string;
            year?: string;
            month?: string;
            processType?: string;
        },
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
        const uploadPromises = files.map((file) => FileUploadUtil.uploadExcelFile(file, metadata));

        return await Promise.all(uploadPromises);
    }

    /**
     * 이미지 파일들을 일괄 업로드
     */
    static async uploadImageFiles(
        files: Express.Multer.File[],
        metadata?: {
            uploadedBy?: string;
            category?: string;
            tags?: string[];
        },
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
        const uploadPromises = files.map((file) => FileUploadUtil.uploadImageFile(file, metadata));

        return await Promise.all(uploadPromises);
    }

    /**
     * 파일 타입에 따라 자동으로 적절한 업로드 메서드 선택
     */
    static async uploadFileByType(
        file: Express.Multer.File,
        metadata?: Record<string, any>,
    ): Promise<{
        fileId: string;
        originalName: string;
        fileName: string;
        fileUrl: string;
        fileSize: number;
        mimeType: string;
        uploadedAt: Date;
    }> {
        // Excel 파일 체크
        const excelMimeTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv',
        ];

        if (excelMimeTypes.includes(file.mimetype)) {
            return await FileUploadUtil.uploadExcelFile(file, metadata);
        }

        // 이미지 파일 체크
        if (file.mimetype.startsWith('image/')) {
            return await FileUploadUtil.uploadImageFile(file, metadata);
        }

        // 기본 업로드
        const folder = FileUploadUtil.determineFolderByFileType(file);
        return await FileUploadUtil.uploadSingleFile(file, folder, {
            validateFile: true,
            generateUniqueFileName: true,
            metadata,
        });
    }

    /**
     * 여러 파일을 타입별로 자동 분류하여 업로드
     */
    static async uploadFilesByType(
        files: Express.Multer.File[],
        metadata?: Record<string, any>,
    ): Promise<
        Array<{
            fileId: string;
            originalName: string;
            fileName: string;
            fileUrl: string;
            fileSize: number;
            mimeType: string;
            uploadedAt: Date;
            fileType: 'excel' | 'image' | 'document' | 'other';
        }>
    > {
        const uploadPromises = files.map(async (file) => {
            const result = await this.uploadFileByType(file, metadata);

            // 파일 타입 결정
            let fileType: 'excel' | 'image' | 'document' | 'other' = 'other';

            const excelMimeTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
                'text/csv',
            ];

            if (excelMimeTypes.includes(file.mimetype)) {
                fileType = 'excel';
            } else if (file.mimetype.startsWith('image/')) {
                fileType = 'image';
            } else if (file.mimetype === 'application/pdf') {
                fileType = 'document';
            }

            return {
                ...result,
                fileType,
            };
        });

        return await Promise.all(uploadPromises);
    }

    /**
     * 파일들을 삭제
     */
    static async deleteFiles(
        fileInfos: Array<{ fileName: string; folder?: string }>,
    ): Promise<Array<{ fileName: string; success: boolean }>> {
        const deletePromises = fileInfos.map(async ({ fileName, folder = 'uploads' }) => {
            const success = await FileUploadUtil.deleteFile(fileName, folder);
            return { fileName, success };
        });

        return await Promise.all(deletePromises);
    }

    /**
     * 파일 존재 여부를 일괄 확인
     */
    static async checkFilesExist(
        fileInfos: Array<{ fileName: string; folder?: string }>,
    ): Promise<Array<{ fileName: string; exists: boolean }>> {
        const checkPromises = fileInfos.map(async ({ fileName, folder = 'uploads' }) => {
            const exists = await FileUploadUtil.fileExists(fileName, folder);
            return { fileName, exists };
        });

        return await Promise.all(checkPromises);
    }

    /**
     * 파일 URL들을 일괄 생성
     */
    static generateFileUrls(
        fileInfos: Array<{ fileName: string; folder?: string }>,
    ): Array<{ fileName: string; url: string }> {
        return fileInfos.map(({ fileName, folder = 'uploads' }) => ({
            fileName,
            url: FileUploadUtil.generatePublicUrl(fileName, folder),
        }));
    }
}
