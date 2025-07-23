import { Module } from '@nestjs/common';
import { UserDepartmentAuthorityContext } from './user-department-authority-context';
import { UserDomainModule } from '@src/domain/user/user-domain.module';
import { DepartmentDomainModule } from '@src/domain/department/department-domain.module';
import { UserDepartmentAuthorityDomainModule } from '@src/domain/user-department-authority/user-department-authority-domain.module';

@Module({
    imports: [UserDomainModule, DepartmentDomainModule, UserDepartmentAuthorityDomainModule],
    providers: [UserDepartmentAuthorityContext],
    exports: [UserDepartmentAuthorityContext],
})
export class UserDepartmentAuthorityContextModule {}
