import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsedAttendanceEntity } from './entities/used-attendance.entity';
import { UsedAttendanceDomainService } from './services/used-attendance-domain.service';

@Module({
    imports: [TypeOrmModule.forFeature([UsedAttendanceEntity])],
    providers: [UsedAttendanceDomainService],
    exports: [UsedAttendanceDomainService],
})
export class UsedAttendanceModule {}
