import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsedAttendanceEntity } from './entities/used-attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsedAttendanceEntity])],
  providers: [],
  controllers: [],
  exports: [TypeOrmModule],
})
export class UsedAttendanceModule {}
