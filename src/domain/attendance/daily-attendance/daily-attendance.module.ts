import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyEventSummaryEntity } from './entities/daily-event-summary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyEventSummaryEntity])],
  providers: [],
  controllers: [],
  exports: [TypeOrmModule],
})
export class DailyAttendanceModule {}
