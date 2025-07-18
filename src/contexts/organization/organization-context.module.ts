import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationContextService } from './organization-context.service';
import { DepartmentInfoEntity } from '../../domain/organization/department/entities/department-info.entity';
import { DepartmentEmployeeEntity } from '../../domain/organization/department/entities/department-employee.entity';
import { EmployeeInfoEntity } from '../../domain/organization/employee/entities/employee-info.entity';
import { LamsUserEntity } from '../../domain/user/entities/lams-user.entity';
import { DepartmentDomainService } from '../../domain/organization/department/services/department-domain.service';
import { UserDomainService } from '../../domain/user/services/user-domain.service';
import { EmployeeDomainService } from '../../domain/organization/employee/services/employee-domain.service';
import { OrganizationDomainModule } from '@src/domain/organization/organization-domain.module';

@Module({
    imports: [OrganizationDomainModule],
    providers: [OrganizationContextService, DepartmentDomainService, UserDomainService, EmployeeDomainService],
    exports: [OrganizationContextService],
})
export class OrganizationContextModule {}
