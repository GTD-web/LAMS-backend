import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentEmployeeEntity } from './entities/department-employee.entity';
import { DepartmentEmployeeDomainService } from './department-employee-domain.service';

@Module({
    imports: [TypeOrmModule.forFeature([DepartmentEmployeeEntity])],
    providers: [DepartmentEmployeeDomainService],
    exports: [DepartmentEmployeeDomainService],
})
export class DepartmentEmployeeDomainModule {}
