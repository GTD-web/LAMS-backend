import { Module } from '@nestjs/common';
import { SystemSettingsController } from './system-settings.controller';
import { SystemSettingsBusinessService } from './system-settings.business';
import { AttendanceTypeContextService } from '@src/domain/attendance/attendance-type/services/attendance-type-context.service';
import { HolidayContextService } from '@src/domain/holiday/services/holiday-context.service';
import { AttendanceTypeModule } from '@src/domain/attendance/attendance-type/attendance-type.module';
import { HolidayModule } from '@src/domain/holiday/holiday.module';

@Module({
    imports: [AttendanceTypeModule, HolidayModule],
    controllers: [SystemSettingsController],
    providers: [SystemSettingsBusinessService, AttendanceTypeContextService, HolidayContextService],
    exports: [SystemSettingsBusinessService],
})
export class SystemSettingsModule {}
