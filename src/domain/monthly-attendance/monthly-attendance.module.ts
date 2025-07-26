import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyEmployeeAttendanceInfoEntity } from './entities/monthly-event-summary.entity';
import { MonthlySummaryDomainService } from './services/monthly-summary-domain.service';

@Module({
    imports: [TypeOrmModule.forFeature([MonthlyEmployeeAttendanceInfoEntity])],
    providers: [MonthlySummaryDomainService],
    exports: [MonthlySummaryDomainService],
})
export class MonthlyAttendanceModule {}
