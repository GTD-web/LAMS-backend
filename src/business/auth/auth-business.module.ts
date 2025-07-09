import { Module } from '@nestjs/common';
import { AuthBusinessService } from './auth.business';
import { UserDomainModule } from '@src/domain/user/user.module';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { AuthController } from '@src/business/auth/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * 인증 비즈니스 모듈
 * - 인증 비즈니스 계층의 컴포넌트들을 관리
 */
@Module({
    imports: [UserDomainModule],
    providers: [AuthBusinessService, JwtAuthGuard, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthBusinessService],
})
export class AuthBusinessModule {}
