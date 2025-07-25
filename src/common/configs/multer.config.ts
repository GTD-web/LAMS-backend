import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';

/**
 * Multer Supabase 설정 팩토리
 * - 메모리 스토리지 사용 후 Supabase Storage에 업로드
 * - 파일 검증 및 제한 설정
 */
@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createMulterOptions(): MulterModuleOptions {
        return {
            storage: undefined, // 메모리 스토리지 사용 (기본값)
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB
                files: 10, // 최대 10개 파일
            },
            fileFilter: (req, file, cb) => {
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

                if (allowedMimeTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('허용되지 않는 파일 형식입니다.'), false);
                }
            },
        };
    }
}
