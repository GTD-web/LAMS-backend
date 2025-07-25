import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileUploadService } from './services/file-upload.service';

/**
 * 파일 도메인 모듈
 */
@Module({
    imports: [ConfigModule],
    providers: [FileUploadService],
    exports: [FileUploadService],
})
export class FileDomainModule {}
