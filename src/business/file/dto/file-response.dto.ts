import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

/**
 * 파일 업로드 응답 DTO
 */
@Exclude()
export class FileUploadResponseDto {
    @ApiProperty({
        description: '파일 고유 ID',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        format: 'uuid',
    })
    @Expose()
    readonly fileId: string;

    @ApiProperty({
        description: '원본 파일명',
        example: 'attendance_report.xlsx',
    })
    @Expose()
    readonly originalName: string;

    @ApiProperty({
        description: '저장된 파일명',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479.xlsx',
    })
    @Expose()
    readonly fileName: string;

    @ApiProperty({
        description: '파일 URL',
        example:
            'https://your-project.supabase.co/storage/v1/object/public/bucket-name/excel/f47ac10b-58cc-4372-a567-0e02b2c3d479.xlsx',
    })
    @Expose()
    readonly fileUrl: string;

    @ApiProperty({
        description: '파일 크기 (bytes)',
        example: 1024000,
        type: 'integer',
    })
    @Expose()
    readonly fileSize: number;

    @ApiProperty({
        description: '파일 MIME 타입',
        example: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    @Expose()
    readonly mimeType: string;

    @ApiProperty({
        description: '업로드 완료 시간',
        example: '2024-01-01T00:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly uploadedAt: Date;

    @ApiProperty({
        description: '처리 결과 메시지',
        example: '파일 업로드가 성공적으로 완료되었습니다.',
    })
    @Expose()
    readonly message: string;

    constructor(data: {
        fileId: string;
        originalName: string;
        fileName: string;
        fileUrl: string;
        fileSize: number;
        mimeType: string;
        uploadedAt: Date;
        message: string;
    }) {
        this.fileId = data.fileId;
        this.originalName = data.originalName;
        this.fileName = data.fileName;
        this.fileUrl = data.fileUrl;
        this.fileSize = data.fileSize;
        this.mimeType = data.mimeType;
        this.uploadedAt = data.uploadedAt;
        this.message = data.message;
    }
}

/**
 * 다중 파일 업로드 응답 DTO
 */
@Exclude()
export class MultipleFileUploadResponseDto {
    @ApiProperty({
        description: '업로드된 파일 목록',
        type: [FileUploadResponseDto],
    })
    @Expose()
    @Type(() => FileUploadResponseDto)
    readonly files: Array<{
        fileId: string;
        originalName: string;
        fileName: string;
        fileUrl: string;
        fileSize: number;
        mimeType: string;
        uploadedAt: Date;
    }>;

    @ApiProperty({
        description: '총 업로드된 파일 수',
        example: 5,
        type: 'integer',
    })
    @Expose()
    readonly totalCount: number;

    @ApiProperty({
        description: '처리 결과 메시지',
        example: '5개 파일 업로드가 성공적으로 완료되었습니다.',
    })
    @Expose()
    readonly message: string;

    @ApiProperty({
        description: '업로드 완료 시간',
        example: '2024-01-01T00:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly uploadedAt: Date;

    constructor(data: {
        files: Array<{
            fileId: string;
            originalName: string;
            fileName: string;
            fileUrl: string;
            fileSize: number;
            mimeType: string;
            uploadedAt: Date;
        }>;
        totalCount: number;
        message: string;
    }) {
        this.files = data.files;
        this.totalCount = data.totalCount;
        this.message = data.message;
        this.uploadedAt = new Date();
    }
}

/**
 * 파일 URL 생성 응답 DTO
 */
@Exclude()
export class FileUrlResponseDto {
    @ApiProperty({
        description: '파일 URL',
        example: 'https://your-project.supabase.co/storage/v1/object/public/bucket-name/uploads/filename.pdf',
    })
    @Expose()
    readonly fileUrl: string;

    @ApiProperty({
        description: '생성 시간',
        example: '2024-01-01T00:00:00Z',
        format: 'date-time',
    })
    @Expose()
    readonly generatedAt: Date;

    constructor(fileUrl: string) {
        this.fileUrl = fileUrl;
        this.generatedAt = new Date();
    }
}
