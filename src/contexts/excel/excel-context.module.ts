import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExcelContextService } from './excel-context.service';
import { ExcelHelperService } from '../../domain/excel/services/excel-helper.service';
import { HolidayModule } from '../../domain/holiday/holiday.module';
import { AttendanceTypeModule } from '../../domain/attendance-type/attendance-type.module';
import { ExcelDomainModule } from '../../domain/excel/excel-domain.module';

@Module({
    imports: [ConfigModule, HolidayModule, AttendanceTypeModule, ExcelDomainModule],
    providers: [ExcelContextService, ExcelHelperService],
    exports: [ExcelContextService],
})
export class ExcelContextModule {}
