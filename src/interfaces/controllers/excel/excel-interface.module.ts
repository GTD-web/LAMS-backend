import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { ExcelController } from './excel.controller';
import { ExcelBusinessModule } from '../../../business/excel/excel-business.module';
import { MulterConfigService } from '../../../common/configs/multer.config';

@Module({
    imports: [
        ConfigModule,
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useClass: MulterConfigService,
        }),
        ExcelBusinessModule,
    ],
    controllers: [ExcelController],
})
export class ExcelInterfaceModule {}
