import { Module } from '@nestjs/common';
import { UserDepartmentAuthorityContext } from './user-department-authority-context';
import { DepartmentDomainModule } from '../../domain/department/department-domain.module';
import { UserDepartmentAuthorityDomainModule } from '../../domain/user-department-authority/user-department-authority-domain.module';

@Module({
    imports: [DepartmentDomainModule, UserDepartmentAuthorityDomainModule],
    providers: [UserDepartmentAuthorityContext],
    exports: [UserDepartmentAuthorityContext],
})
export class UserDepartmentAuthorityContextModule {}
