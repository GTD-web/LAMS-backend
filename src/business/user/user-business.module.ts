import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBusinessService } from './user.business';
import { UserDomainModule } from '@src/domain/user/user.module';
import { OrganizationDomainModule } from '@src/domain/organization/organization-domain.module';
import { UserContextModule } from '@src/contexts/user/user-context.module';
import { AuthContextModule } from '@src/contexts/auth/auth-user-context.module';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';

/**
 * ?�용??비즈?�스 모듈
 * - ?�용??비즈?�스 계층??컴포?�트?�을 관�?
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([LamsUserEntity, DepartmentInfoEntity]),
        UserDomainModule,
        OrganizationDomainModule,
        UserContextModule,
        AuthContextModule,
    ],
    providers: [UserBusinessService],
    exports: [UserBusinessService],
})
export class UserBusinessModule {}
