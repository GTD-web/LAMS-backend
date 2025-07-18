import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserBusinessModule } from '@src/business/user/user-business.module';
import { UserContextModule } from '@src/contexts/user/user-context.module';

/**
 * 사용자 컨트롤러 모듈
 * - 사용자 관련 컨트롤러들을 관리
 */
@Module({
    imports: [UserBusinessModule, UserContextModule],
    controllers: [UsersController],
})
export class UsersModule {}
