import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { DepartmentEmployeeEntity } from '@src/domain/organization/department/entities/department-employee.entity';
import { OrganizationChartInfoEntity } from '@src/domain/organization/entities/organization-chart-info.entity';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { EmployeeInfoEntity } from '@src/domain/organization/employee/entities/employee-info.entity';
import { OrganizationDomainService } from '@src/domain/organization/organization-domain.service';
import { OrganizationBusinessService } from './organization.business';
import { OrganizationController } from './organization.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DepartmentInfoEntity,
            DepartmentEmployeeEntity,
            OrganizationChartInfoEntity,
            LamsUserEntity,
            EmployeeInfoEntity,
        ]),
    ],
    providers: [OrganizationDomainService, OrganizationBusinessService],
    controllers: [OrganizationController],
    exports: [OrganizationBusinessService],
})
export class OrganizationBusinessModule {}
