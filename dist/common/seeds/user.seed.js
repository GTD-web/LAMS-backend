"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UserSeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_enum_1 = require("../../domain/user/enum/user.enum");
const user_entity_1 = require("../../domain/user/entities/user.entity");
let UserSeedService = UserSeedService_1 = class UserSeedService {
    constructor(lamsUserRepository) {
        this.lamsUserRepository = lamsUserRepository;
        this.logger = new common_1.Logger(UserSeedService_1.name);
    }
    async seedAdminUser() {
        try {
            const existingAdmin = await this.lamsUserRepository.findOne({
                where: { username: 'admin' },
            });
            if (existingAdmin) {
                this.logger.log('Admin user already exists. Skipping seed.');
                return;
            }
            const adminUser = new user_entity_1.UserEntity();
            adminUser.username = 'admin';
            adminUser.password = 'fnalfmdjemals';
            adminUser.email = 'admin@lams.space';
            adminUser.roles = [
                user_enum_1.UserRole.SYSTEM_ADMIN,
                user_enum_1.UserRole.ATTENDANCE_ADMIN,
                user_enum_1.UserRole.PROJECT_ADMIN,
                user_enum_1.UserRole.LRIM_ADMIN,
            ];
            adminUser.isActive = true;
            await this.lamsUserRepository.save(adminUser);
            this.logger.log('Admin user seeded successfully');
            this.logger.log(`Username: admin`);
            this.logger.log(`Email: admin@lams.com`);
            this.logger.log(`Roles: ${adminUser.roles.join(', ')}`);
        }
        catch (error) {
            this.logger.error('Failed to seed admin user:', error);
            throw error;
        }
    }
};
exports.UserSeedService = UserSeedService;
exports.UserSeedService = UserSeedService = UserSeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserSeedService);
//# sourceMappingURL=user.seed.js.map