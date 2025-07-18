import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserBusinessModule } from '@src/business/user/user-business.module';
import { UserContextModule } from '@src/contexts/user/user-context.module';

/**
 * ?�용??컨트롤러 모듈
 * - ?�용??관??컨트롤러?�을 관�?
 */
@Module({
    imports: [UserBusinessModule, UserContextModule],
    controllers: [UsersController],
})
export class UsersModule {}
