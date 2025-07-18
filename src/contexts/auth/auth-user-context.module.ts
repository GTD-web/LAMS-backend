import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthContextService } from './auth-user-context.service';
import { UserDomainModule } from '@src/domain/user/user.module';
import { OrganizationDomainModule } from '@src/domain/organization/organization-domain.module';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';

/**
 * 인증 컨텍스트 모듈
 * - 인증 컨텍스트 계층의 컴포넌트들을 관리
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([LamsUserEntity, DepartmentInfoEntity]),
        UserDomainModule,
        OrganizationDomainModule,
    ],
    providers: [AuthContextService],
    exports: [AuthContextService],
})
export class AuthContextModule {}
