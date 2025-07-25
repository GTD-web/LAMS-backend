import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSeedService } from './user.seed';
import { UserEntity } from '../../domain/user/entities/user.entity';
import { UserDomainModule } from '../../domain/user/user-domain.module';
import { AttendanceTypeModule } from '../../domain/attendance-type/attendance-type.module';
import { AttendanceTypeSeedService } from '../../domain/attendance-type/services/attendance-type-seed.service';

/**
 * 시드 모듈
 * - 시드 데이터 초기화 및 관리
 */
@Module({
    imports: [UserDomainModule, AttendanceTypeModule, TypeOrmModule.forFeature([UserEntity])],
    providers: [UserSeedService],
    exports: [UserSeedService],
})
export class SeedModule implements OnModuleInit {
    constructor(
        private readonly userSeedService: UserSeedService,
        private readonly attendanceTypeSeedService: AttendanceTypeSeedService,
    ) {}

    /**
     * 시드 데이터 초기화
     */
    async onModuleInit(): Promise<void> {
        await this.userSeedService.seedAdminUser();
        await this.attendanceTypeSeedService.seedDefaultAttendanceTypes();
    }
}
