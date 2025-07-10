import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSeedService } from './user.seed';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { UserDomainModule } from '@src/domain/user/user.module';

/**
 * 시드 데이터 모듈
 * - 애플리케이션 시작 시 초기 데이터를 생성
 */
@Module({
    imports: [UserDomainModule, TypeOrmModule.forFeature([LamsUserEntity, LamsUserEntity])],
    providers: [UserSeedService],
    exports: [UserSeedService],
})
export class SeedModule implements OnModuleInit {
    constructor(private readonly userSeedService: UserSeedService) {}

    /**
     * 모듈 초기화 시 시드 데이터 실행
     */
    async onModuleInit(): Promise<void> {
        await this.userSeedService.seedAdminUser();
    }
}
