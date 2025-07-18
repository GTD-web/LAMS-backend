import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LamsUserEntity } from './entities/lams-user.entity';
import { UserDomainService } from './services/user-domain.service';

/**
 * ?�용???�메??모듈
 * - ?�용???�메??계층??컴포?�트?�을 관�?
 * - Repository ?�턴???�거?�고 Domain Service?�서 직접 TypeORM ?�용
 */
@Module({
    imports: [TypeOrmModule.forFeature([LamsUserEntity])],
    providers: [UserDomainService],
    exports: [UserDomainService],
})
export class UserDomainModule {}
