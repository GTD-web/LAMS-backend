import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeInfoEntity } from './entities/employee-info.entity';
import { EmployeeDomainService } from './services/employee-domain.service';

@Module({
    imports: [TypeOrmModule.forFeature([EmployeeInfoEntity])],
    providers: [EmployeeDomainService],
    exports: [EmployeeDomainService],
})
export class EmployeeDomainModule {}
