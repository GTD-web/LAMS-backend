import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { FileBusinessModule } from '../../../business/file/file-business.module';
import { MulterConfigService } from '../../../common/configs/multer.config';
import { FileController } from './file.controller';

/**
 * 파일 인터페이스 모듈
 */
@Module({
    imports: [
        ConfigModule,
        FileBusinessModule,
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useClass: MulterConfigService,
        }),
    ],
    controllers: [FileController],
})
export class FileInterfaceModule {}
