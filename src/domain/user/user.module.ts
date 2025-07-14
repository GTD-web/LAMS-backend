import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LamsUserEntity } from './entities/lams-user.entity';
import { UserDomainService } from './services/user-domain.service';

/**
 * 사용자 도메인 모듈
 * - 사용자 도메인 계층의 컴포넌트들을 관리
 * - Repository 패턴을 제거하고 Domain Service에서 직접 TypeORM 사용
 */
@Module({
    imports: [TypeOrmModule.forFeature([LamsUserEntity])],
    providers: [UserDomainService],
    exports: [UserDomainService],
})
export class UserDomainModule {}
