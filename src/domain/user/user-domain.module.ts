import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDomainService } from './services/user-domain.service';
import { UserEntity } from './entities/user.entity';

/**
 * 사용자 도메인 모듈
 * - Repository, Domain Service, TypeORM 연동
 */
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UserDomainService],
    exports: [UserDomainService],
})
export class UserDomainModule {}
