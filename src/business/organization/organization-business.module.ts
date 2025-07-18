import { Module } from '@nestjs/common';
import { OrganizationContextModule } from '../../contexts/organization/organization-context.module';

// Services
import { OrganizationManagementService } from './services/organization-management.service';
import { OrganizationQueryService } from './services/organization-query.service';
import { OrganizationSyncService } from './services/organization-sync.service';

// Controllers
import { UsersController } from '../../interfaces/controllers/users.controller';
import { DepartmentsController } from '../../interfaces/controllers/departments.controller';
import { EmployeesController } from '../../interfaces/controllers/employees.controller';
import { OrganizationController } from '../../interfaces/controllers/organization.controller';
import { UserDomainModule } from '@src/domain/user/user.module';
import { OrganizationDomainService } from '@src/domain/organization/organization-domain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';

/**
 * 조직 비즈니스 모듈
 * - 조직 관련 모든 비즈니스 로직과 컨트롤러를 관리
 */
@Module({
    imports: [OrganizationContextModule, UserDomainModule, TypeOrmModule.forFeature([DepartmentInfoEntity])],
    controllers: [UsersController, DepartmentsController, EmployeesController, OrganizationController],
    providers: [OrganizationManagementService, OrganizationQueryService, OrganizationSyncService],
    exports: [OrganizationManagementService, OrganizationQueryService, OrganizationSyncService],
})
export class OrganizationBusinessModule {}
