import { Module } from '@nestjs/common';
import { AuthBusinessService } from './auth.business';
import { UserDomainModule } from '@src/domain/user/user.module';
import { AuthContextModule } from '@src/contexts/auth/auth-user-context.module';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { AuthController } from '@src/interfaces/controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * ?�증 비즈?�스 모듈
 * - ?�증 비즈?�스 계층??컴포?�트?�을 관�?
 */
@Module({
    imports: [UserDomainModule, AuthContextModule],
    providers: [AuthBusinessService, JwtAuthGuard, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthBusinessService],
})
export class AuthBusinessModule {}
