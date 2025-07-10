import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LamsUserEntity } from './entities/lams-user.entity';
import { UserDomainService } from './services/user-domain.service';
import { UserRepository } from './repositories/user.repository';

/**
 * 사용자 도메인 모듈
 * - 사용자 도메인 계층의 컴포넌트들을 관리
 */
@Module({
    imports: [TypeOrmModule.forFeature([LamsUserEntity])],
    providers: [
        UserDomainService,
        {
            provide: 'IUserRepository',
            useClass: UserRepository,
        },
   
    ],
    exports: [UserDomainService],
})
export class UserDomainModule {}
