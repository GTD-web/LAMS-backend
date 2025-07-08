import { Module } from '@nestjs/common';
import { AuthBusinessService } from './auth.service';
import { AuthDomainModule } from '@src/domain/auth/auth.module';

/**
 * 인증 비즈니스 모듈
 * - 인증 비즈니스 계층의 컴포넌트들을 관리
 */
@Module({
    imports: [AuthDomainModule],
    providers: [
        AuthBusinessService,
        {
            provide: 'IAuthBusinessService',
            useClass: AuthBusinessService,
        },
    ],
    exports: [AuthBusinessService, 'IAuthBusinessService'],
})
export class AuthBusinessModule {}
