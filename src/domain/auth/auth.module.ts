import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthDomainService } from './auth.service';
import { UserDomainModule } from '../user/user.module';

/**
 * 인증 도메인 모듈
 * - 인증 도메인 계층의 컴포넌트들을 관리
 */
@Module({
    imports: [
        UserDomainModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'your-secret-key',
            signOptions: { expiresIn: '24h' },
        }),
    ],
    providers: [AuthDomainService],
    exports: [AuthDomainService],
})
export class AuthDomainModule {}
