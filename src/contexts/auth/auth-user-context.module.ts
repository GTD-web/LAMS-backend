import { Module } from '@nestjs/common';
import { AuthContextService } from './auth-user-context.service';
import { UserDomainModule } from '@src/domain/user/user.module';
import { OrganizationDomainModule } from '@src/domain/organization/organization-domain.module';

/**
 * 인증-사용자 컨텍스트 모듈
 * - 인증-사용자 컨텍스트 계층 컴포넌트를 관리
 */
@Module({
    imports: [UserDomainModule, OrganizationDomainModule],
    providers: [AuthContextService],
    exports: [AuthContextService],
})
export class AuthContextModule {}
