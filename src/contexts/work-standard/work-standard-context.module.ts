import { Module } from '@nestjs/common';
import { AttendanceTypeModule } from '../../domain/attendance-type/attendance-type.module';
import { HolidayModule } from '../../domain/holiday/holiday.module';
import { WorkStandardContextService } from './work-standard-context.service';

// 근무 기준 Context 모듈 - 근무 유형과 공휴일을 통합 관리
@Module({
    imports: [AttendanceTypeModule, HolidayModule],
    providers: [WorkStandardContextService],
    exports: [WorkStandardContextService],
})
export class WorkStandardContextModule {}
