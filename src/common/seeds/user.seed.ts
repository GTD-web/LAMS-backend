import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../domain/user/enum/user.enum';
import { UserEntity } from '../../domain/user/entities/user.entity';

@Injectable()
export class UserSeedService {
    private readonly logger = new Logger(UserSeedService.name);

    constructor(
        @InjectRepository(UserEntity)
        private readonly lamsUserRepository: Repository<UserEntity>,
    ) {}

    async seedAdminUser(): Promise<void> {
        try {
            const existingAdmin = await this.lamsUserRepository.findOne({
                where: { username: 'admin' },
            });

            if (existingAdmin) {
                this.logger.log('Admin user already exists. Skipping seed.');
                return;
            }

            const adminUser = new UserEntity();
            adminUser.username = 'admin';
            adminUser.password = 'fnalfmdjemals';
            adminUser.email = 'admin@lams.space';
            adminUser.roles = [
                UserRole.SYSTEM_ADMIN,
                UserRole.ATTENDANCE_ADMIN,
                UserRole.PROJECT_ADMIN,
                UserRole.LRIM_ADMIN,
            ];
            adminUser.isActive = true;

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
