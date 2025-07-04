import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeAnnualLeaveEntity } from './entities/employee-annual-leave.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeAnnualLeaveEntity])],
  providers: [],
  controllers: [],
  exports: [TypeOrmModule],
})
export class AnnualLeaveModule {}
