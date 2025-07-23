import { Module } from '@nestjs/common';
import { UserContextService } from './user-context.service';
import { UserDomainModule } from '../../domain/user/user-domain.module';

@Module({
    imports: [UserDomainModule],
    providers: [UserContextService],
    exports: [UserContextService],
})
export class UserContextModule {}
