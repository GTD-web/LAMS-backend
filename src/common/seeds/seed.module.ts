import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSeedService } from './user.seed';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { UserDomainModule } from '@src/domain/user/user.module';

/**
 * ?�드 ?�이??모듈
 * - ?�플리�??�션 ?�작 ??초기 ?�이?��? ?�성
 */
@Module({
    imports: [UserDomainModule, TypeOrmModule.forFeature([LamsUserEntity, LamsUserEntity])],
    providers: [UserSeedService],
    exports: [UserSeedService],
})
export class SeedModule implements OnModuleInit {
    constructor(private readonly userSeedService: UserSeedService) {}

    /**
     * 모듈 초기?????�드 ?�이???�행
     */
    async onModuleInit(): Promise<void> {
        await this.userSeedService.seedAdminUser();
    }
}
