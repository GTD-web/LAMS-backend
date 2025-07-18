import { Module } from '@nestjs/common';
import { AuthContextService } from './auth-user-context.service';
import { UserDomainModule } from '@src/domain/user/user.module';
import { OrganizationDomainModule } from '@src/domain/organization/organization-domain.module';

/**
 * ?¸ì¦-?¬ìš©??ì»¨í…?¤íŠ¸ ëª¨ë“ˆ
 * - ?¸ì¦ ë°??¬ìš©??ì»¨í…?¤íŠ¸ ê³„ì¸µ??ì»´í¬?ŒíŠ¸?¤ì„ ê´€ë¦?
 */
@Module({
    imports: [UserDomainModule, OrganizationDomainModule],
    providers: [AuthContextService],
    exports: [AuthContextService],
})
export class AuthContextModule {}
