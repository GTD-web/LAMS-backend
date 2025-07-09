import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { UserRole } from '@src/domain/user/enum/user.enum';

/**
 * 사용자 시드 데이터 서비스
 * - 초기 관리자 계정 생성
 */
@Injectable()
export class UserSeedService {
    private readonly logger = new Logger(UserSeedService.name);

    constructor(
        @InjectRepository(LamsUserEntity)
        private readonly lamsUserRepository: Repository<LamsUserEntity>,
    ) {}

    /**
     * 관리자 계정 시드 데이터 생성
     * - 중복 방지를 위해 기존 계정 존재 여부 확인
     */
    async seedAdminUser(): Promise<void> {
        try {
            // 기존 admin 계정 존재 여부 확인
            const existingAdmin = await this.lamsUserRepository.findOne({
                where: { username: 'admin' },
            });

            if (existingAdmin) {
                this.logger.log('Admin user already exists. Skipping seed.');
                return;
            }

            // 관리자 계정 생성
            const adminUser = new LamsUserEntity();
            adminUser.username = 'admin';
            adminUser.password = 'fnalfmdjemals'; // BeforeInsert에서 자동 해싱됨
            adminUser.email = 'admin@lams.space';
            adminUser.roles = [
                UserRole.SYSTEM_ADMIN,
                UserRole.ATTENDANCE_ADMIN,
                UserRole.PROJECT_ADMIN,
                UserRole.LRIM_ADMIN,
            ];
            adminUser.isActive = true;
            adminUser.isIntegrated = false;
            adminUser.hasAccessAuthority = true;
            adminUser.hasReviewAuthority = true;
            adminUser.type = 'LamsUserEntity';

            await this.lamsUserRepository.save(adminUser);

            this.logger.log('Admin user seeded successfully');
            this.logger.log(`Username: admin`);
            this.logger.log(`Email: admin@lams.com`);
            this.logger.log(`Roles: ${adminUser.roles.join(', ')}`);
        } catch (error) {
            this.logger.error('Failed to seed admin user:', error);
            throw error;
        }
    }
}
