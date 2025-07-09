import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { LamsUserEntity } from './entities/lams-user.entity';
import { UserDomainService } from './user.service';
import { UserDomainRepository } from './user.repository';

/**
 * 사용자 도메인 모듈
 * - 사용자 도메인 계층의 컴포넌트들을 관리
 */
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, LamsUserEntity])],
    providers: [UserDomainService, UserDomainRepository],
    exports: [UserDomainService],
})
export class UserDomainModule {}
