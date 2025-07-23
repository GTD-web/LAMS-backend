import { Module } from '@nestjs/common';
import { OrganizationContextService } from './organization-context.service';
import { DepartmentDomainModule } from '@src/domain/department/department-domain.module';
import { EmployeeDomainModule } from '@src/domain/employee/employee-domain.module';
import { DepartmentEmployeeDomainModule } from '@src/domain/department-employee/department-employee-domain.module';

/**
 * 조직 컨텍스트 모듈
 * - 조직 관련 컨텍스트 서비스 제공
 * - 도메인 모듈들을 통합하여 비즈니스 로직 조정
 */
@Module({
    imports: [DepartmentDomainModule, EmployeeDomainModule, DepartmentEmployeeDomainModule],
    providers: [OrganizationContextService],
    exports: [OrganizationContextService],
})
export class OrganizationContextModule {}
