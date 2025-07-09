import { Module } from '@nestjs/common';
import { UserBusinessService } from './user-business.service';
import { UserDomainModule } from '@src/domain/user/user.module';
import { UserController } from '@src/business/user/user.controller';

@Module({
    imports: [UserDomainModule],
    providers: [UserBusinessService],
    controllers: [UserController],
    exports: [UserBusinessService],
})
export class UserModule {}
