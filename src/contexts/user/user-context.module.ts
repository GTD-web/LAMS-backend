import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserContextService } from './user-context.service';
import { UserDomainModule } from '@src/domain/user/user.module';
import { OrganizationDomainModule } from '@src/domain/organization/organization-domain.module';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';

/**
 * 사용자 컨텍스트 모듈
 * - 사용자 컨텍스트 계층의 컴포넌트들을 관리
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([LamsUserEntity, DepartmentInfoEntity]),
        UserDomainModule,
        OrganizationDomainModule,
    ],
    providers: [UserContextService],
    exports: [UserContextService],
})
export class UserContextModule {}
