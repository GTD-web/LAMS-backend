import { Module } from '@nestjs/common';
import { UserDepartmentAuthorityContext } from './user-department-authority-context';
import { UserDomainModule } from '../../domain/user/user-domain.module';
import { DepartmentDomainModule } from '../../domain/department/department-domain.module';
import { UserDepartmentAuthorityDomainModule } from '../../domain/user-department-authority/user-department-authority-domain.module';

@Module({
    imports: [UserDomainModule, DepartmentDomainModule, UserDepartmentAuthorityDomainModule],
    providers: [UserDepartmentAuthorityContext],
    exports: [UserDepartmentAuthorityContext],
})
export class UserDepartmentAuthorityContextModule {}
