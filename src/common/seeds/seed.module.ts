import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSeedService } from './user.seed';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { UserDomainModule } from '@src/domain/user/user.module';

/**
 * ?λ ?°μ΄??λͺ¨λ
 * - ? νλ¦¬μ??΄μ ?μ ??μ΄κΈ° ?°μ΄?°λ? ?μ±
 */
@Module({
    imports: [UserDomainModule, TypeOrmModule.forFeature([LamsUserEntity, LamsUserEntity])],
    providers: [UserSeedService],
    exports: [UserSeedService],
})
export class SeedModule implements OnModuleInit {
    constructor(private readonly userSeedService: UserSeedService) {}

    /**
     * λͺ¨λ μ΄κΈ°?????λ ?°μ΄???€ν
     */
    async onModuleInit(): Promise<void> {
        await this.userSeedService.seedAdminUser();
    }
}
