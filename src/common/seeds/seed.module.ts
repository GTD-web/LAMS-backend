import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSeedService } from './user.seed';
import { UserEntity } from '@src/domain/user/entities/user.entity';
import { UserDomainModule } from '@src/domain/user/user.module';

/**
 * 시드 모듈
 * - 시드 데이터 초기화 및 관리
 */
@Module({
    imports: [UserDomainModule, TypeOrmModule.forFeature([UserEntity, UserEntity])],
    providers: [UserSeedService],
    exports: [UserSeedService],
})
export class SeedModule implements OnModuleInit {
    constructor(private readonly userSeedService: UserSeedService) {}

    /**
     * 시드 데이터 초기화
     */
    async onModuleInit(): Promise<void> {
        await this.userSeedService.seedAdminUser();
    }
}
