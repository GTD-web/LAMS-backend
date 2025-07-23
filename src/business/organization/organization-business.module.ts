import { Module } from '@nestjs/common';
import { OrganizationBusinessService } from './organization.business';
import { OrganizationContextModule } from '../../contexts/organization/organization-context.module';
import { OrganizationController } from '../../interfaces/controllers/organization/organization.controller';
import { UserDepartmentAuthorityContextModule } from '../../contexts/user-department-authority/user-department-authority-context.module';

/**
 * 조직 비즈니스 모듈
 * - 조직 비즈니스 계층의 컴포넌트들을 관리
 */
@Module({
    imports: [OrganizationContextModule, UserDepartmentAuthorityContextModule],
    providers: [OrganizationBusinessService],
    exports: [OrganizationBusinessService],
})
export class OrganizationBusinessModule {}
