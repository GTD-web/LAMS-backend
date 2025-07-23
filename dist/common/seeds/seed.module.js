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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_seed_1 = require("./user.seed");
const user_entity_1 = require("../../domain/user/entities/user.entity");
const user_domain_module_1 = require("../../domain/user/user-domain.module");
let SeedModule = class SeedModule {
    constructor(userSeedService) {
        this.userSeedService = userSeedService;
    }
    async onModuleInit() {
        await this.userSeedService.seedAdminUser();
    }
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [user_domain_module_1.UserDomainModule, typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, user_entity_1.UserEntity])],
        providers: [user_seed_1.UserSeedService],
        exports: [user_seed_1.UserSeedService],
    }),
    __metadata("design:paramtypes", [user_seed_1.UserSeedService])
], SeedModule);
//# sourceMappingURL=seed.module.js.map