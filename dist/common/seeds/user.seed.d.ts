import { Repository } from 'typeorm';
import { UserEntity } from '@src/domain/user/entities/user.entity';
export declare class UserSeedService {
    private readonly lamsUserRepository;
    private readonly logger;
    constructor(lamsUserRepository: Repository<UserEntity>);
    seedAdminUser(): Promise<void>;
}
