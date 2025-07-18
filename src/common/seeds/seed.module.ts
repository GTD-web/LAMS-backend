import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSeedService } from './user.seed';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { UserDomainModule } from '@src/domain/user/user.module';

/**
 * ?œë“œ ?°ì´??ëª¨ë“ˆ
 * - ? í”Œë¦¬ì??´ì…˜ ?œì‘ ??ì´ˆê¸° ?°ì´?°ë? ?ì„±
 */
@Module({
    imports: [UserDomainModule, TypeOrmModule.forFeature([LamsUserEntity, LamsUserEntity])],
    providers: [UserSeedService],
    exports: [UserSeedService],
})
export class SeedModule implements OnModuleInit {
    constructor(private readonly userSeedService: UserSeedService) {}

    /**
     * ëª¨ë“ˆ ì´ˆê¸°?????œë“œ ?°ì´???¤í–‰
     */
    async onModuleInit(): Promise<void> {
        await this.userSeedService.seedAdminUser();
    }
}
