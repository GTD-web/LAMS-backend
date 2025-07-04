import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceTypeEntity } from './entities/attendance-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceTypeEntity])],
  providers: [],
  controllers: [],
  exports: [TypeOrmModule],
})
export class AttendanceTypeModule {}
