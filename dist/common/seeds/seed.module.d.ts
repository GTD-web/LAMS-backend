import { OnModuleInit } from '@nestjs/common';
import { UserSeedService } from './user.seed';
export declare class SeedModule implements OnModuleInit {
    private readonly userSeedService;
    constructor(userSeedService: UserSeedService);
    onModuleInit(): Promise<void>;
}
