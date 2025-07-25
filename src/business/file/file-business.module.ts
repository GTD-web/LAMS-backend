import { Module } from '@nestjs/common';
import { FileContextModule } from '../../contexts/file/file-context.module';
import { FileBusinessService } from './file.business';

/**
 * 파일 비즈니스 모듈
 */
@Module({
    imports: [FileContextModule],
    providers: [FileBusinessService],
    exports: [FileBusinessService],
})
export class FileBusinessModule {}
