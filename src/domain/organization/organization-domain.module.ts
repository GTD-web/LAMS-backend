import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { DepartmentInfoEntity } from './department/entities/department-info.entity';
import { DepartmentEmployeeEntity } from './department/entities/department-employee.entity';
import { EmployeeInfoEntity } from './employee/entities/employee-info.entity';
import { OrganizationChartInfoEntity } from './entities/organization-chart-info.entity';

// Services
import { DepartmentDomainService } from './department/services/department-domain.service';
import { EmployeeDomainService } from './employee/services/employee-domain.service';
import { OrganizationDomainService } from './organization-domain.service';

/**
 * 조직 도메인 모듈
 * - 부서(Department)와 직원(Employee) 도메인을 통합 관리
 * - 조직도 관련 모든 도메인 로직을 포함
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([
            DepartmentInfoEntity,
            DepartmentEmployeeEntity,
            EmployeeInfoEntity,
            OrganizationChartInfoEntity,
        ]),
    ],
    providers: [DepartmentDomainService, EmployeeDomainService, OrganizationDomainService],
    exports: [DepartmentDomainService, EmployeeDomainService, OrganizationDomainService],
})
export class OrganizationDomainModule {}
