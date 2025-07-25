import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExcelDomainService } from './services/excel-domain.service';
import { ExcelHelperService } from './services/excel-helper.service';
import { ExcelImportProcessEntity } from './entities/excel-import-process.entity';
import { FileEntity } from '../file/entities/file.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ExcelImportProcessEntity, FileEntity])],
    providers: [ExcelDomainService, ExcelHelperService],
    exports: [ExcelDomainService, ExcelHelperService],
})
export class ExcelDomainModule {}
