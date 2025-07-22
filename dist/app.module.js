"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_config_1 = require("./common/configs/typeorm.config");
const jwt_1 = require("@nestjs/jwt");
const jwt_config_1 = require("./common/configs/jwt.config");
const seed_module_1 = require("./common/seeds/seed.module");
const auth_business_module_1 = require("./business/auth/auth-business.module");
const user_business_module_1 = require("./business/user/user-business.module");
const organization_business_module_1 = require("./business/organization/organization-business.module");
const work_standard_module_1 = require("./business/work-standard/work-standard.module");
const organization_module_1 = require("./interfaces/controllers/organization.module");
const env_config_1 = require("./common/configs/env.config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [env_config_1.default, env_config_1.JWT_CONFIG],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: typeorm_config_1.typeOrmConfig,
            }),
            jwt_1.JwtModule.registerAsync({
                global: true,
                useFactory: jwt_config_1.jwtConfig,
                inject: [config_1.ConfigService],
            }),
            seed_module_1.SeedModule,
            auth_business_module_1.AuthBusinessModule,
            user_business_module_1.UserBusinessModule,
            organization_business_module_1.OrganizationBusinessModule,
            organization_module_1.OrganizationModule,
            work_standard_module_1.WorkStandardModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map