import { Module } from '@nestjs/common';
import { OrganizationBusinessService } from './organization.business';
import { OrganizationContextModule } from '@src/contexts/organization/organization-context.module';
import { OrganizationController } from '@src/interfaces/controllers/organization.controller';
import { DepartmentsController } from '@src/interfaces/controllers/departments.controller';
import { EmployeesController } from '@src/interfaces/controllers/employees.controller';

/**
 * 조직 비즈니스 모듈
 * - 조직 비즈니스 계층의 컴포넌트들을 관리
 */
@Module({
    imports: [OrganizationContextModule],
    providers: [OrganizationBusinessService],
    controllers: [OrganizationController, DepartmentsController, EmployeesController],
    exports: [OrganizationBusinessService],
})
export class OrganizationBusinessModule {}
