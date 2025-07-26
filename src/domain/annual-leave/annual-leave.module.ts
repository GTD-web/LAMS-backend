import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeAnnualLeaveEntity } from './entities/employee-annual-leave.entity';
import { AnnualLeaveDomainService } from './services/annual-leave-domain.service';

@Module({
    imports: [TypeOrmModule.forFeature([EmployeeAnnualLeaveEntity])],
    providers: [AnnualLeaveDomainService],
    exports: [AnnualLeaveDomainService],
})
export class AnnualLeaveModule {}
