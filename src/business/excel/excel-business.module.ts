import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExcelBusinessService } from './excel.business';
import { ExcelContextModule } from '../../contexts/excel/excel-context.module';

@Module({
    imports: [ConfigModule, ExcelContextModule],
    providers: [ExcelBusinessService],
    exports: [ExcelBusinessService],
})
export class ExcelBusinessModule {}
