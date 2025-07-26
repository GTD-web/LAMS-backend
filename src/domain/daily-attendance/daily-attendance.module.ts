import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyEventSummaryEntity } from './entities/daily-event-summary.entity';
import { DailySummaryDomainService } from './services/daily-summary-domain.service';

@Module({
    imports: [TypeOrmModule.forFeature([DailyEventSummaryEntity])],
    providers: [DailySummaryDomainService],
    exports: [DailySummaryDomainService],
})
export class DailyAttendanceModule {}
