import { Module } from '@nestjs/common';
import { FileDomainModule } from '../../domain/file/file-domain.module';
import { FileContextService } from './file-context.service';

/**
 * 파일 컨텍스트 모듈
 */
@Module({
    imports: [FileDomainModule],
    providers: [FileContextService],
    exports: [FileContextService],
})
export class FileContextModule {}
