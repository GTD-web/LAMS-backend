import { Module } from '@nestjs/common';
import { AttendanceTypeModule } from '../attendance-type/attendance-type.module';
import { DailyAttendanceModule } from './daily-attendance/daily-attendance.module';
import { MonthlyAttendanceModule } from './monthly-attendance/monthly-attendance.module';
import { UsedAttendanceModule } from './used-attendance/used-attendance.module';

@Module({
    imports: [AttendanceTypeModule, DailyAttendanceModule, MonthlyAttendanceModule, UsedAttendanceModule],
    exports: [AttendanceTypeModule, DailyAttendanceModule, MonthlyAttendanceModule, UsedAttendanceModule],
})
export class AttendanceModule {}
