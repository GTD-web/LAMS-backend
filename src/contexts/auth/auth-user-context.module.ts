import { Module } from '@nestjs/common';
import { AuthContextService } from './auth-user-context.service';
import { UserDomainModule } from '@src/domain/user/user.module';
import { OrganizationDomainModule } from '@src/domain/organization/organization-domain.module';

/**
 * ?�증-?�용??컨텍?�트 모듈
 * - ?�증 �??�용??컨텍?�트 계층??컴포?�트?�을 관�?
 */
@Module({
    imports: [UserDomainModule, OrganizationDomainModule],
    providers: [AuthContextService],
    exports: [AuthContextService],
})
export class AuthContextModule {}
