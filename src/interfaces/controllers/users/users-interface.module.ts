import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserBusinessModule } from 'src/business/user/user-business.module';

@Module({
    imports: [UserBusinessModule],
    controllers: [UsersController],
    providers: [],
    exports: [],
})
export class UsersInterfaceModule {}
