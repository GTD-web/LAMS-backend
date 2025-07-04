import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyEmployeeAttendanceInfoEntity } from './entities/monthly-event-summary.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MonthlyEmployeeAttendanceInfoEntity])],
    providers: [],
    controllers: [],
    exports: [TypeOrmModule],
})
export class MonthlyAttendanceModule {}
