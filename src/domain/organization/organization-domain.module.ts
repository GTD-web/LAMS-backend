import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentInfoEntity } from './department/entities/department-info.entity';
import { DepartmentEmployeeEntity } from './department/entities/department-employee.entity';
import { EmployeeInfoEntity } from './employee/entities/employee-info.entity';
import { DepartmentDomainService } from './department/services/department-domain.service';
import { EmployeeDomainService } from './employee/services/employee-domain.service';
import { DepartmentEmployeeDomainModule } from './department-employee/department-employee-domain.module';
import { UserDomainModule } from '../user/user.module';

/**
 * 조직 도메인 모듈
 * - 조직 관련 모든 도메인 로직을 통합 관리
 * - 부서, 직원, 조직도, 부서-직원 관계 포함
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([DepartmentInfoEntity, DepartmentEmployeeEntity, EmployeeInfoEntity]),
        DepartmentEmployeeDomainModule,
        UserDomainModule,
    ],
    providers: [DepartmentDomainService, EmployeeDomainService],
    exports: [DepartmentDomainService, EmployeeDomainService],
})
export class OrganizationDomainModule {}
