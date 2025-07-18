import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LamsUserEntity } from './entities/lams-user.entity';
import { UserDomainService } from './services/user-domain.service';

/**
 * ?¬ìš©???„ë©”??ëª¨ë“ˆ
 * - ?¬ìš©???„ë©”??ê³„ì¸µ??ì»´í¬?ŒíŠ¸?¤ì„ ê´€ë¦?
 * - Repository ?¨í„´???œê±°?˜ê³  Domain Service?ì„œ ì§ì ‘ TypeORM ?¬ìš©
 */
@Module({
    imports: [TypeOrmModule.forFeature([LamsUserEntity])],
    providers: [UserDomainService],
    exports: [UserDomainService],
})
export class UserDomainModule {}
