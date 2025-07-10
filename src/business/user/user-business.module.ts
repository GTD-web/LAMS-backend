import { Module } from '@nestjs/common';
import { UserDomainModule } from '@src/domain/user/user.module';
import { UserController } from '@src/business/user/user.controller';
import { UserBusinessService } from './user.business';

@Module({
    imports: [UserDomainModule],
    providers: [UserBusinessService],
    controllers: [UserController],
    exports: [UserBusinessService],
})
export class UserBusinessModule {}
