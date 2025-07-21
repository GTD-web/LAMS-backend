/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(1);
const app_controller_1 = __webpack_require__(5);
const app_service_1 = __webpack_require__(6);
const config_1 = __webpack_require__(8);
const typeorm_1 = __webpack_require__(9);
const typeorm_config_1 = __webpack_require__(10);
const jwt_1 = __webpack_require__(11);
const jwt_config_1 = __webpack_require__(12);
const seed_module_1 = __webpack_require__(13);
const auth_business_module_1 = __webpack_require__(35);
const user_business_module_1 = __webpack_require__(55);
const organization_business_module_1 = __webpack_require__(66);
const work_standard_module_1 = __webpack_require__(75);
const env_config_1 = __webpack_require__(94);
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
            work_standard_module_1.WorkStandardModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(1);
const app_service_1 = __webpack_require__(6);
const public_decorator_1 = __webpack_require__(7);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(1);
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Public = exports.IS_PUBLIC_KEY = void 0;
const common_1 = __webpack_require__(1);
exports.IS_PUBLIC_KEY = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.typeOrmConfig = void 0;
const path_1 = __webpack_require__(3);
const typeOrmConfig = (configService) => {
    return {
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [(0, path_1.join)(__dirname, '../../domain/**/*.entity.{js,ts}'), (0, path_1.join)(__dirname, '../../**/*.entity.{js,ts}')],
        schema: 'public',
        synchronize: configService.get('NODE_ENV') !== 'production',
    };
};
exports.typeOrmConfig = typeOrmConfig;


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.jwtConfig = void 0;
const jwtConfig = (configService) => ({
    secret: configService.get('GLOBAL_SECRET'),
    signOptions: {
        expiresIn: configService.get('JWT_EXPIRES_IN'),
    },
});
exports.jwtConfig = jwtConfig;


/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SeedModule = void 0;
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(9);
const user_seed_1 = __webpack_require__(14);
const user_entity_1 = __webpack_require__(17);
const user_module_1 = __webpack_require__(33);
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
        imports: [user_module_1.UserDomainModule, typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, user_entity_1.UserEntity])],
        providers: [user_seed_1.UserSeedService],
        exports: [user_seed_1.UserSeedService],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof user_seed_1.UserSeedService !== "undefined" && user_seed_1.UserSeedService) === "function" ? _a : Object])
], SeedModule);


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSeedService = void 0;
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(15);
const user_enum_1 = __webpack_require__(16);
const user_entity_1 = __webpack_require__(17);
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
            adminUser.isIntegrated = false;
            adminUser.hasAccessAuthority = true;
            adminUser.hasReviewAuthority = true;
            adminUser.type = 'UserEntity';
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
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], UserSeedService);


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SystemRole = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SYSTEM_ADMIN"] = "SYSTEM_ADMIN";
    UserRole["ATTENDANCE_ADMIN"] = "ATTENDANCE_ADMIN";
    UserRole["ATTENDANCE_USER"] = "ATTENDANCE_USER";
    UserRole["PROJECT_ADMIN"] = "PROJECT_ADMIN";
    UserRole["PROJECT_USER"] = "PROJECT_USER";
    UserRole["SYSTEM_USER"] = "SYSTEM_USER";
    UserRole["LRIM_USER"] = "LRIM_USER";
    UserRole["LRIM_ADMIN"] = "LRIM_ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var SystemRole;
(function (SystemRole) {
    SystemRole["SYSTEM_ADMIN"] = "SYSTEM_ADMIN";
    SystemRole["SYSTEM_USER"] = "SYSTEM_USER";
})(SystemRole || (exports.SystemRole = SystemRole = {}));


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserEntity = exports.LamsUserRole = void 0;
const bcrypt = __webpack_require__(18);
const typeorm_1 = __webpack_require__(15);
const user_enum_1 = __webpack_require__(16);
const department_info_entity_1 = __webpack_require__(19);
const approval_request_info_entity_1 = __webpack_require__(30);
const approval_step_info_entity_1 = __webpack_require__(32);
var LamsUserRole;
(function (LamsUserRole) {
    LamsUserRole["ATTENDANCE_ADMIN"] = "ATTENDANCE_ADMIN";
    LamsUserRole["ATTENDANCE_USER"] = "ATTENDANCE_USER";
})(LamsUserRole || (exports.LamsUserRole = LamsUserRole = {}));
let UserEntity = class UserEntity {
    setLamsRoles(role) {
        this.roles = this.roles.filter((r) => r !== LamsUserRole.ATTENDANCE_ADMIN && r !== LamsUserRole.ATTENDANCE_USER);
        this.roles.push(role);
    }
    includeAccessableDepartment(department) {
        if (!this.accessableDepartments) {
            this.accessableDepartments = [];
        }
        if (!this.isAccessableDepartment(department)) {
            this.accessableDepartments.push(department);
        }
    }
    includeReviewableDepartment(department) {
        if (!this.reviewableDepartments) {
            this.reviewableDepartments = [];
        }
        if (!this.isReviewableDepartment(department)) {
            this.reviewableDepartments.push(department);
        }
    }
    excludeAccessableDepartment(department) {
        this.accessableDepartments = this.accessableDepartments.filter((dept) => dept.departmentId !== department.departmentId);
    }
    excludeReviewableDepartment(department) {
        this.reviewableDepartments = this.reviewableDepartments.filter((dept) => dept.departmentId !== department.departmentId);
    }
    isAccessableDepartment(department) {
        return this.accessableDepartments.some((dept) => dept.departmentId === department.departmentId);
    }
    isReviewableDepartment(department) {
        return this.reviewableDepartments.some((dept) => dept.departmentId === department.departmentId);
    }
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    validatePassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
    updateHashedPassword(password) {
        return bcrypt.hashSync(password, 10);
    }
    setSystemRole(role) {
        this.roles = this.roles.filter((r) => r !== user_enum_1.SystemRole.SYSTEM_ADMIN && r !== user_enum_1.SystemRole.SYSTEM_USER);
        this.roles.push(role);
    }
    toggleIsActive() {
        this.isActive = !this.isActive;
    }
    setDefaultRoles() {
        if (!this.roles || this.roles.length === 0) {
            this.roles = [user_enum_1.UserRole.SYSTEM_USER, user_enum_1.UserRole.ATTENDANCE_USER, user_enum_1.UserRole.PROJECT_USER, user_enum_1.UserRole.LRIM_USER];
        }
    }
    checkRoles() {
        if (this.roles) {
            this.roles = this.roles.filter((role) => Object.values(user_enum_1.UserRole).includes(role));
        }
    }
    sortRoles() {
        const roleOrder = [
            user_enum_1.UserRole.SYSTEM_ADMIN,
            user_enum_1.UserRole.SYSTEM_USER,
            user_enum_1.UserRole.ATTENDANCE_ADMIN,
            user_enum_1.UserRole.ATTENDANCE_USER,
            user_enum_1.UserRole.PROJECT_ADMIN,
            user_enum_1.UserRole.PROJECT_USER,
            user_enum_1.UserRole.LRIM_ADMIN,
            user_enum_1.UserRole.LRIM_USER,
        ];
        this.roles.sort((a, b) => roleOrder.indexOf(a) - roleOrder.indexOf(b));
    }
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        unique: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], UserEntity.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: true,
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isIntegrated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: 'UserEntity', nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], UserEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "hasAccessAuthority", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "hasReviewAuthority", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => department_info_entity_1.DepartmentInfoEntity, (department) => department.accessAuthorities),
    __metadata("design:type", Array)
], UserEntity.prototype, "accessableDepartments", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => department_info_entity_1.DepartmentInfoEntity, (department) => department.reviewAuthorities),
    __metadata("design:type", Array)
], UserEntity.prototype, "reviewableDepartments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => approval_request_info_entity_1.ApprovalRequestBaseInfoEntity, (request) => request.requester),
    __metadata("design:type", Array)
], UserEntity.prototype, "requests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => approval_step_info_entity_1.ApprovalStepInfoEntity, (step) => step.approver),
    __metadata("design:type", Array)
], UserEntity.prototype, "approvalSteps", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserEntity.prototype, "hashPassword", null);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserEntity.prototype, "setDefaultRoles", null);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserEntity.prototype, "checkRoles", null);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserEntity.prototype, "sortRoles", null);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.TableInheritance)({ column: { type: 'varchar', name: 'type' } })
], UserEntity);


/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DepartmentInfoEntity = void 0;
const typeorm_1 = __webpack_require__(15);
const department_employee_entity_1 = __webpack_require__(20);
const user_entity_1 = __webpack_require__(17);
let DepartmentInfoEntity = class DepartmentInfoEntity {
    toggleExclude() {
        this.isExclude = !this.isExclude;
    }
    isAccessAuthority(user) {
        return this.accessAuthorities.some((u) => u.userId === user.userId);
    }
    isReviewAuthority(user) {
        return this.reviewAuthorities.some((u) => u.userId === user.userId);
    }
};
exports.DepartmentInfoEntity = DepartmentInfoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DepartmentInfoEntity.prototype, "departmentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DepartmentInfoEntity.prototype, "departmentName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DepartmentInfoEntity.prototype, "departmentCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DepartmentInfoEntity.prototype, "mmsDepartmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.UserEntity, (user) => user.accessableDepartments, {
        cascade: true,
        eager: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinTable)({ name: 'accessAuthorities' }),
    __metadata("design:type", Array)
], DepartmentInfoEntity.prototype, "accessAuthorities", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.UserEntity, (user) => user.reviewableDepartments, {
        cascade: true,
        eager: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinTable)({ name: 'reviewAuthorities' }),
    __metadata("design:type", Array)
], DepartmentInfoEntity.prototype, "reviewAuthorities", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], DepartmentInfoEntity.prototype, "isExclude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], DepartmentInfoEntity.prototype, "parentDepartmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => DepartmentInfoEntity, (department) => department.children, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'parentDepartmentId' }),
    __metadata("design:type", DepartmentInfoEntity)
], DepartmentInfoEntity.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => DepartmentInfoEntity, (department) => department.parent),
    __metadata("design:type", Array)
], DepartmentInfoEntity.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => department_employee_entity_1.DepartmentEmployeeEntity, (employee) => employee.department),
    __metadata("design:type", Array)
], DepartmentInfoEntity.prototype, "employees", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], DepartmentInfoEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], DepartmentInfoEntity.prototype, "updatedAt", void 0);
exports.DepartmentInfoEntity = DepartmentInfoEntity = __decorate([
    (0, typeorm_1.Entity)()
], DepartmentInfoEntity);


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DepartmentEmployeeEntity = void 0;
const typeorm_1 = __webpack_require__(15);
const department_info_entity_1 = __webpack_require__(19);
const employee_info_entity_1 = __webpack_require__(21);
let DepartmentEmployeeEntity = class DepartmentEmployeeEntity {
};
exports.DepartmentEmployeeEntity = DepartmentEmployeeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DepartmentEmployeeEntity.prototype, "departmentEmployeeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_info_entity_1.DepartmentInfoEntity, (department) => department.employees),
    __metadata("design:type", typeof (_a = typeof department_info_entity_1.DepartmentInfoEntity !== "undefined" && department_info_entity_1.DepartmentInfoEntity) === "function" ? _a : Object)
], DepartmentEmployeeEntity.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_info_entity_1.EmployeeInfoEntity, (employee) => employee.department),
    __metadata("design:type", typeof (_b = typeof employee_info_entity_1.EmployeeInfoEntity !== "undefined" && employee_info_entity_1.EmployeeInfoEntity) === "function" ? _b : Object)
], DepartmentEmployeeEntity.prototype, "employee", void 0);
exports.DepartmentEmployeeEntity = DepartmentEmployeeEntity = __decorate([
    (0, typeorm_1.Entity)()
], DepartmentEmployeeEntity);


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmployeeInfoEntity = void 0;
const typeorm_1 = __webpack_require__(15);
const swagger_1 = __webpack_require__(22);
const daily_event_summary_entity_1 = __webpack_require__(23);
const department_employee_entity_1 = __webpack_require__(20);
const department_info_entity_1 = __webpack_require__(19);
const date_helper_1 = __webpack_require__(24);
let EmployeeInfoEntity = class EmployeeInfoEntity {
    isActive() {
        if (!this.quitedAt)
            return true;
        const today = date_helper_1.DateHelper.today();
        return this.quitedAt > today;
    }
    isActiveAt(date) {
        if (this.entryAt && date < this.entryAt)
            return false;
        if (this.quitedAt && date >= this.quitedAt)
            return false;
        return true;
    }
    getYearsOfService(baseDate) {
        if (!this.entryAt)
            return 0;
        const endDate = baseDate || this.quitedAt || date_helper_1.DateHelper.today();
        return date_helper_1.DateHelper.calculateWorkPeriod(this.entryAt, endDate) / 12;
    }
    getAge() {
        if (!this.birthDate)
            return null;
        return date_helper_1.DateHelper.calculateAge(this.birthDate);
    }
    updateInfo(updates) {
        Object.assign(this, updates);
    }
    toggleExcludeFromCalculation() {
        this.isExcludedFromCalculation = !this.isExcludedFromCalculation;
    }
};
exports.EmployeeInfoEntity = EmployeeInfoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)({
        description: '직원 아이디',
        example: 'exEmployeeId',
    }),
    __metadata("design:type", String)
], EmployeeInfoEntity.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({
        description: '직원 이름',
        example: 'exEmployeeName',
    }),
    __metadata("design:type", String)
], EmployeeInfoEntity.prototype, "employeeName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({
        description: '사번',
        example: 'exEmployeeNumber',
    }),
    __metadata("design:type", String)
], EmployeeInfoEntity.prototype, "employeeNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({
        description: '직원 이메일',
        example: 'exEmployeeEmail',
    }),
    __metadata("design:type", String)
], EmployeeInfoEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'date',
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({
        description: '입사일',
        example: '2021-01-01',
    }),
    __metadata("design:type", String)
], EmployeeInfoEntity.prototype, "entryAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_info_entity_1.DepartmentInfoEntity),
    (0, typeorm_1.JoinColumn)({ name: 'departmentId' }),
    (0, swagger_1.ApiProperty)({
        description: '부서',
        example: 'exDepartment',
    }),
    __metadata("design:type", typeof (_a = typeof department_info_entity_1.DepartmentInfoEntity !== "undefined" && department_info_entity_1.DepartmentInfoEntity) === "function" ? _a : Object)
], EmployeeInfoEntity.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, swagger_1.ApiProperty)({
        description: '생일',
        example: '1990-01-01',
        required: false,
    }),
    __metadata("design:type", String)
], EmployeeInfoEntity.prototype, "birthDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({
        description: '퇴사일',
        example: '2023-12-31',
        required: false,
    }),
    __metadata("design:type", String)
], EmployeeInfoEntity.prototype, "quitedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => daily_event_summary_entity_1.DailyEventSummaryEntity, (dailyEventSummary) => dailyEventSummary.employee, {
        cascade: true,
        nullable: true,
    }),
    __metadata("design:type", Array)
], EmployeeInfoEntity.prototype, "dailyEventSummaries", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    (0, swagger_1.ApiProperty)({
        description: '계산에서 제외할지 여부',
        example: false,
        required: false,
    }),
    __metadata("design:type", Boolean)
], EmployeeInfoEntity.prototype, "isExcludedFromCalculation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => department_employee_entity_1.DepartmentEmployeeEntity, (employee) => employee.employee),
    __metadata("design:type", Array)
], EmployeeInfoEntity.prototype, "departments", void 0);
exports.EmployeeInfoEntity = EmployeeInfoEntity = __decorate([
    (0, typeorm_1.Entity)()
], EmployeeInfoEntity);


/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DailyEventSummaryEntity = void 0;
const employee_info_entity_1 = __webpack_require__(21);
const typeorm_1 = __webpack_require__(15);
const date_helper_1 = __webpack_require__(24);
let DailyEventSummaryEntity = class DailyEventSummaryEntity {
    calculateWorkTime() {
        if (this.enter && this.leave && this.date) {
            const workHours = date_helper_1.DateHelper.calculateWorkHours(this.enter, this.leave, this.date);
            this.workTime = Math.floor(workHours * 60);
        }
        else {
            this.workTime = null;
        }
    }
    inputEventTime(earliest, latest) {
        this.enter = earliest;
        this.leave = latest;
        this.realEnter = earliest;
        this.realLeave = latest;
        this.isAbsent = false;
        this.isLate = false;
        this.isEarlyLeave = false;
        this.isChecked = true;
        this.note = '';
    }
    resetEventTime() {
        this.enter = '';
        this.leave = '';
        this.realEnter = '';
        this.realLeave = '';
        this.isAbsent = false;
        this.isLate = false;
        this.isEarlyLeave = false;
        this.isChecked = true;
        this.note = '';
    }
    updateNote(note) {
        this.note = note;
    }
};
exports.DailyEventSummaryEntity = DailyEventSummaryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DailyEventSummaryEntity.prototype, "dailyEventSummaryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], DailyEventSummaryEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_info_entity_1.EmployeeInfoEntity, (employee) => employee.dailyEventSummaries, {
        nullable: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", typeof (_a = typeof employee_info_entity_1.EmployeeInfoEntity !== "undefined" && employee_info_entity_1.EmployeeInfoEntity) === "function" ? _a : Object)
], DailyEventSummaryEntity.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], DailyEventSummaryEntity.prototype, "isHoliday", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DailyEventSummaryEntity.prototype, "enter", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DailyEventSummaryEntity.prototype, "leave", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DailyEventSummaryEntity.prototype, "realEnter", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DailyEventSummaryEntity.prototype, "realLeave", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], DailyEventSummaryEntity.prototype, "isChecked", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], DailyEventSummaryEntity.prototype, "isLate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], DailyEventSummaryEntity.prototype, "isEarlyLeave", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], DailyEventSummaryEntity.prototype, "isAbsent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DailyEventSummaryEntity.prototype, "workTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DailyEventSummaryEntity.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DailyEventSummaryEntity.prototype, "calculateWorkTime", null);
exports.DailyEventSummaryEntity = DailyEventSummaryEntity = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)(['date', 'employee'])
], DailyEventSummaryEntity);


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DateHelper = void 0;
const dayjs = __webpack_require__(25);
const utc = __webpack_require__(26);
const timezone = __webpack_require__(27);
const customParseFormat = __webpack_require__(28);
const duration = __webpack_require__(29);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(duration);
class DateHelper {
    static now() {
        return dayjs().tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_STRING);
    }
    static today() {
        return dayjs().tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_DATE);
    }
    static currentTime() {
        return dayjs().tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_TIME);
    }
    static nowDateTime() {
        return dayjs().tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_DATETIME);
    }
    static format(date, format = this.FORMATS.ISO_STRING) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(format);
    }
    static toISOString(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_STRING);
    }
    static toISODate(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_DATE);
    }
    static toKoreanDate(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.KOREAN_DATE);
    }
    static toKoreanDateTime(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.KOREAN_DATETIME);
    }
    static toDisplayDate(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.DISPLAY_DATE);
    }
    static toDisplayDateTime(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.DISPLAY_DATETIME);
    }
    static diff(startDate, endDate, unit = 'day') {
        return dayjs(endDate).diff(dayjs(startDate), unit);
    }
    static add(date, amount, unit) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).add(amount, unit).format(this.FORMATS.ISO_STRING);
    }
    static subtract(date, amount, unit) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).subtract(amount, unit).format(this.FORMATS.ISO_STRING);
    }
    static isValid(date) {
        return dayjs(date).isValid();
    }
    static isToday(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).isSame(dayjs().tz(this.DEFAULT_TIMEZONE), 'day');
    }
    static isPast(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).isBefore(dayjs().tz(this.DEFAULT_TIMEZONE));
    }
    static isFuture(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).isAfter(dayjs().tz(this.DEFAULT_TIMEZONE));
    }
    static startOfMonth(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).startOf('month').format(this.FORMATS.ISO_STRING);
    }
    static endOfMonth(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).endOf('month').format(this.FORMATS.ISO_STRING);
    }
    static getYear(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).year();
    }
    static getMonth(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).month() + 1;
    }
    static getDate(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).date();
    }
    static getHour(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).hour();
    }
    static getMinute(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).minute();
    }
    static getSecond(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).second();
    }
    static calculateAge(birthDate, baseDate) {
        const base = baseDate ? dayjs(baseDate) : dayjs();
        const birth = dayjs(birthDate);
        return base.diff(birth, 'year');
    }
    static calculateWorkPeriod(startDate, endDate) {
        const end = endDate ? dayjs(endDate) : dayjs();
        const start = dayjs(startDate);
        return end.diff(start, 'month');
    }
    static parseTime(timeString, dateString) {
        const date = dateString || this.today();
        return dayjs(`${date}T${timeString}`).tz(this.DEFAULT_TIMEZONE).toDate();
    }
    static fromExcelDate(excelDate) {
        const excelEpoch = new Date(1900, 0, 1);
        const msPerDay = 24 * 60 * 60 * 1000;
        return new Date(excelEpoch.getTime() + (excelDate - 1) * msPerDay);
    }
    static toKoreanTime(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_DATETIME);
    }
    static calculateWorkHours(startTime, endTime, date) {
        const dateStr = date || this.today();
        const start = dayjs(`${dateStr}T${startTime}`);
        const end = dayjs(`${dateStr}T${endTime}`);
        return end.diff(start, 'hour', true);
    }
}
exports.DateHelper = DateHelper;
DateHelper.DEFAULT_TIMEZONE = 'Asia/Seoul';
DateHelper.FORMATS = {
    ISO_STRING: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    ISO_DATE: 'YYYY-MM-DD',
    ISO_TIME: 'HH:mm:ss',
    ISO_DATETIME: 'YYYY-MM-DD HH:mm:ss',
    KOREAN_DATE: 'YYYY년 MM월 DD일',
    KOREAN_DATETIME: 'YYYY년 MM월 DD일 HH시 mm분',
    KOREAN_FULL: 'YYYY년 MM월 DD일 HH시 mm분 ss초',
    DISPLAY_DATE: 'YYYY.MM.DD',
    DISPLAY_DATETIME: 'YYYY.MM.DD HH:mm',
    MONTH_YEAR: 'YYYY-MM',
    YEAR: 'YYYY',
    MONTH: 'MM',
    DAY: 'DD',
    HOUR: 'HH',
    MINUTE: 'mm',
    SECOND: 'ss',
};


/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("dayjs");

/***/ }),
/* 26 */
/***/ ((module) => {

module.exports = require("dayjs/plugin/utc");

/***/ }),
/* 27 */
/***/ ((module) => {

module.exports = require("dayjs/plugin/timezone");

/***/ }),
/* 28 */
/***/ ((module) => {

module.exports = require("dayjs/plugin/customParseFormat");

/***/ }),
/* 29 */
/***/ ((module) => {

module.exports = require("dayjs/plugin/duration");

/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApprovalRequestBaseInfoEntity = void 0;
const typeorm_1 = __webpack_require__(15);
const approval_history_info_entity_1 = __webpack_require__(31);
const approval_step_info_entity_1 = __webpack_require__(32);
const user_entity_1 = __webpack_require__(17);
let ApprovalRequestBaseInfoEntity = class ApprovalRequestBaseInfoEntity {
    setComputed() {
        if (this.steps) {
            this.steps = this.steps.sort((a, b) => a.stepOrder - b.stepOrder);
        }
    }
};
exports.ApprovalRequestBaseInfoEntity = ApprovalRequestBaseInfoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ApprovalRequestBaseInfoEntity.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.requests),
    __metadata("design:type", typeof (_a = typeof user_entity_1.UserEntity !== "undefined" && user_entity_1.UserEntity) === "function" ? _a : Object)
], ApprovalRequestBaseInfoEntity.prototype, "requester", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], ApprovalRequestBaseInfoEntity.prototype, "requestType", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ApprovalRequestBaseInfoEntity.prototype, "requestTitle", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ApprovalRequestBaseInfoEntity.prototype, "requestContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], ApprovalRequestBaseInfoEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => approval_step_info_entity_1.ApprovalStepInfoEntity, (step) => step.request),
    __metadata("design:type", Array)
], ApprovalRequestBaseInfoEntity.prototype, "steps", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => approval_history_info_entity_1.ApprovalHistoryInfoEntity, (history) => history.request),
    __metadata("design:type", Array)
], ApprovalRequestBaseInfoEntity.prototype, "histories", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], ApprovalRequestBaseInfoEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], ApprovalRequestBaseInfoEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApprovalRequestBaseInfoEntity.prototype, "setComputed", null);
exports.ApprovalRequestBaseInfoEntity = ApprovalRequestBaseInfoEntity = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.TableInheritance)({ column: { type: 'varchar', name: 'type' } })
], ApprovalRequestBaseInfoEntity);


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApprovalHistoryInfoEntity = exports.ApprovalHistoryAction = void 0;
const typeorm_1 = __webpack_require__(15);
const approval_request_info_entity_1 = __webpack_require__(30);
const date_helper_1 = __webpack_require__(24);
const user_entity_1 = __webpack_require__(17);
var ApprovalHistoryAction;
(function (ApprovalHistoryAction) {
    ApprovalHistoryAction["APPROVE"] = "\uC2B9\uC778";
    ApprovalHistoryAction["REJECT"] = "\uBC18\uB824";
    ApprovalHistoryAction["CANCEL"] = "\uCDE8\uC18C";
    ApprovalHistoryAction["REQUEST"] = "\uC2E0\uCCAD";
})(ApprovalHistoryAction || (exports.ApprovalHistoryAction = ApprovalHistoryAction = {}));
let ApprovalHistoryInfoEntity = class ApprovalHistoryInfoEntity {
    afterLoad() {
        this.actionAt = date_helper_1.DateHelper.parseTime(date_helper_1.DateHelper.toKoreanTime(this.actionAt));
    }
};
exports.ApprovalHistoryInfoEntity = ApprovalHistoryInfoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ApprovalHistoryInfoEntity.prototype, "historyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], ApprovalHistoryInfoEntity.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity),
    __metadata("design:type", typeof (_a = typeof user_entity_1.UserEntity !== "undefined" && user_entity_1.UserEntity) === "function" ? _a : Object)
], ApprovalHistoryInfoEntity.prototype, "actionBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => approval_request_info_entity_1.ApprovalRequestBaseInfoEntity),
    __metadata("design:type", typeof (_b = typeof approval_request_info_entity_1.ApprovalRequestBaseInfoEntity !== "undefined" && approval_request_info_entity_1.ApprovalRequestBaseInfoEntity) === "function" ? _b : Object)
], ApprovalHistoryInfoEntity.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], ApprovalHistoryInfoEntity.prototype, "actionAt", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], ApprovalHistoryInfoEntity.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApprovalHistoryInfoEntity.prototype, "afterLoad", null);
exports.ApprovalHistoryInfoEntity = ApprovalHistoryInfoEntity = __decorate([
    (0, typeorm_1.Entity)()
], ApprovalHistoryInfoEntity);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApprovalStepInfoEntity = exports.ApprovalStepStatus = void 0;
const typeorm_1 = __webpack_require__(15);
const approval_request_info_entity_1 = __webpack_require__(30);
const user_entity_1 = __webpack_require__(17);
var ApprovalStepStatus;
(function (ApprovalStepStatus) {
    ApprovalStepStatus["PENDING"] = "\uB300\uAE30\uC911";
    ApprovalStepStatus["APPROVED"] = "\uC2B9\uC778";
    ApprovalStepStatus["REJECTED"] = "\uAC70\uC808";
    ApprovalStepStatus["CANCELLED"] = "\uCDE8\uC18C";
})(ApprovalStepStatus || (exports.ApprovalStepStatus = ApprovalStepStatus = {}));
let ApprovalStepInfoEntity = class ApprovalStepInfoEntity {
    cancel() {
        this.status = ApprovalStepStatus.CANCELLED;
    }
    approve() {
        this.status = ApprovalStepStatus.APPROVED;
    }
    reject(reason) {
        this.status = ApprovalStepStatus.REJECTED;
        this.reason = reason;
    }
    pending() {
        this.status = ApprovalStepStatus.PENDING;
    }
};
exports.ApprovalStepInfoEntity = ApprovalStepInfoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ApprovalStepInfoEntity.prototype, "stepId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.approvalSteps),
    __metadata("design:type", typeof (_a = typeof user_entity_1.UserEntity !== "undefined" && user_entity_1.UserEntity) === "function" ? _a : Object)
], ApprovalStepInfoEntity.prototype, "approver", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => approval_request_info_entity_1.ApprovalRequestBaseInfoEntity, (request) => request.steps),
    __metadata("design:type", typeof (_b = typeof approval_request_info_entity_1.ApprovalRequestBaseInfoEntity !== "undefined" && approval_request_info_entity_1.ApprovalRequestBaseInfoEntity) === "function" ? _b : Object)
], ApprovalStepInfoEntity.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ApprovalStepInfoEntity.prototype, "stepOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], ApprovalStepInfoEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], ApprovalStepInfoEntity.prototype, "reason", void 0);
exports.ApprovalStepInfoEntity = ApprovalStepInfoEntity = __decorate([
    (0, typeorm_1.Entity)()
], ApprovalStepInfoEntity);


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserDomainModule = void 0;
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(9);
const user_domain_service_1 = __webpack_require__(34);
const user_entity_1 = __webpack_require__(17);
let UserDomainModule = class UserDomainModule {
};
exports.UserDomainModule = UserDomainModule;
exports.UserDomainModule = UserDomainModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity])],
        providers: [user_domain_service_1.UserDomainService],
        exports: [user_domain_service_1.UserDomainService],
    })
], UserDomainModule);


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var UserDomainService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserDomainService = void 0;
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(15);
const user_entity_1 = __webpack_require__(17);
let UserDomainService = UserDomainService_1 = class UserDomainService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(UserDomainService_1.name);
    }
    async changeUserPassword(userId, currentPassword, newPassword) {
        if (!userId || !currentPassword || !newPassword || currentPassword === newPassword) {
            throw new common_1.BadRequestException('유효하지 않은 비밀번호 변경 정보입니다.');
        }
        const user = await this.findUserById(userId);
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        if (!user.validatePassword(currentPassword)) {
            throw new common_1.BadRequestException('현재 비밀번호가 올바르지 않습니다.');
        }
        const hashedPassword = user.updateHashedPassword(newPassword);
        user.password = hashedPassword;
        const updatedUser = await this.userRepository.save(user);
        this.logger.log(`비밀번호 변경 완료: ${updatedUser.email}`);
        return updatedUser;
    }
    async validateUserCredentials(email, password) {
        if (!email || !password || email.trim().length === 0 || password.trim().length === 0) {
            throw new common_1.BadRequestException('유효하지 않은 로그인 정보입니다.');
        }
        const user = await this.userRepository.findOne({
            where: { email: email.toLowerCase().trim() },
        });
        if (!user || !user.validatePassword(password)) {
            this.logger.warn(`로그인 실패: ${email}`);
            return null;
        }
        this.logger.log(`로그인 성공: ${user.email}`);
        return user;
    }
    async findUserById(userId) {
        if (!userId || userId.trim().length === 0) {
            throw new common_1.BadRequestException('사용자 ID가 필요합니다.');
        }
        return await this.userRepository.findOne({
            where: { userId },
        });
    }
    async findUserByEmail(email) {
        if (!email || email.trim().length === 0) {
            throw new common_1.BadRequestException('이메일이 필요합니다.');
        }
        return await this.userRepository.findOne({
            where: { email: email.toLowerCase().trim() },
        });
    }
    async createUser(userData) {
        if (!userData.email || !userData.password) {
            throw new common_1.BadRequestException('이메일과 비밀번호가 필요합니다.');
        }
        const existingUser = await this.findUserByEmail(userData.email);
        if (existingUser) {
            throw new common_1.ConflictException('이미 존재하는 이메일입니다.');
        }
        const user = this.userRepository.create(userData);
        const savedUser = await this.userRepository.save(user);
        this.logger.log(`사용자 생성 완료: ${savedUser.email}`);
        return savedUser;
    }
    async updateUser(userId, updateData) {
        if (!userId || userId.trim().length === 0) {
            throw new common_1.BadRequestException('사용자 ID가 필요합니다.');
        }
        const user = await this.findUserById(userId);
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        Object.assign(user, updateData);
        const updatedUser = await this.userRepository.save(user);
        this.logger.log(`사용자 정보 수정 완료: ${updatedUser.email}`);
        return updatedUser;
    }
    async updateUserAuthority(user, department, type, action) {
        if (type === 'access') {
            if (action === 'add') {
                user.includeAccessableDepartment(department);
            }
            else {
                user.excludeAccessableDepartment(department);
            }
        }
        else {
            if (action === 'add') {
                user.includeReviewableDepartment(department);
            }
            else {
                user.excludeReviewableDepartment(department);
            }
        }
        const updatedUser = await this.userRepository.save(user);
        this.logger.log(`사용자 접근 권한 수정 완료: ${updatedUser.email}`);
        return updatedUser;
    }
    async deleteUser(userId) {
        if (!userId || userId.trim().length === 0) {
            throw new common_1.BadRequestException('사용자 ID가 필요합니다.');
        }
        const user = await this.findUserById(userId);
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        await this.userRepository.remove(user);
        this.logger.log(`사용자 삭제 완료: ${user.email}`);
    }
    async findPaginatedUsers(page, limit) {
        const skip = (page - 1) * limit;
        const [users, total] = await this.userRepository.findAndCount({
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        this.logger.log(`페이지네이션된 사용자 목록 조회: ${users.length}명 조회`);
        return { users, total };
    }
    async searchUsers(searchCriteria) {
        const { userId, email, name, loginId, keyword, limit = 10, offset = 0 } = searchCriteria;
        const whereConditions = [];
        if (keyword) {
            whereConditions.push({
                username: (0, typeorm_2.ILike)(`%${keyword}%`),
            });
            whereConditions.push({
                email: (0, typeorm_2.ILike)(`%${keyword}%`),
            });
        }
        else {
            const individualConditions = {};
            if (userId) {
                individualConditions.userId = userId;
            }
            if (email) {
                individualConditions.email = (0, typeorm_2.ILike)(`%${email}%`);
            }
            if (name) {
                individualConditions.username = (0, typeorm_2.ILike)(`%${name}%`);
            }
            if (loginId) {
                individualConditions.username = (0, typeorm_2.ILike)(`%${loginId}%`);
            }
            if (Object.keys(individualConditions).length > 0) {
                whereConditions.push(individualConditions);
            }
        }
        const findOptions = {
            where: whereConditions.length > 0 ? whereConditions : undefined,
            order: { createdAt: 'DESC' },
            skip: offset,
            take: limit,
        };
        const [users, total] = await this.userRepository.findAndCount(findOptions);
        this.logger.log(`사용자 검색 완료: ${users.length}명 조회 (총 ${total}명)`);
        return { users, total };
    }
    async searchUserById(userId) {
        if (!userId || userId.trim().length === 0) {
            throw new common_1.BadRequestException('사용자 ID가 필요합니다.');
        }
        const user = await this.userRepository.findOne({
            where: { userId },
        });
        this.logger.log(`사용자 ID 검색 완료: ${user ? '발견' : '없음'}`);
        return user;
    }
    async searchUsersByEmail(email) {
        if (!email || email.trim().length === 0) {
            throw new common_1.BadRequestException('이메일이 필요합니다.');
        }
        const users = await this.userRepository.find({
            where: { email: (0, typeorm_2.ILike)(`%${email}%`) },
            order: { createdAt: 'DESC' },
        });
        this.logger.log(`이메일 검색 완료: ${users.length}명 조회`);
        return users;
    }
    async searchUsersByName(name) {
        if (!name || name.trim().length === 0) {
            throw new common_1.BadRequestException('이름이 필요합니다.');
        }
        const users = await this.userRepository.find({
            where: { username: (0, typeorm_2.ILike)(`%${name}%`) },
            order: { createdAt: 'DESC' },
        });
        this.logger.log(`이름 검색 완료: ${users.length}명 조회`);
        return users;
    }
};
exports.UserDomainService = UserDomainService;
exports.UserDomainService = UserDomainService = UserDomainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], UserDomainService);


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthBusinessModule = void 0;
const common_1 = __webpack_require__(1);
const auth_business_1 = __webpack_require__(36);
const user_context_module_1 = __webpack_require__(42);
const jwt_auth_guard_1 = __webpack_require__(43);
const auth_controller_1 = __webpack_require__(45);
const jwt_strategy_1 = __webpack_require__(53);
let AuthBusinessModule = class AuthBusinessModule {
};
exports.AuthBusinessModule = AuthBusinessModule;
exports.AuthBusinessModule = AuthBusinessModule = __decorate([
    (0, common_1.Module)({
        imports: [user_context_module_1.UserContextModule],
        providers: [auth_business_1.AuthBusinessService, jwt_auth_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_business_1.AuthBusinessService],
    })
], AuthBusinessModule);


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthBusinessService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthBusinessService = void 0;
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(11);
const auth_payload_dto_1 = __webpack_require__(37);
const class_transformer_1 = __webpack_require__(38);
const user_response_dto_1 = __webpack_require__(39);
const user_context_service_1 = __webpack_require__(40);
let AuthBusinessService = AuthBusinessService_1 = class AuthBusinessService {
    constructor(userContextService, jwtService) {
        this.userContextService = userContextService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthBusinessService_1.name);
    }
    async login(loginId, password) {
        try {
            const user = await this.사용자는_아이디와_패스워드를_검증한다(loginId, password);
            if (!user) {
                throw new common_1.UnauthorizedException('잘못된 사용자명 또는 비밀번호입니다.');
            }
            await this.사용자의_활성화_상태를_검증한다(user.userId);
            const token = await this.사용자의_토큰을_제공한다(user.userId);
            this.logger.log(`로그인 성공: ${loginId} (사용자 ID: ${user.userId})`);
            return {
                token,
                user: (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user),
            };
        }
        catch (error) {
            this.logger.error(`로그인 실패: ${loginId}`, error.stack);
            throw error;
        }
    }
    async getProfile(token, userId) {
        await this.userContextService.사용자는_토큰을_검증받는다(token);
        return this.userContextService.자신의_프로필을_조회한다(userId);
    }
    async 사용자는_아이디와_패스워드를_검증한다(loginId, password) {
        try {
            if (!loginId || !password || loginId.trim().length === 0 || password.trim().length === 0) {
                throw new common_1.BadRequestException('유효하지 않은 로그인 정보입니다.');
            }
            const user = await this.userContextService.findUserByEmail(loginId);
            if (!user) {
                this.logger.warn(`존재하지 않는 사용자 로그인 시도: ${loginId}`);
                return null;
            }
            const isPasswordValid = user.validatePassword(password);
            if (!isPasswordValid) {
                this.logger.warn(`잘못된 패스워드 로그인 시도: ${loginId}`);
                return null;
            }
            this.logger.log(`사용자 인증 성공: ${loginId}`);
            return user;
        }
        catch (error) {
            this.logger.error(`사용자 인증 검증 실패: ${loginId}`, error.stack);
            throw error;
        }
    }
    async 사용자의_활성화_상태를_검증한다(userId) {
        const user = await this.userContextService.findUserById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('사용자를 찾을 수 없습니다.');
        }
        if (!user.isActive) {
            this.logger.warn(`비활성화된 사용자 로그인 시도: ${user.email}`);
            throw new common_1.UnauthorizedException('비활성화된 사용자입니다.');
        }
        this.logger.log(`사용자 활성화 상태 검증 성공: ${user.email}`);
        return true;
    }
    async 사용자의_토큰을_제공한다(userId) {
        const user = await this.userContextService.findUserById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('사용자를 찾을 수 없습니다.');
        }
        const payload = new auth_payload_dto_1.AuthPayloadDto(user.userId, user.roles);
        const token = this.jwtService.sign({
            sub: payload.sub,
            roles: payload.roles,
        });
        this.logger.log(`토큰 생성 성공: ${user.email}`);
        return token;
    }
    verifyToken(token) {
        try {
            if (!token || token.trim().length === 0) {
                return false;
            }
            const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
            const decoded = this.jwtService.verify(cleanToken);
            return !!decoded;
        }
        catch (error) {
            this.logger.warn(`토큰 검증 실패: ${token}`, error.message);
            return false;
        }
    }
    async 사용자의_프로필을_조회한다(userId) {
        return this.userContextService.자신의_프로필을_조회한다(userId);
    }
    async 비밀번호를_변경한다(userId, currentPassword, newPassword) {
        const updatedUser = await this.userContextService.changeUserPassword(userId, currentPassword, newPassword);
        this.logger.log(`비밀번호 변경 성공: ${updatedUser.email}`);
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, updatedUser);
    }
    async validateUser(email, password) {
        const user = await this.사용자는_아이디와_패스워드를_검증한다(email, password);
        if (!user) {
            return null;
        }
        await this.사용자의_활성화_상태를_검증한다(user.userId);
        return new auth_payload_dto_1.AuthPayloadDto(user.userId, user.roles);
    }
};
exports.AuthBusinessService = AuthBusinessService;
exports.AuthBusinessService = AuthBusinessService = AuthBusinessService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_context_service_1.UserContextService !== "undefined" && user_context_service_1.UserContextService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthBusinessService);


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthPayloadDto = void 0;
class AuthPayloadDto {
    constructor(sub, roles, exp) {
        this.sub = sub;
        this.roles = roles;
        this.exp = exp;
    }
    isExpired() {
        return this.exp < Date.now() / 1000;
    }
}
exports.AuthPayloadDto = AuthPayloadDto;


/***/ }),
/* 38 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserResponseDto = void 0;
const swagger_1 = __webpack_require__(22);
const class_transformer_1 = __webpack_require__(38);
const user_enum_1 = __webpack_require__(16);
let UserResponseDto = class UserResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 고유 ID',
        example: 'b520bc5c-d90d-4ec6-aa27-d527e05a2f28',
        format: 'uuid',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 이름',
        example: '각김',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이메일 주소',
        example: 'sam.kim@lumir.space',
        format: 'email',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 권한 목록',
        example: ['SYSTEM_USER', 'ATTENDANCE_USER', 'PROJECT_USER', 'LRIM_USER'],
        type: [String],
        enum: user_enum_1.UserRole,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], UserResponseDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '계정 활성 여부',
        example: true,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '통합 계정 여부',
        example: true,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "isIntegrated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 유형',
        example: 'UserEntity',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '계정 생성 시간',
        example: '2025-07-11T08:05:22.339Z',
        format: 'date-time',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], UserResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '계정 정보 업데이트 시간',
        example: '2025-07-11T08:05:22.339Z',
        format: 'date-time',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], UserResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '권한 접근 여부',
        example: true,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "hasAccessAuthority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '권한 검토 여부',
        example: true,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "hasReviewAuthority", void 0);
exports.UserResponseDto = UserResponseDto = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [typeof (_a = typeof Partial !== "undefined" && Partial) === "function" ? _a : Object])
], UserResponseDto);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UserContextService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserContextService = void 0;
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(11);
const user_domain_service_1 = __webpack_require__(34);
const user_response_dto_1 = __webpack_require__(39);
const pagination_response_dto_1 = __webpack_require__(41);
const class_transformer_1 = __webpack_require__(38);
const auth_payload_dto_1 = __webpack_require__(37);
let UserContextService = UserContextService_1 = class UserContextService {
    constructor(userDomainService, jwtService) {
        this.userDomainService = userDomainService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(UserContextService_1.name);
    }
    async 사용자는_토큰을_검증받는다(token) {
        if (!token || token.trim().length === 0) {
            throw new common_1.UnauthorizedException('토큰이 제공되지 않았습니다.');
        }
        const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
        let payload;
        try {
            payload = this.jwtService.verify(cleanToken);
        }
        catch (error) {
            this.logger.warn(`토큰 검증 실패: ${error.message}`);
            throw new common_1.UnauthorizedException('유효하지 않은 토큰입니다.');
        }
        const user = await this.userDomainService.findUserById(payload.sub);
        if (!user) {
            this.logger.warn(`토큰의 사용자를 찾을 수 없음: ${payload.sub}`);
            throw new common_1.UnauthorizedException('사용자를 찾을 수 없습니다.');
        }
        if (!user.isActive) {
            this.logger.warn(`비활성화된 사용자의 토큰 사용: ${user.email}`);
            throw new common_1.UnauthorizedException('비활성화된 사용자입니다.');
        }
        this.logger.log(`토큰 검증 성공: ${user.email}`);
        return user;
    }
    async 사용자의_현재_세션_정보를_조회한다(userId) {
        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('사용자를 찾을 수 없습니다.');
        }
        const sessionValid = user.isActive;
        const roles = user.roles;
        this.logger.log(`세션 정보 조회 성공: ${user.email}`);
        return {
            user,
            sessionValid,
            roles,
        };
    }
    async 사용자의_권한을_확인한다(userId, requiredRoles) {
        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('사용자를 찾을 수 없습니다.');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('비활성화된 사용자입니다.');
        }
        const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role));
        if (!hasRequiredRole) {
            this.logger.warn(`권한 부족: ${user.email}, 필요한 역할: ${requiredRoles.join(', ')}`);
            return false;
        }
        this.logger.log(`권한 확인 성공: ${user.email}`);
        return true;
    }
    extractUserFromToken(token) {
        try {
            if (!token || token.trim().length === 0) {
                return null;
            }
            const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
            const payload = this.jwtService.verify(cleanToken);
            return new auth_payload_dto_1.AuthPayloadDto(payload.sub, payload.roles);
        }
        catch (error) {
            this.logger.warn(`토큰에서 사용자 정보 추출 실패: ${error.message}`);
            return null;
        }
    }
    isTokenExpired(token) {
        try {
            const payload = this.extractUserFromToken(token);
            if (!payload || !payload.exp) {
                return true;
            }
            return payload.isExpired();
        }
        catch (error) {
            this.logger.warn(`토큰 만료 확인 실패: ${error.message}`);
            return true;
        }
    }
    async validateUserPermission(requestUserId, targetUserId, requiredRoles) {
        const user = await this.userDomainService.findUserById(requestUserId);
        if (!user) {
            throw new common_1.ForbiddenException('사용자를 찾을 수 없습니다.');
        }
        if (targetUserId && requestUserId === targetUserId) {
            return true;
        }
        if (requiredRoles && requiredRoles.length > 0) {
            const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role));
            if (!hasRequiredRole) {
                throw new common_1.ForbiddenException('해당 작업을 수행할 권한이 없습니다.');
            }
        }
        return true;
    }
    async 자신의_프로필을_조회한다(userId) {
        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        this.logger.log(`프로필 조회 성공: ${user.email}`);
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user);
    }
    async 사용자의_프로필을_조회한다(userId) {
        return this.자신의_프로필을_조회한다(userId);
    }
    async 페이지네이션된_사용자_목록을_조회한다(paginationQuery) {
        const { page = 1, limit = 10 } = paginationQuery;
        const result = await this.userDomainService.findPaginatedUsers(page, limit);
        const userDtos = result.users.map((user) => (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user));
        const meta = new pagination_response_dto_1.PaginationMetaDto(page, limit, result.total);
        const paginatedResult = new pagination_response_dto_1.PaginatedResponseDto(userDtos, meta);
        this.logger.log(`사용자 목록 조회 성공: ${result.users.length}명 조회`);
        return paginatedResult;
    }
    async 사용자를_검색한다(searchCriteria) {
        const result = await this.userDomainService.searchUsers(searchCriteria);
        const userDtos = result.users.map((user) => (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user));
        this.logger.log(`사용자 검색 완료: ${result.users.length}명 조회 (총 ${result.total}명)`);
        return {
            data: userDtos,
            total: result.total,
        };
    }
    async findUserById(userId) {
        return this.userDomainService.findUserById(userId);
    }
    async findUserByEmail(email) {
        return this.userDomainService.findUserByEmail(email);
    }
    async changeUserPassword(userId, currentPassword, newPassword) {
        return this.userDomainService.changeUserPassword(userId, currentPassword, newPassword);
    }
    async 사용자의_부서_권한을_변경한다(userId, department, type, action) {
        const user = await this.userDomainService.findUserById(userId);
        return this.userDomainService.updateUserAuthority(user, department, type, action);
    }
};
exports.UserContextService = UserContextService;
exports.UserContextService = UserContextService = UserContextService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_domain_service_1.UserDomainService !== "undefined" && user_domain_service_1.UserDomainService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], UserContextService);


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaginatedResponseDto = exports.PaginationMetaDto = void 0;
const swagger_1 = __webpack_require__(22);
class PaginationMetaDto {
    constructor(page, limit, total) {
        this.page = page;
        this.limit = limit;
        this.total = total;
        this.totalPages = Math.ceil(total / limit);
    }
}
exports.PaginationMetaDto = PaginationMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1,
    }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 10,
    }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of items',
        example: 100,
    }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 10,
    }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "totalPages", void 0);
class PaginatedResponseDto {
    constructor(data, meta) {
        this.data = data;
        this.meta = meta;
    }
    static create(data, page, limit, total) {
        const meta = new PaginationMetaDto(page, limit, total);
        return new PaginatedResponseDto(data, meta);
    }
}
exports.PaginatedResponseDto = PaginatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of data items',
        type: 'array',
    }),
    __metadata("design:type", Array)
], PaginatedResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pagination metadata',
        type: PaginationMetaDto,
    }),
    __metadata("design:type", PaginationMetaDto)
], PaginatedResponseDto.prototype, "meta", void 0);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserContextModule = void 0;
const common_1 = __webpack_require__(1);
const user_context_service_1 = __webpack_require__(40);
const user_module_1 = __webpack_require__(33);
let UserContextModule = class UserContextModule {
};
exports.UserContextModule = UserContextModule;
exports.UserContextModule = UserContextModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserDomainModule],
        providers: [user_context_service_1.UserContextService],
        exports: [user_context_service_1.UserContextService],
    })
], UserContextModule);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(44);
const core_1 = __webpack_require__(2);
const public_decorator_1 = __webpack_require__(7);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], JwtAuthGuard);


/***/ }),
/* 44 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(22);
const auth_business_1 = __webpack_require__(36);
const public_decorator_1 = __webpack_require__(7);
const get_user_decorator_1 = __webpack_require__(46);
const login_response_dto_1 = __webpack_require__(47);
const login_dto_1 = __webpack_require__(48);
const change_password_dto_1 = __webpack_require__(50);
const user_response_dto_1 = __webpack_require__(39);
const jwt_auth_guard_1 = __webpack_require__(43);
const roles_guard_1 = __webpack_require__(51);
const error_response_dto_1 = __webpack_require__(52);
const user_entity_1 = __webpack_require__(17);
let AuthController = class AuthController {
    constructor(authBusinessService) {
        this.authBusinessService = authBusinessService;
    }
    async login(loginDto) {
        return this.authBusinessService.login(loginDto.email, loginDto.password);
    }
    async getProfile(user, token) {
        return this.authBusinessService.getProfile(token, user.userId);
    }
    async verifyToken(token) {
        return {
            valid: this.authBusinessService.verifyToken(token),
        };
    }
    async changePassword(user, changePasswordDto) {
        return this.authBusinessService.비밀번호를_변경한다(user.userId, changePasswordDto.currentPassword, changePasswordDto.newPassword);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: '사용자 로그인',
        description: '사용자 아이디(이메일)와 패스워드를 검증하여 JWT 토큰을 발급합니다.',
    }),
    (0, swagger_1.ApiBody)({
        type: login_dto_1.LoginDto,
        description: '로그인 정보',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: '로그인 성공',
        type: login_response_dto_1.LoginResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 요청 데이터',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패 - 잘못된 사용자명 또는 비밀번호',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: '서버 내부 오류',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: '사용자 프로필 조회',
        description: '현재 로그인된 사용자의 프로필 정보를 조회합니다.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '프로필 조회 성공',
        type: user_response_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패 - 유효하지 않은 토큰',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: '서버 내부 오류',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof user_entity_1.UserEntity !== "undefined" && user_entity_1.UserEntity) === "function" ? _d : Object, String]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('verify'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: '토큰 검증',
        description: '현재 사용자의 JWT 토큰이 유효한지 검증합니다.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '토큰 검증 성공',
        schema: {
            type: 'object',
            properties: {
                valid: { type: 'boolean', example: true },
                user: { $ref: '#/components/schemas/UserResponseDto' },
                sessionInfo: {
                    type: 'object',
                    properties: {
                        sessionValid: { type: 'boolean', example: true },
                        roles: { type: 'array', items: { type: 'string' }, example: ['SYSTEM_ADMIN'] },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '토큰 검증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], AuthController.prototype, "verifyToken", null);
__decorate([
    (0, common_1.Put)('change-password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: '비밀번호 변경',
        description: '현재 사용자의 비밀번호를 변경합니다.',
    }),
    (0, swagger_1.ApiBody)({
        type: change_password_dto_1.ChangePasswordDto,
        description: '비밀번호 변경 정보',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '비밀번호 변경 성공',
        type: user_response_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 요청 데이터 또는 현재 비밀번호 불일치',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: '서버 내부 오류',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof user_entity_1.UserEntity !== "undefined" && user_entity_1.UserEntity) === "function" ? _g : Object, typeof (_h = typeof change_password_dto_1.ChangePasswordDto !== "undefined" && change_password_dto_1.ChangePasswordDto) === "function" ? _h : Object]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], AuthController.prototype, "changePassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('admin/auth'),
    (0, swagger_1.ApiTags)('인증 (Authentication)'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_business_1.AuthBusinessService !== "undefined" && auth_business_1.AuthBusinessService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetUser = void 0;
const common_1 = __webpack_require__(1);
exports.GetUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (data) {
        return user && user[data];
    }
    return user;
});


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginResponseDto = void 0;
const swagger_1 = __webpack_require__(22);
const user_response_dto_1 = __webpack_require__(39);
class LoginResponseDto {
    constructor(token, user) {
        this.token = token;
        this.user = user;
    }
}
exports.LoginResponseDto = LoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '토큰',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 정보',
        type: user_response_dto_1.UserResponseDto,
    }),
    __metadata("design:type", typeof (_a = typeof user_response_dto_1.UserResponseDto !== "undefined" && user_response_dto_1.UserResponseDto) === "function" ? _a : Object)
], LoginResponseDto.prototype, "user", void 0);


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const swagger_1 = __webpack_require__(22);
const class_validator_1 = __webpack_require__(49);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이메일',
        example: 'test@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '비밀번호',
        example: 'password',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),
/* 49 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChangePasswordDto = void 0;
const swagger_1 = __webpack_require__(22);
const class_validator_1 = __webpack_require__(49);
class ChangePasswordDto {
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '비�?번호',
        example: 'password',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '??비�?번호',
        example: 'newPassword',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new common_1.ForbiddenException('접근 권한이 없습니다. 로그인이 필요합니다.');
        }
        const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
        if (!hasRole) {
            throw new common_1.ForbiddenException('해당 작업을 수행할 권한이 없습니다.');
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorResponseDto = void 0;
const swagger_1 = __webpack_require__(22);
class ErrorResponseDto {
}
exports.ErrorResponseDto = ErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HTTP status code',
        example: 400,
        type: 'integer',
    }),
    __metadata("design:type", Number)
], ErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error message',
        example: 'Validation failed',
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Detailed error information',
        example: ['employeeId must be a string', 'year must be a number'],
        type: [String],
    }),
    __metadata("design:type", Array)
], ErrorResponseDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when error occurred',
        example: '2023-12-01T10:00:00Z',
        format: 'date-time',
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Request path that caused the error',
        example: '/api/v1/annual-leave',
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Error code for client handling',
        example: 'VALIDATION_ERROR',
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "errorCode", void 0);


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(44);
const passport_jwt_1 = __webpack_require__(54);
const config_1 = __webpack_require__(8);
const user_context_service_1 = __webpack_require__(40);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(userService, configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwt.secret'),
        });
        this.userService = userService;
    }
    async validate(payload) {
        const user = await this.userService.findUserById(payload.sub);
        if (!user || user.userId !== payload.sub) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_context_service_1.UserContextService !== "undefined" && user_context_service_1.UserContextService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], JwtStrategy);


/***/ }),
/* 54 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserBusinessModule = void 0;
const common_1 = __webpack_require__(1);
const user_business_1 = __webpack_require__(56);
const user_context_module_1 = __webpack_require__(42);
const organization_context_module_1 = __webpack_require__(64);
let UserBusinessModule = class UserBusinessModule {
};
exports.UserBusinessModule = UserBusinessModule;
exports.UserBusinessModule = UserBusinessModule = __decorate([
    (0, common_1.Module)({
        imports: [user_context_module_1.UserContextModule, organization_context_module_1.OrganizationContextModule],
        providers: [user_business_1.UserBusinessService],
        exports: [user_business_1.UserBusinessService],
    })
], UserBusinessModule);


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UserBusinessService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserBusinessService = void 0;
const common_1 = __webpack_require__(1);
const user_context_service_1 = __webpack_require__(40);
const success_message_helper_1 = __webpack_require__(57);
const organization_context_service_1 = __webpack_require__(59);
let UserBusinessService = UserBusinessService_1 = class UserBusinessService {
    constructor(userContextService, organizationContextService) {
        this.userContextService = userContextService;
        this.organizationContextService = organizationContextService;
        this.logger = new common_1.Logger(UserBusinessService_1.name);
    }
    async getUserList(paginationQuery) {
        if (!paginationQuery.page || !paginationQuery.limit) {
            throw new Error('페이지 정보가 필요합니다.');
        }
        const result = await this.userContextService.페이지네이션된_사용자_목록을_조회한다(paginationQuery);
        return success_message_helper_1.SuccessMessageHelper.createPaginatedSuccessResponse(success_message_helper_1.SuccessMessageHelper.MESSAGES.USER_LIST_RETRIEVED, result.data || [], result.meta || { page: 1, limit: 10, total: 0, totalPages: 0 });
    }
    async searchUsers(searchDto, paginationQuery) {
        const { page = 1, limit = 10 } = paginationQuery;
        const offset = (page - 1) * limit;
        const searchCriteria = {
            ...searchDto,
            limit,
            offset,
        };
        const result = await this.userContextService.사용자를_검색한다(searchCriteria);
        const totalPages = Math.ceil(result.total / limit);
        return success_message_helper_1.SuccessMessageHelper.createPaginatedSuccessResponse(success_message_helper_1.SuccessMessageHelper.MESSAGES.USER_SEARCHED, result.data || [], {
            page,
            limit,
            total: result.total,
            totalPages,
        });
    }
    async getUserProfile(userId) {
        if (!userId || userId.trim().length === 0) {
            throw new Error('사용자 ID가 필요합니다.');
        }
        const result = await this.getProfile(userId);
        return success_message_helper_1.SuccessMessageHelper.createRetrievalSuccessResponse(success_message_helper_1.SuccessMessageHelper.MESSAGES.USER_PROFILE_RETRIEVED, result);
    }
    async getProfile(userId) {
        return this.userContextService.자신의_프로필을_조회한다(userId);
    }
    async manageDepartmentAuthority(departmentId, userId, type, action) {
        try {
            if (!departmentId || !userId) {
                throw new Error('부서 ID와 사용자 ID가 필요합니다.');
            }
            const department = await this.organizationContextService.findDepartmentById(departmentId);
            const updatedUser = await this.userContextService.사용자의_부서_권한을_변경한다(userId, department, type, action);
            return success_message_helper_1.SuccessMessageHelper.createUpdateSuccessResponse(success_message_helper_1.SuccessMessageHelper.MESSAGES.DEPARTMENT_AUTHORITY_UPDATED, updatedUser, [`${type}_authority`]);
        }
        catch (error) {
            this.logger.error(`부서 권한 관리 실패: ${departmentId}, ${userId}, ${type}, ${action}`, error.stack);
            throw new Error('부서 권한 관리 중 오류가 발생했습니다.');
        }
    }
};
exports.UserBusinessService = UserBusinessService;
exports.UserBusinessService = UserBusinessService = UserBusinessService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_context_service_1.UserContextService !== "undefined" && user_context_service_1.UserContextService) === "function" ? _a : Object, typeof (_b = typeof organization_context_service_1.OrganizationContextService !== "undefined" && organization_context_service_1.OrganizationContextService) === "function" ? _b : Object])
], UserBusinessService);


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SuccessMessageHelper = void 0;
const common_1 = __webpack_require__(1);
const success_messages_constants_1 = __webpack_require__(58);
const date_helper_1 = __webpack_require__(24);
class SuccessMessageHelper {
    static createSuccessResponse(message, data, meta) {
        const response = {
            success: true,
            message,
            timestamp: date_helper_1.DateHelper.now(),
            [success_messages_constants_1.SUCCESS_MESSAGE]: success_messages_constants_1.SUCCESS_MESSAGE,
            ...(data !== undefined && { data }),
            ...(meta && { meta }),
        };
        this.logger.log(`✅ ${message}`, {
            hasData: data !== undefined,
            hasMeta: meta !== undefined,
            timestamp: response.timestamp,
        });
        return response;
    }
    static createSuccessMessage(message) {
        return this.createSuccessResponse(message);
    }
    static createPaginatedSuccessResponse(message, data, meta) {
        const response = {
            success: true,
            message,
            data,
            meta,
            timestamp: date_helper_1.DateHelper.now(),
            [success_messages_constants_1.SUCCESS_MESSAGE]: success_messages_constants_1.SUCCESS_MESSAGE,
        };
        this.logger.log(`📄 ${message}`, {
            itemCount: data.length,
            page: meta.page,
            limit: meta.limit,
            total: meta.total,
            totalPages: meta.totalPages,
        });
        return response;
    }
    static createRetrievalSuccessResponse(message, data, count) {
        const response = {
            success: true,
            message,
            data,
            timestamp: date_helper_1.DateHelper.now(),
            [success_messages_constants_1.SUCCESS_MESSAGE]: success_messages_constants_1.SUCCESS_MESSAGE,
        };
        this.logger.log(`🔍 ${message}`, {
            dataType: typeof data,
            isArray: Array.isArray(data),
            count: count || (Array.isArray(data) ? data.length : 1),
        });
        return response;
    }
    static createCreationSuccessResponse(message, data) {
        const response = {
            success: true,
            message,
            data,
            timestamp: date_helper_1.DateHelper.now(),
            [success_messages_constants_1.SUCCESS_MESSAGE]: success_messages_constants_1.SUCCESS_MESSAGE,
        };
        this.logger.log(`➕ ${message}`, {
            createdItem: data,
        });
        return response;
    }
    static createUpdateSuccessResponse(message, data, changedFields) {
        const response = {
            success: true,
            message,
            data,
            timestamp: date_helper_1.DateHelper.now(),
            [success_messages_constants_1.SUCCESS_MESSAGE]: success_messages_constants_1.SUCCESS_MESSAGE,
        };
        this.logger.log(`✏️ ${message}`, {
            updatedItem: data,
            changedFields: changedFields || [],
        });
        return response;
    }
    static createDeletionSuccessResponse(message, deletedId, deletedCount) {
        const response = this.createSuccessMessage(message);
        this.logger.log(`🗑️ ${message}`, {
            deletedId,
            deletedCount: deletedCount || 1,
        });
        return response;
    }
    static createToggleSuccessResponse(message, data, fieldName, newValue) {
        const response = {
            success: true,
            message,
            data,
            timestamp: date_helper_1.DateHelper.now(),
            [success_messages_constants_1.SUCCESS_MESSAGE]: success_messages_constants_1.SUCCESS_MESSAGE,
        };
        this.logger.log(`🔄 ${message}`, {
            fieldName,
            newValue,
            toggledItem: data,
        });
        return response;
    }
    static createSyncSuccessResponse(message, syncedCount, syncDetails) {
        const response = this.createSuccessMessage(message);
        this.logger.log(`🔄 ${message}`, {
            syncedCount,
            syncDetails,
        });
        return response;
    }
    static get MESSAGES() {
        return success_messages_constants_1.SUCCESS_MESSAGES;
    }
    static get SYMBOL() {
        return success_messages_constants_1.SUCCESS_MESSAGE;
    }
}
exports.SuccessMessageHelper = SuccessMessageHelper;
SuccessMessageHelper.logger = new common_1.Logger(SuccessMessageHelper.name);


/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SUCCESS_MESSAGES = exports.SUCCESS_MESSAGE = void 0;
exports.SUCCESS_MESSAGE = Symbol('success_message');
exports.SUCCESS_MESSAGES = {
    USER_CREATED: '사용자가 성공적으로 생성되었습니다.',
    USER_UPDATED: '사용자 정보가 성공적으로 수정되었습니다.',
    USER_DELETED: '사용자가 성공적으로 삭제되었습니다.',
    USER_PROFILE_RETRIEVED: '사용자 프로필이 성공적으로 조회되었습니다.',
    USER_LIST_RETRIEVED: '사용자 목록이 성공적으로 조회되었습니다.',
    USER_SEARCHED: '사용자 검색이 성공적으로 완료되었습니다.',
    DEPARTMENT_AUTHORITY_UPDATED: '부서 권한이 성공적으로 변경되었습니다.',
    DEPARTMENT_CREATED: '부서가 성공적으로 생성되었습니다.',
    DEPARTMENT_UPDATED: '부서 정보가 성공적으로 수정되었습니다.',
    DEPARTMENT_DELETED: '부서가 성공적으로 삭제되었습니다.',
    DEPARTMENT_LIST_RETRIEVED: '부서 목록이 성공적으로 조회되었습니다.',
    DEPARTMENT_EXCLUSION_TOGGLED: '부서 제외 여부가 성공적으로 변경되었습니다.',
    EMPLOYEE_CREATED: '직원이 성공적으로 생성되었습니다.',
    EMPLOYEE_UPDATED: '직원 정보가 성공적으로 수정되었습니다.',
    EMPLOYEE_DELETED: '직원이 성공적으로 삭제되었습니다.',
    EMPLOYEE_LIST_RETRIEVED: '직원 목록이 성공적으로 조회되었습니다.',
    EMPLOYEE_EXCLUSION_TOGGLED: '직원 제외 여부가 성공적으로 변경되었습니다.',
    ORGANIZATION_SYNCED: '조직 동기화가 성공적으로 완료되었습니다.',
    ORGANIZATION_CHART_RETRIEVED: '조직도가 성공적으로 조회되었습니다.',
    LOGIN_SUCCESS: '로그인이 성공적으로 완료되었습니다.',
    LOGOUT_SUCCESS: '로그아웃이 성공적으로 완료되었습니다.',
    PASSWORD_CHANGED: '비밀번호가 성공적으로 변경되었습니다.',
    TOKEN_REFRESHED: '토큰이 성공적으로 갱신되었습니다.',
    REQUEST_SUCCESS: '요청이 성공적으로 처리되었습니다.',
    DATA_RETRIEVED: '데이터가 성공적으로 조회되었습니다.',
    DATA_SAVED: '데이터가 성공적으로 저장되었습니다.',
    DATA_UPDATED: '데이터가 성공적으로 수정되었습니다.',
    DATA_DELETED: '데이터가 성공적으로 삭제되었습니다.',
};


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OrganizationContextService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrganizationContextService = void 0;
const common_1 = __webpack_require__(1);
const axios_1 = __webpack_require__(60);
const department_domain_service_1 = __webpack_require__(61);
const employee_domain_service_1 = __webpack_require__(62);
const department_employee_domain_service_1 = __webpack_require__(63);
let OrganizationContextService = OrganizationContextService_1 = class OrganizationContextService {
    constructor(departmentDomainService, employeeDomainService, departmentEmployeeDomainService) {
        this.departmentDomainService = departmentDomainService;
        this.employeeDomainService = employeeDomainService;
        this.departmentEmployeeDomainService = departmentEmployeeDomainService;
        this.logger = new common_1.Logger(OrganizationContextService_1.name);
        this.MMS_BASE_URL = 'https://lumir-metadata-manager.vercel.app';
    }
    async getDepartmentsFromMMS() {
        try {
            const department = await axios_1.default.get(`${this.MMS_BASE_URL}/api/departments?hierarchy=true`);
            console.log('department:', department.data);
            return department.data;
        }
        catch (error) {
            this.logger.error('MMS 부서 데이터 조회 실패', error);
            throw new Error('MMS 부서 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    }
    async getEmployeesFromMMS() {
        try {
            const employee = await axios_1.default.get(`${this.MMS_BASE_URL}/api/employees`);
            console.log('employee:', employee.data);
            return employee.data;
        }
        catch (error) {
            this.logger.error('MMS 직원 데이터 조회 실패', error);
            throw new Error('MMS 직원 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    }
    async 부서를_업데이트하고_없는부서는_삭제한다() {
        try {
            const mmsDepartments = await this.getDepartmentsFromMMS();
            const existingDepartments = await this.departmentDomainService.findAllDepartments();
            for (const mmsDept of mmsDepartments) {
                await this.departmentDomainService.createOrUpdateDepartment(mmsDept);
            }
            const mmsIds = mmsDepartments.map((dept) => dept.id);
            for (const existingDept of existingDepartments) {
                if (existingDept.mmsDepartmentId && !mmsIds.includes(existingDept.mmsDepartmentId)) {
                    await this.departmentDomainService.removeDepartment(existingDept.departmentId);
                }
            }
            this.logger.log('부서 업데이트 및 삭제 완료');
        }
        catch (error) {
            this.logger.error('부서 업데이트 및 삭제 실패', error.stack);
            throw error;
        }
    }
    async 직원을_업데이트한다() {
        try {
            const mmsEmployees = await this.getEmployeesFromMMS();
            for (const mmsEmp of mmsEmployees) {
                this.logger.log(`직원 데이터 처리: ${mmsEmp.name}`);
            }
            this.logger.log('직원 업데이트 완료');
        }
        catch (error) {
            this.logger.error('직원 업데이트 실패', error.stack);
            throw error;
        }
    }
    async 직원_부서_중간테이블_데이터를_삭제_갱신한다() {
        try {
            await this.departmentEmployeeDomainService.deleteAllDepartmentEmployees();
            const employees = await this.employeeDomainService.findAllEmployees();
            for (const employee of employees) {
                if (employee.department) {
                    await this.departmentEmployeeDomainService.createDepartmentEmployee(employee.department, employee);
                }
            }
            this.logger.log('직원 부서 중간테이블 갱신 완료');
        }
        catch (error) {
            this.logger.error('직원 부서 중간테이블 갱신 실패', error.stack);
            throw error;
        }
    }
    async 페이지네이션된_부서_목록을_조회한다(limit, page) {
        const result = await this.departmentDomainService.findPaginatedDepartments(page, limit);
        return {
            data: result.departments,
            meta: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        };
    }
    async 부서의_제외_여부를_변경한다(departmentId) {
        return await this.departmentDomainService.toggleDepartmentExclusion(departmentId);
    }
    async 부서에_해당하는_직원_페이지네이션된_목록을_조회한다(departmentId, limit, page) {
        const result = { employees: [], total: 0 };
        return {
            data: result.employees,
            meta: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        };
    }
    async 직원들의_연차_정보를_갱신해서_보여준다() {
        this.logger.log('직원들의 연차 정보 갱신 완료');
    }
    async 직원의_제외_여부_변경한다(employeeId) {
        return await this.employeeDomainService.toggleEmployeeExclude(employeeId);
    }
    async 퇴사데이터가_있는_직원을_제외한_부서의_직원을_조회한다(departmentId) {
        return [];
    }
    async findDepartmentById(departmentId) {
        return await this.departmentDomainService.findDepartmentById(departmentId);
    }
};
exports.OrganizationContextService = OrganizationContextService;
exports.OrganizationContextService = OrganizationContextService = OrganizationContextService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof department_domain_service_1.DepartmentDomainService !== "undefined" && department_domain_service_1.DepartmentDomainService) === "function" ? _a : Object, typeof (_b = typeof employee_domain_service_1.EmployeeDomainService !== "undefined" && employee_domain_service_1.EmployeeDomainService) === "function" ? _b : Object, typeof (_c = typeof department_employee_domain_service_1.DepartmentEmployeeDomainService !== "undefined" && department_employee_domain_service_1.DepartmentEmployeeDomainService) === "function" ? _c : Object])
], OrganizationContextService);


/***/ }),
/* 60 */
/***/ ((module) => {

module.exports = require("axios");

/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var DepartmentDomainService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DepartmentDomainService = void 0;
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(15);
const department_info_entity_1 = __webpack_require__(19);
let DepartmentDomainService = DepartmentDomainService_1 = class DepartmentDomainService {
    constructor(departmentRepository) {
        this.departmentRepository = departmentRepository;
        this.logger = new common_1.Logger(DepartmentDomainService_1.name);
    }
    async findDepartmentById(departmentId) {
        return await this.departmentRepository.findOne({
            where: { departmentId },
            relations: ['employees', 'employees.employee', 'accessAuthorities', 'reviewAuthorities'],
        });
    }
    async findDepartmentByCode(departmentCode) {
        return await this.departmentRepository.findOne({
            where: { departmentCode },
        });
    }
    async findAllDepartments(isExclude) {
        const whereCondition = isExclude !== undefined ? { isExclude } : {};
        return await this.departmentRepository.find({
            where: whereCondition,
            order: { createdAt: 'DESC' },
            relations: ['employees', 'employees.employee'],
        });
    }
    async findPaginatedDepartments(page, limit, isExclude) {
        const skip = (page - 1) * limit;
        const whereCondition = isExclude !== undefined ? { isExclude } : {};
        const [departments, total] = await this.departmentRepository.findAndCount({
            where: whereCondition,
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
            relations: ['employees', 'employees.employee'],
        });
        this.logger.log(`페이지네이션된 부서 목록 조회: ${departments.length}개 조회`);
        return { departments, total };
    }
    async createDepartment(departmentData) {
        if (!departmentData.departmentName || !departmentData.departmentCode) {
            throw new common_1.BadRequestException('부서명과 부서코드가 필요합니다.');
        }
        const existingDepartment = await this.findDepartmentByCode(departmentData.departmentCode);
        if (existingDepartment) {
            throw new common_1.BadRequestException('이미 존재하는 부서코드입니다.');
        }
        const department = this.departmentRepository.create(departmentData);
        const savedDepartment = await this.departmentRepository.save(department);
        this.logger.log(`부서 생성 완료: ${savedDepartment.departmentName}`);
        return savedDepartment;
    }
    async updateDepartment(departmentId, updateData) {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new common_1.BadRequestException('부서 ID가 필요합니다.');
        }
        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new common_1.NotFoundException('부서를 찾을 수 없습니다.');
        }
        Object.assign(department, updateData);
        const updatedDepartment = await this.departmentRepository.save(department);
        this.logger.log(`부서 정보 수정 완료: ${updatedDepartment.departmentName}`);
        return updatedDepartment;
    }
    async toggleDepartmentExclusion(departmentId) {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new common_1.BadRequestException('부서 ID가 필요합니다.');
        }
        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new common_1.NotFoundException('부서를 찾을 수 없습니다.');
        }
        department.isExclude = !department.isExclude;
        const updatedDepartment = await this.departmentRepository.save(department);
        this.logger.log(`부서 제외 여부 변경: ${updatedDepartment.departmentName} -> ${updatedDepartment.isExclude}`);
        return updatedDepartment;
    }
    async findDepartmentByMMSDepartmentId(mmsDepartmentId) {
        return await this.departmentRepository.findOne({
            where: { mmsDepartmentId },
        });
    }
    async createOrUpdateDepartment(departmentData) {
        const existingDepartment = await this.findDepartmentByMMSDepartmentId(departmentData.id);
        if (existingDepartment) {
            Object.assign(existingDepartment, {
                departmentName: departmentData.department_name,
                departmentCode: departmentData.department_code,
                parentDepartmentId: departmentData.parent_department_id,
                isExclude: false,
            });
            const updatedDepartment = await this.departmentRepository.save(existingDepartment);
            this.logger.log(`MMS 부서 정보 업데이트: ${updatedDepartment.departmentName}`);
            return updatedDepartment;
        }
        else {
            const newDepartment = this.departmentRepository.create({
                mmsDepartmentId: departmentData.id,
                departmentName: departmentData.department_name,
                departmentCode: departmentData.department_code,
                parentDepartmentId: departmentData.parent_department_id,
                isExclude: false,
            });
            const savedDepartment = await this.departmentRepository.save(newDepartment);
            this.logger.log(`MMS 부서 생성: ${savedDepartment.departmentName}`);
            return savedDepartment;
        }
    }
    async removeDepartment(departmentId) {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new common_1.BadRequestException('부서 ID가 필요합니다.');
        }
        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new common_1.NotFoundException('부서를 찾을 수 없습니다.');
        }
        await this.departmentRepository.remove(department);
        this.logger.log(`부서 삭제 완료: ${department.departmentName}`);
    }
    async addReviewAuthority(departmentId, userId) {
        if (!departmentId || !userId) {
            throw new common_1.BadRequestException('부서 ID와 사용자 ID가 필요합니다.');
        }
        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new common_1.NotFoundException('부서를 찾을 수 없습니다.');
        }
        const hasAuthority = department.reviewAuthorities?.some((auth) => auth.userId === userId);
        if (hasAuthority) {
            throw new common_1.BadRequestException('이미 검토 권한이 있는 사용자입니다.');
        }
        if (!department.reviewAuthorities) {
            department.reviewAuthorities = [];
        }
        return department;
    }
    async removeReviewAuthority(departmentId, userId) {
        if (!departmentId || !userId) {
            throw new common_1.BadRequestException('부서 ID와 사용자 ID가 필요합니다.');
        }
        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new common_1.NotFoundException('부서를 찾을 수 없습니다.');
        }
        this.logger.log(`검토 권한 제거: ${userId} -> ${department.departmentName}`);
        return department;
    }
    async addAccessAuthority(departmentId, userId) {
        if (!departmentId || !userId) {
            throw new common_1.BadRequestException('부서 ID와 사용자 ID가 필요합니다.');
        }
        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new common_1.NotFoundException('부서를 찾을 수 없습니다.');
        }
        return department;
    }
    async removeAccessAuthority(departmentId, userId) {
        if (!departmentId || !userId) {
            throw new common_1.BadRequestException('부서 ID와 사용자 ID가 필요합니다.');
        }
        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new common_1.NotFoundException('부서를 찾을 수 없습니다.');
        }
        this.logger.log(`접근 권한 제거: ${userId} -> ${department.departmentName}`);
        return department;
    }
    async findDepartmentsByReviewAuthority(userId) {
        if (!userId) {
            throw new common_1.BadRequestException('사용자 ID가 필요합니다.');
        }
        this.logger.log(`검토 권한 부서 조회: ${userId}`);
        return [];
    }
    async findDepartmentsByAccessAuthority(userId) {
        if (!userId) {
            throw new common_1.BadRequestException('사용자 ID가 필요합니다.');
        }
        this.logger.log(`접근 권한 부서 조회: ${userId}`);
        return [];
    }
    async searchDepartments(searchCriteria) {
        const { departmentName, departmentCode, isExclude, keyword, limit = 10, offset = 0 } = searchCriteria;
        const whereConditions = [];
        if (keyword) {
            const keywordConditions = {
                departmentName: (0, typeorm_2.ILike)(`%${keyword}%`),
            };
            if (isExclude !== undefined) {
                keywordConditions.isExclude = isExclude;
            }
            whereConditions.push(keywordConditions);
            const codeConditions = {
                departmentCode: (0, typeorm_2.ILike)(`%${keyword}%`),
            };
            if (isExclude !== undefined) {
                codeConditions.isExclude = isExclude;
            }
            whereConditions.push(codeConditions);
        }
        else {
            const individualConditions = {};
            if (departmentName) {
                individualConditions.departmentName = (0, typeorm_2.ILike)(`%${departmentName}%`);
            }
            if (departmentCode) {
                individualConditions.departmentCode = (0, typeorm_2.ILike)(`%${departmentCode}%`);
            }
            if (isExclude !== undefined) {
                individualConditions.isExclude = isExclude;
            }
            if (Object.keys(individualConditions).length > 0) {
                whereConditions.push(individualConditions);
            }
        }
        const findOptions = {
            where: whereConditions.length > 0 ? whereConditions : isExclude !== undefined ? { isExclude } : undefined,
            order: { departmentName: 'ASC' },
            skip: offset,
            take: limit,
            relations: ['employees', 'employees.employee'],
        };
        const [departments, total] = await this.departmentRepository.findAndCount(findOptions);
        this.logger.log(`부서 검색 완료: ${departments.length}개 조회 (총 ${total}개)`);
        return { departments, total };
    }
    async searchDepartmentsByName(departmentName) {
        if (!departmentName || departmentName.trim().length === 0) {
            throw new common_1.BadRequestException('부서명이 필요합니다.');
        }
        const departments = await this.departmentRepository.find({
            where: { departmentName: (0, typeorm_2.ILike)(`%${departmentName}%`) },
            order: { departmentName: 'ASC' },
            relations: ['employees', 'employees.employee'],
        });
        this.logger.log(`부서명 검색 완료: ${departments.length}개 조회`);
        return departments;
    }
    async searchDepartmentsByCode(departmentCode) {
        if (!departmentCode || departmentCode.trim().length === 0) {
            throw new common_1.BadRequestException('부서 코드가 필요합니다.');
        }
        const departments = await this.departmentRepository.find({
            where: { departmentCode: (0, typeorm_2.ILike)(`%${departmentCode}%`) },
            order: { departmentName: 'ASC' },
            relations: ['employees', 'employees.employee'],
        });
        this.logger.log(`부서 코드 검색 완료: ${departments.length}개 조회`);
        return departments;
    }
    async findActiveDepartments() {
        const departments = await this.departmentRepository.find({
            where: { isExclude: false },
            order: { departmentName: 'ASC' },
            relations: ['employees', 'employees.employee'],
        });
        this.logger.log(`활성 부서 조회 완료: ${departments.length}개 조회`);
        return departments;
    }
    async findExcludedDepartments() {
        const departments = await this.departmentRepository.find({
            where: { isExclude: true },
            order: { departmentName: 'ASC' },
            relations: ['employees', 'employees.employee'],
        });
        this.logger.log(`제외된 부서 조회 완료: ${departments.length}개 조회`);
        return departments;
    }
};
exports.DepartmentDomainService = DepartmentDomainService;
exports.DepartmentDomainService = DepartmentDomainService = DepartmentDomainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(department_info_entity_1.DepartmentInfoEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], DepartmentDomainService);


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var EmployeeDomainService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmployeeDomainService = void 0;
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(15);
const employee_info_entity_1 = __webpack_require__(21);
let EmployeeDomainService = EmployeeDomainService_1 = class EmployeeDomainService {
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
        this.logger = new common_1.Logger(EmployeeDomainService_1.name);
    }
    async toggleEmployeeExclude(employeeId) {
        try {
            const employee = await this.findEmployeeById(employeeId);
            if (!employee) {
                throw new common_1.NotFoundException('직원을 찾을 수 없습니다.');
            }
            employee.isExcludedFromCalculation = !employee.isExcludedFromCalculation;
            const updatedEmployee = await this.employeeRepository.save(employee);
            this.logger.log(`직원 탈퇴 상태 토글 완료: ${updatedEmployee.employeeName} (${updatedEmployee.isExcludedFromCalculation})`);
            return updatedEmployee;
        }
        catch (error) {
            this.logger.error(`직원 탈퇴 상태 토글 실패: ${employeeId}`, error.stack);
            throw error;
        }
    }
    async findEmployeeById(employeeId) {
        return await this.employeeRepository.findOne({
            where: { employeeId },
            relations: ['department'],
        });
    }
    async findEmployeeByEmployeeNumber(employeeNumber) {
        return await this.employeeRepository.findOne({
            where: { employeeNumber },
            relations: ['department'],
        });
    }
    async findAllEmployees(isExclude) {
        const whereCondition = isExclude !== undefined ? { isExcludedFromCalculation: isExclude } : {};
        return await this.employeeRepository.find({
            where: whereCondition,
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
    }
    async findEmployeesByDepartmentWithQuitFilter(departmentId) {
        return await this.employeeRepository.find({
            where: {
                department: { departmentId },
                quitedAt: (0, typeorm_2.IsNull)(),
            },
            relations: ['department'],
            order: { employeeName: 'ASC' },
        });
    }
    async findActiveEmployees() {
        return await this.employeeRepository.find({
            where: { quitedAt: (0, typeorm_2.IsNull)() },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
    }
    async findInactiveEmployees() {
        return await this.employeeRepository.find({
            where: { quitedAt: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()) },
            relations: ['department'],
            order: { quitedAt: 'DESC' },
        });
    }
    async searchEmployeesWithCriteria(searchCriteria) {
        const { employeeName, employeeNumber, departmentId, isExcludedFromCalculation, keyword, limit = 10, offset = 0, } = searchCriteria;
        const whereConditions = [];
        if (keyword) {
            const keywordConditions = {
                employeeName: (0, typeorm_2.ILike)(`%${keyword}%`),
            };
            if (isExcludedFromCalculation !== undefined) {
                keywordConditions.isExcludedFromCalculation = isExcludedFromCalculation;
            }
            if (departmentId) {
                keywordConditions.department = { departmentId };
            }
            whereConditions.push(keywordConditions);
            const numberConditions = {
                employeeNumber: (0, typeorm_2.ILike)(`%${keyword}%`),
            };
            if (isExcludedFromCalculation !== undefined) {
                numberConditions.isExcludedFromCalculation = isExcludedFromCalculation;
            }
            if (departmentId) {
                numberConditions.department = { departmentId };
            }
            whereConditions.push(numberConditions);
        }
        else {
            const individualConditions = {};
            if (employeeName) {
                individualConditions.employeeName = (0, typeorm_2.ILike)(`%${employeeName}%`);
            }
            if (employeeNumber) {
                individualConditions.employeeNumber = (0, typeorm_2.ILike)(`%${employeeNumber}%`);
            }
            if (departmentId) {
                individualConditions.department = { departmentId };
            }
            if (isExcludedFromCalculation !== undefined) {
                individualConditions.isExcludedFromCalculation = isExcludedFromCalculation;
            }
            if (Object.keys(individualConditions).length > 0) {
                whereConditions.push(individualConditions);
            }
        }
        const findOptions = {
            where: whereConditions.length > 0 ? whereConditions : undefined,
            order: { employeeName: 'ASC' },
            skip: offset,
            take: limit,
            relations: ['department'],
        };
        const [employees, total] = await this.employeeRepository.findAndCount(findOptions);
        this.logger.log(`직원 검색 완료: ${employees.length}명 조회 (총 ${total}명)`);
        return { employees, total };
    }
    async searchEmployees(searchTerm) {
        return await this.employeeRepository.find({
            where: [{ employeeName: (0, typeorm_2.Like)(`%${searchTerm}%`) }, { employeeNumber: (0, typeorm_2.Like)(`%${searchTerm}%`) }],
            relations: ['department'],
            order: { employeeName: 'ASC' },
        });
    }
    async searchEmployeesByName(employeeName) {
        if (!employeeName || employeeName.trim().length === 0) {
            throw new common_1.BadRequestException('직원명이 필요합니다.');
        }
        const employees = await this.employeeRepository.find({
            where: { employeeName: (0, typeorm_2.ILike)(`%${employeeName}%`) },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
        this.logger.log(`직원명 검색 완료: ${employees.length}명 조회`);
        return employees;
    }
    async searchEmployeesByNumber(employeeNumber) {
        if (!employeeNumber || employeeNumber.trim().length === 0) {
            throw new common_1.BadRequestException('사원번호가 필요합니다.');
        }
        const employees = await this.employeeRepository.find({
            where: { employeeNumber: (0, typeorm_2.ILike)(`%${employeeNumber}%`) },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
        this.logger.log(`사원번호 검색 완료: ${employees.length}명 조회`);
        return employees;
    }
    async findActiveEmployeesByDepartment(departmentId) {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new common_1.BadRequestException('부서 ID가 필요합니다.');
        }
        const employees = await this.employeeRepository.find({
            where: {
                department: { departmentId },
                quitedAt: (0, typeorm_2.IsNull)(),
            },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
        this.logger.log(`부서별 활성 직원 조회 완료: ${employees.length}명 조회`);
        return employees;
    }
    async findIncludedEmployees() {
        const employees = await this.employeeRepository.find({
            where: { isExcludedFromCalculation: false },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
        this.logger.log(`계산 포함 직원 조회 완료: ${employees.length}명 조회`);
        return employees;
    }
    async findExcludedEmployees() {
        const employees = await this.employeeRepository.find({
            where: { isExcludedFromCalculation: true },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
        this.logger.log(`계산 제외 직원 조회 완료: ${employees.length}명 조회`);
        return employees;
    }
    async saveEmployee(employee) {
        return await this.employeeRepository.save(employee);
    }
};
exports.EmployeeDomainService = EmployeeDomainService;
exports.EmployeeDomainService = EmployeeDomainService = EmployeeDomainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_info_entity_1.EmployeeInfoEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], EmployeeDomainService);


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var DepartmentEmployeeDomainService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DepartmentEmployeeDomainService = void 0;
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(15);
const department_employee_entity_1 = __webpack_require__(20);
let DepartmentEmployeeDomainService = DepartmentEmployeeDomainService_1 = class DepartmentEmployeeDomainService {
    constructor(departmentEmployeeRepository) {
        this.departmentEmployeeRepository = departmentEmployeeRepository;
        this.logger = new common_1.Logger(DepartmentEmployeeDomainService_1.name);
    }
    async createDepartmentEmployee(department, employee) {
        try {
            const departmentEmployee = new department_employee_entity_1.DepartmentEmployeeEntity();
            departmentEmployee.department = department;
            departmentEmployee.employee = employee;
            const savedRelation = await this.departmentEmployeeRepository.save(departmentEmployee);
            this.logger.log(`부서-직원 관계 생성: ${department.departmentName} -> ${employee.employeeName}`);
            return savedRelation;
        }
        catch (error) {
            this.logger.error(`부서-직원 관계 생성 실패: ${department.departmentName} -> ${employee.employeeName}`, error.stack);
            throw error;
        }
    }
    async saveDepartmentEmployee(departmentEmployee) {
        try {
            const savedRelation = await this.departmentEmployeeRepository.save(departmentEmployee);
            this.logger.log('부서-직원 관계 저장 완료');
            return savedRelation;
        }
        catch (error) {
            this.logger.error('부서-직원 관계 저장 실패', error.stack);
            throw error;
        }
    }
    async deleteDepartmentEmployeeByEmployeeId(employeeId) {
        try {
            await this.departmentEmployeeRepository.delete({ employee: { employeeId } });
            this.logger.log(`직원 ID로 부서-직원 관계 삭제: ${employeeId}`);
        }
        catch (error) {
            this.logger.error(`직원 ID로 부서-직원 관계 삭제 실패: ${employeeId}`, error.stack);
            throw error;
        }
    }
    async deleteDepartmentEmployeeByDepartmentId(departmentId) {
        try {
            await this.departmentEmployeeRepository.delete({ department: { departmentId } });
            this.logger.log(`부서 ID로 부서-직원 관계 삭제: ${departmentId}`);
        }
        catch (error) {
            this.logger.error(`부서 ID로 부서-직원 관계 삭제 실패: ${departmentId}`, error.stack);
            throw error;
        }
    }
    async findDepartmentEmployeesByDepartmentId(departmentId) {
        try {
            const relations = await this.departmentEmployeeRepository.find({
                where: { department: { departmentId } },
                relations: ['department', 'employee'],
            });
            this.logger.log(`부서별 직원 관계 조회: ${departmentId} -> ${relations.length}개`);
            return relations;
        }
        catch (error) {
            this.logger.error(`부서별 직원 관계 조회 실패: ${departmentId}`, error.stack);
            throw error;
        }
    }
    async findDepartmentEmployeesByEmployeeId(employeeId) {
        try {
            const relations = await this.departmentEmployeeRepository.find({
                where: { employee: { employeeId } },
                relations: ['department', 'employee'],
            });
            this.logger.log(`직원별 부서 관계 조회: ${employeeId} -> ${relations.length}개`);
            return relations;
        }
        catch (error) {
            this.logger.error(`직원별 부서 관계 조회 실패: ${employeeId}`, error.stack);
            throw error;
        }
    }
    async deleteAllDepartmentEmployees() {
        try {
            await this.departmentEmployeeRepository.clear();
            this.logger.log('모든 부서-직원 관계 삭제 완료');
        }
        catch (error) {
            this.logger.error('모든 부서-직원 관계 삭제 실패', error.stack);
            throw error;
        }
    }
    async existsDepartmentEmployee(departmentId, employeeId) {
        try {
            const count = await this.departmentEmployeeRepository.count({
                where: {
                    department: { departmentId },
                    employee: { employeeId },
                },
            });
            return count > 0;
        }
        catch (error) {
            this.logger.error(`부서-직원 관계 존재 여부 확인 실패: ${departmentId} -> ${employeeId}`, error.stack);
            throw error;
        }
    }
};
exports.DepartmentEmployeeDomainService = DepartmentEmployeeDomainService;
exports.DepartmentEmployeeDomainService = DepartmentEmployeeDomainService = DepartmentEmployeeDomainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(department_employee_entity_1.DepartmentEmployeeEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], DepartmentEmployeeDomainService);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrganizationContextModule = void 0;
const common_1 = __webpack_require__(1);
const organization_context_service_1 = __webpack_require__(59);
const organization_domain_module_1 = __webpack_require__(65);
let OrganizationContextModule = class OrganizationContextModule {
};
exports.OrganizationContextModule = OrganizationContextModule;
exports.OrganizationContextModule = OrganizationContextModule = __decorate([
    (0, common_1.Module)({
        imports: [organization_domain_module_1.OrganizationDomainModule],
        providers: [organization_context_service_1.OrganizationContextService],
        exports: [organization_context_service_1.OrganizationContextService],
    })
], OrganizationContextModule);


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrganizationDomainModule = void 0;
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(9);
const department_info_entity_1 = __webpack_require__(19);
const department_employee_entity_1 = __webpack_require__(20);
const employee_info_entity_1 = __webpack_require__(21);
const department_domain_service_1 = __webpack_require__(61);
const employee_domain_service_1 = __webpack_require__(62);
const department_employee_domain_service_1 = __webpack_require__(63);
let OrganizationDomainModule = class OrganizationDomainModule {
};
exports.OrganizationDomainModule = OrganizationDomainModule;
exports.OrganizationDomainModule = OrganizationDomainModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([department_info_entity_1.DepartmentInfoEntity, department_employee_entity_1.DepartmentEmployeeEntity, employee_info_entity_1.EmployeeInfoEntity])],
        providers: [department_domain_service_1.DepartmentDomainService, employee_domain_service_1.EmployeeDomainService, department_employee_domain_service_1.DepartmentEmployeeDomainService],
        exports: [department_domain_service_1.DepartmentDomainService, employee_domain_service_1.EmployeeDomainService, department_employee_domain_service_1.DepartmentEmployeeDomainService],
    })
], OrganizationDomainModule);


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrganizationBusinessModule = void 0;
const common_1 = __webpack_require__(1);
const organization_business_1 = __webpack_require__(67);
const organization_context_module_1 = __webpack_require__(64);
const organization_controller_1 = __webpack_require__(69);
const departments_controller_1 = __webpack_require__(71);
const employees_controller_1 = __webpack_require__(74);
let OrganizationBusinessModule = class OrganizationBusinessModule {
};
exports.OrganizationBusinessModule = OrganizationBusinessModule;
exports.OrganizationBusinessModule = OrganizationBusinessModule = __decorate([
    (0, common_1.Module)({
        imports: [organization_context_module_1.OrganizationContextModule],
        providers: [organization_business_1.OrganizationBusinessService],
        controllers: [organization_controller_1.OrganizationController, departments_controller_1.DepartmentsController, employees_controller_1.EmployeesController],
        exports: [organization_business_1.OrganizationBusinessService],
    })
], OrganizationBusinessModule);


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OrganizationBusinessService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrganizationBusinessService = void 0;
const common_1 = __webpack_require__(1);
const organization_context_service_1 = __webpack_require__(59);
const employee_response_dto_1 = __webpack_require__(68);
const success_message_helper_1 = __webpack_require__(57);
const class_transformer_1 = __webpack_require__(38);
let OrganizationBusinessService = OrganizationBusinessService_1 = class OrganizationBusinessService {
    constructor(organizationContextService) {
        this.organizationContextService = organizationContextService;
        this.logger = new common_1.Logger(OrganizationBusinessService_1.name);
    }
    async syncOrganization() {
        try {
            await this.organizationContextService.부서를_업데이트하고_없는부서는_삭제한다();
            await this.organizationContextService.직원을_업데이트한다();
            await this.organizationContextService.직원_부서_중간테이블_데이터를_삭제_갱신한다();
            this.logger.log('조직 동기화 완료');
            return success_message_helper_1.SuccessMessageHelper.createSyncSuccessResponse(success_message_helper_1.SuccessMessageHelper.MESSAGES.ORGANIZATION_SYNCED);
        }
        catch (error) {
            this.logger.error('조직 동기화 실패', error.stack);
            throw new Error('조직 동기화 중 오류가 발생했습니다. 관리자에게 문의하세요.');
        }
    }
    async getDepartmentList(paginationQuery) {
        if (!paginationQuery.page || !paginationQuery.limit) {
            throw new Error('페이지 정보가 필요합니다.');
        }
        const { page = 1, limit = 10 } = paginationQuery;
        const result = await this.organizationContextService.페이지네이션된_부서_목록을_조회한다(limit, page);
        return success_message_helper_1.SuccessMessageHelper.createPaginatedSuccessResponse(success_message_helper_1.SuccessMessageHelper.MESSAGES.DEPARTMENT_LIST_RETRIEVED, result.data || [], result.meta || { page, limit, total: 0, totalPages: 0 });
    }
    async toggleDepartmentExclusion(departmentId) {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new Error('부서 ID가 필요합니다.');
        }
        const result = await this.organizationContextService.부서의_제외_여부를_변경한다(departmentId);
        return success_message_helper_1.SuccessMessageHelper.createToggleSuccessResponse(success_message_helper_1.SuccessMessageHelper.MESSAGES.DEPARTMENT_EXCLUSION_TOGGLED, result, 'isExclude', result.isExclude);
    }
    async getEmployeeListByDepartment(departmentId, paginationQuery) {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new Error('부서 ID가 필요합니다.');
        }
        if (!paginationQuery.page || !paginationQuery.limit) {
            throw new Error('페이지 정보가 필요합니다.');
        }
        const { page = 1, limit = 10 } = paginationQuery;
        const result = await this.organizationContextService.부서에_해당하는_직원_페이지네이션된_목록을_조회한다(departmentId, limit, page);
        await this.organizationContextService.직원들의_연차_정보를_갱신해서_보여준다();
        return success_message_helper_1.SuccessMessageHelper.createPaginatedSuccessResponse(success_message_helper_1.SuccessMessageHelper.MESSAGES.EMPLOYEE_LIST_RETRIEVED, result.data || [], result.meta || { page, limit, total: 0, totalPages: 0 });
    }
    async toggleEmployeeExclusion(employeeId) {
        if (!employeeId || employeeId.trim().length === 0) {
            throw new Error('직원 ID가 필요합니다.');
        }
        const result = await this.organizationContextService.직원의_제외_여부_변경한다(employeeId);
        const employeeDto = (0, class_transformer_1.plainToInstance)(employee_response_dto_1.EmployeeResponseDto, result);
        return success_message_helper_1.SuccessMessageHelper.createToggleSuccessResponse(success_message_helper_1.SuccessMessageHelper.MESSAGES.EMPLOYEE_EXCLUSION_TOGGLED, employeeDto, 'isExcludedFromCalculation', result.isExcludedFromCalculation);
    }
    async getActiveEmployeesByDepartment(departmentId) {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new Error('부서 ID가 필요합니다.');
        }
        const result = await this.organizationContextService.퇴사데이터가_있는_직원을_제외한_부서의_직원을_조회한다(departmentId);
        const employeeDtos = result.map((employee) => (0, class_transformer_1.plainToInstance)(employee_response_dto_1.EmployeeResponseDto, employee));
        return success_message_helper_1.SuccessMessageHelper.createRetrievalSuccessResponse(success_message_helper_1.SuccessMessageHelper.MESSAGES.EMPLOYEE_LIST_RETRIEVED, employeeDtos, employeeDtos.length);
    }
};
exports.OrganizationBusinessService = OrganizationBusinessService;
exports.OrganizationBusinessService = OrganizationBusinessService = OrganizationBusinessService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof organization_context_service_1.OrganizationContextService !== "undefined" && organization_context_service_1.OrganizationContextService) === "function" ? _a : Object])
], OrganizationBusinessService);


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmployeeResponseDto = void 0;
const swagger_1 = __webpack_require__(22);
const class_transformer_1 = __webpack_require__(38);
let EmployeeResponseDto = class EmployeeResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.EmployeeResponseDto = EmployeeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '직원 고유 ID',
        example: 'employee-uuid-123',
        format: 'uuid',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '직원명',
        example: '김개발',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "employeeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '직원 번호',
        example: 'EMP001',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "employeeNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'MMS 직원 ID',
        example: 'mms_emp_001',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "mmsEmployeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '계산 제외 여부',
        example: false,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], EmployeeResponseDto.prototype, "isExcludedFromCalculation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '소속 부서ID',
        example: 'department-uuid',
        required: false,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '직원 생성일',
        example: '2025-01-01T00:00:00.000Z',
        format: 'date-time',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], EmployeeResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '직원 수정일',
        example: '2025-01-01T00:00:00.000Z',
        format: 'date-time',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], EmployeeResponseDto.prototype, "updatedAt", void 0);
exports.EmployeeResponseDto = EmployeeResponseDto = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [typeof (_a = typeof Partial !== "undefined" && Partial) === "function" ? _a : Object])
], EmployeeResponseDto);


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrganizationController = void 0;
const common_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(22);
const organization_business_1 = __webpack_require__(67);
const jwt_auth_guard_1 = __webpack_require__(43);
const roles_guard_1 = __webpack_require__(51);
const roles_decorator_1 = __webpack_require__(70);
const user_enum_1 = __webpack_require__(16);
const error_response_dto_1 = __webpack_require__(52);
let OrganizationController = class OrganizationController {
    constructor(organizationBusinessService) {
        this.organizationBusinessService = organizationBusinessService;
    }
    async syncOrganization() {
        return this.organizationBusinessService.syncOrganization();
    }
};
exports.OrganizationController = OrganizationController;
__decorate([
    (0, common_1.Post)('sync'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '조직 동기화',
        description: 'MMS 시스템과 조직 데이터를 동기화합니다. 부서와 직원 정보를 업데이트합니다.',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: '접근 권한 없음 - 관리자 권한 필요',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: '서버 내부 오류',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], OrganizationController.prototype, "syncOrganization", null);
exports.OrganizationController = OrganizationController = __decorate([
    (0, swagger_1.ApiTags)('조직 관리 (Organization)'),
    (0, common_1.Controller)('organization'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof organization_business_1.OrganizationBusinessService !== "undefined" && organization_business_1.OrganizationBusinessService) === "function" ? _a : Object])
], OrganizationController);


/***/ }),
/* 70 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = void 0;
const common_1 = __webpack_require__(1);
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DepartmentsController = void 0;
const common_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(22);
const organization_business_1 = __webpack_require__(67);
const jwt_auth_guard_1 = __webpack_require__(43);
const roles_guard_1 = __webpack_require__(51);
const roles_decorator_1 = __webpack_require__(70);
const user_enum_1 = __webpack_require__(16);
const department_response_dto_1 = __webpack_require__(72);
const pagination_query_dto_1 = __webpack_require__(73);
const pagination_response_dto_1 = __webpack_require__(41);
const error_response_dto_1 = __webpack_require__(52);
let DepartmentsController = class DepartmentsController {
    constructor(organizationBusinessService) {
        this.organizationBusinessService = organizationBusinessService;
    }
    async getDepartments(paginationQuery) {
        return this.organizationBusinessService.getDepartmentList(paginationQuery);
    }
    async toggleDepartmentExclusion(departmentId) {
        return this.organizationBusinessService.toggleDepartmentExclusion(departmentId);
    }
};
exports.DepartmentsController = DepartmentsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '부서 목록 조회',
        description: '페이지네이션된 부서 목록을 조회합니다. 관리자만 접근 가능합니다.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: '페이지 번호 (기본값: 1)',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: '페이지당 항목 수 (기본값: 10)',
        example: 10,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '부서 목록이 성공적으로 조회되었습니다.',
        type: (pagination_response_dto_1.PaginatedResponseDto),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: '접근 권한 없음 - 관리자 권한 필요',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: '서버 내부 오류',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof pagination_query_dto_1.PaginationQueryDto !== "undefined" && pagination_query_dto_1.PaginationQueryDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], DepartmentsController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Put)(':departmentId/toggle-exclude'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '부서 제외 여부 변경',
        description: '특정 부서의 제외 여부를 토글합니다. 관리자만 접근 가능합니다.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'departmentId',
        description: '부서 ID (UUID)',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '부서 제외 여부가 성공적으로 변경되었습니다.',
        type: department_response_dto_1.DepartmentResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: '접근 권한 없음 - 관리자 권한 필요',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '부서를 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: '서버 내부 오류',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('departmentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], DepartmentsController.prototype, "toggleDepartmentExclusion", null);
exports.DepartmentsController = DepartmentsController = __decorate([
    (0, swagger_1.ApiTags)('부서 관리 (Departments)'),
    (0, common_1.Controller)('departments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof organization_business_1.OrganizationBusinessService !== "undefined" && organization_business_1.OrganizationBusinessService) === "function" ? _a : Object])
], DepartmentsController);


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DepartmentResponseDto = void 0;
const swagger_1 = __webpack_require__(22);
const class_transformer_1 = __webpack_require__(38);
let DepartmentResponseDto = class DepartmentResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.DepartmentResponseDto = DepartmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서 고유 ID',
        example: 'b520bc5c-d90d-4ec6-aa27-d527e05a2f28',
        format: 'uuid',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서명',
        example: '개발',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "departmentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서코드',
        example: 'DEV001',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "departmentCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'MMS 부서ID',
        example: 'mms_dept_001',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "mmsDepartmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서 제외 여부',
        example: false,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], DepartmentResponseDto.prototype, "isExclude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '상위 부서ID',
        example: 'parent-dept-uuid',
        format: 'uuid',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "parentDepartmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '조직 정보 ID',
        example: 'org-chart-uuid',
        format: 'uuid',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "orgChartInfoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서 생성일',
        example: '2025-01-01T00:00:00.000Z',
        format: 'date-time',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], DepartmentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서 수정일',
        example: '2025-01-01T00:00:00.000Z',
        format: 'date-time',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], DepartmentResponseDto.prototype, "updatedAt", void 0);
exports.DepartmentResponseDto = DepartmentResponseDto = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [typeof (_a = typeof Partial !== "undefined" && Partial) === "function" ? _a : Object])
], DepartmentResponseDto);


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaginationQueryDto = void 0;
const swagger_1 = __webpack_require__(22);
const class_validator_1 = __webpack_require__(49);
const class_transformer_1 = __webpack_require__(38);
class PaginationQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.PaginationQueryDto = PaginationQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number (1-based)',
        example: 1,
        minimum: 1,
        maximum: 1000,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    (0, class_validator_1.IsInt)({ message: 'Page must be an integer' }),
    (0, class_validator_1.Min)(1, { message: 'Page must be at least 1' }),
    (0, class_validator_1.Max)(1000, { message: 'Page must be at most 1000' }),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        example: 10,
        minimum: 1,
        maximum: 100,
        default: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    (0, class_validator_1.IsInt)({ message: 'Limit must be an integer' }),
    (0, class_validator_1.Min)(1, { message: 'Limit must be at least 1' }),
    (0, class_validator_1.Max)(100, { message: 'Limit must be at most 100' }),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "limit", void 0);


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmployeesController = void 0;
const common_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(22);
const jwt_auth_guard_1 = __webpack_require__(43);
const roles_guard_1 = __webpack_require__(51);
const roles_decorator_1 = __webpack_require__(70);
const user_enum_1 = __webpack_require__(16);
const organization_business_1 = __webpack_require__(67);
let EmployeesController = class EmployeesController {
    constructor(organizationBusinessService) {
        this.organizationBusinessService = organizationBusinessService;
    }
    async toggleEmployeeExclusion(employeeId) {
        return await this.organizationBusinessService.toggleEmployeeExclusion(employeeId);
    }
};
exports.EmployeesController = EmployeesController;
__decorate([
    (0, common_1.Put)(':employeeId/toggle-exclusion'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '직원 제외 상태 토글',
        description: '직원의 계산 제외 여부를 토글합니다.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'employeeId',
        description: '직원 ID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '직원 제외 상태가 성공적으로 변경되었습니다.',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '직원 제외 여부가 성공적으로 변경되었습니다.' },
                data: { $ref: '#/components/schemas/EmployeeResponseDto' },
                timestamp: { type: 'string', format: 'date-time' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], EmployeesController.prototype, "toggleEmployeeExclusion", null);
exports.EmployeesController = EmployeesController = __decorate([
    (0, swagger_1.ApiTags)('employees'),
    (0, common_1.Controller)('employees'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof organization_business_1.OrganizationBusinessService !== "undefined" && organization_business_1.OrganizationBusinessService) === "function" ? _a : Object])
], EmployeesController);


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkStandardModule = void 0;
const common_1 = __webpack_require__(1);
const work_standard_controller_1 = __webpack_require__(76);
const work_standard_business_1 = __webpack_require__(77);
const work_standard_context_module_1 = __webpack_require__(91);
let WorkStandardModule = class WorkStandardModule {
};
exports.WorkStandardModule = WorkStandardModule;
exports.WorkStandardModule = WorkStandardModule = __decorate([
    (0, common_1.Module)({
        imports: [work_standard_context_module_1.WorkStandardContextModule],
        controllers: [work_standard_controller_1.WorkStandardController],
        providers: [work_standard_business_1.WorkStandardBusinessService],
        exports: [work_standard_business_1.WorkStandardBusinessService],
    })
], WorkStandardModule);


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkStandardController = void 0;
const common_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(22);
const work_standard_business_1 = __webpack_require__(77);
const attendance_type_response_dto_1 = __webpack_require__(83);
const attendance_type_list_response_dto_1 = __webpack_require__(84);
const holiday_response_dto_1 = __webpack_require__(85);
const holiday_list_response_dto_1 = __webpack_require__(86);
const create_attendance_type_dto_1 = __webpack_require__(87);
const update_attendance_type_dto_1 = __webpack_require__(88);
const create_holiday_dto_1 = __webpack_require__(89);
const update_holiday_dto_1 = __webpack_require__(90);
const error_response_dto_1 = __webpack_require__(52);
let WorkStandardController = class WorkStandardController {
    constructor(workStandardBusinessService) {
        this.workStandardBusinessService = workStandardBusinessService;
    }
    async getAttendanceTypes(page = 1, limit = 10) {
        return await this.workStandardBusinessService.getAttendanceTypeList(limit, page);
    }
    async getAllAttendanceTypes() {
        return await this.workStandardBusinessService.getAllAttendanceTypes();
    }
    async getAttendanceTypeById(id) {
        return await this.workStandardBusinessService.getAttendanceTypeById(id);
    }
    async createAttendanceType(dto) {
        return await this.workStandardBusinessService.createAttendanceType(dto);
    }
    async updateAttendanceType(id, dto) {
        return await this.workStandardBusinessService.updateAttendanceType(id, dto);
    }
    async deleteAttendanceType(id) {
        return await this.workStandardBusinessService.deleteAttendanceType(id);
    }
    async getHolidays(year, page = 1, limit = 10) {
        return await this.workStandardBusinessService.getHolidayList(year, limit, page);
    }
    async createHoliday(dto) {
        return await this.workStandardBusinessService.createHoliday(dto);
    }
    async updateHoliday(id, dto) {
        return await this.workStandardBusinessService.updateHoliday(id, dto);
    }
    async deleteHoliday(id) {
        return await this.workStandardBusinessService.deleteHoliday(id);
    }
    async initializeSeedData() {
        await this.workStandardBusinessService.initializeSeedData();
        return true;
    }
};
exports.WorkStandardController = WorkStandardController;
__decorate([
    (0, common_1.Get)('attendance-types'),
    (0, swagger_1.ApiOperation)({
        summary: '근무 유형 목록 조회',
        description: '페이지네이션된 근무 유형 목록을 조회합니다',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        description: '페이지 번호 (1부터 시작)',
        type: 'integer',
        example: 1,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        description: '페이지당 항목 수',
        type: 'integer',
        example: 10,
        required: false,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '근무 유형 목록 조회 성공',
        type: attendance_type_list_response_dto_1.AttendanceTypeListResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: '서버 내부 오류',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], WorkStandardController.prototype, "getAttendanceTypes", null);
__decorate([
    (0, common_1.Get)('attendance-types/all'),
    (0, swagger_1.ApiOperation)({
        summary: '모든 근무 유형 조회',
        description: '페이지네이션 없이 모든 근무 유형을 조회합니다',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '모든 근무 유형 조회 성공',
        type: [attendance_type_response_dto_1.AttendanceTypeResponseDto],
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], WorkStandardController.prototype, "getAllAttendanceTypes", null);
__decorate([
    (0, common_1.Get)('attendance-types/:id'),
    (0, swagger_1.ApiOperation)({
        summary: '근무 유형 상세 조회',
        description: 'ID로 특정 근무 유형을 조회합니다',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: '근무 유형 ID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '근무 유형 조회 성공',
        type: attendance_type_response_dto_1.AttendanceTypeResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '근무 유형을 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], WorkStandardController.prototype, "getAttendanceTypeById", null);
__decorate([
    (0, common_1.Post)('attendance-types'),
    (0, swagger_1.ApiOperation)({
        summary: '근무 유형 생성',
        description: '새로운 근무 유형을 생성합니다',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: '근무 유형 생성 성공',
        type: attendance_type_response_dto_1.AttendanceTypeResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 요청 데이터',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof create_attendance_type_dto_1.CreateAttendanceTypeDto !== "undefined" && create_attendance_type_dto_1.CreateAttendanceTypeDto) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], WorkStandardController.prototype, "createAttendanceType", null);
__decorate([
    (0, common_1.Put)('attendance-types/:id'),
    (0, swagger_1.ApiOperation)({
        summary: '근무 유형 수정',
        description: '기존 근무 유형을 수정합니다',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: '근무 유형 ID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '근무 유형 수정 성공',
        type: attendance_type_response_dto_1.AttendanceTypeResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 요청 데이터',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '근무 유형을 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_g = typeof update_attendance_type_dto_1.UpdateAttendanceTypeDto !== "undefined" && update_attendance_type_dto_1.UpdateAttendanceTypeDto) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], WorkStandardController.prototype, "updateAttendanceType", null);
__decorate([
    (0, common_1.Delete)('attendance-types/:id'),
    (0, swagger_1.ApiOperation)({
        summary: '근무 유형 삭제',
        description: '기존 근무 유형을 삭제합니다',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: '근무 유형 ID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '근무 유형 삭제 성공',
        schema: {
            type: 'boolean',
            example: true,
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '근무 유형을 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], WorkStandardController.prototype, "deleteAttendanceType", null);
__decorate([
    (0, common_1.Get)('holidays'),
    (0, swagger_1.ApiOperation)({
        summary: '공휴일 목록 조회',
        description: '연도별 페이지네이션된 공휴일 목록을 조회합니다',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'year',
        description: '조회할 연도',
        type: 'integer',
        example: 2024,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        description: '페이지 번호 (1부터 시작)',
        type: 'integer',
        example: 1,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        description: '페이지당 항목 수',
        type: 'integer',
        example: 10,
        required: false,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '공휴일 목록 조회 성공',
        type: holiday_list_response_dto_1.HolidayListResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], WorkStandardController.prototype, "getHolidays", null);
__decorate([
    (0, common_1.Post)('holidays'),
    (0, swagger_1.ApiOperation)({
        summary: '공휴일 생성',
        description: '새로운 공휴일을 생성합니다',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: '공휴일 생성 성공',
        type: holiday_response_dto_1.HolidayResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 요청 데이터',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: '해당 날짜에 이미 공휴일이 존재함',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof create_holiday_dto_1.CreateHolidayDto !== "undefined" && create_holiday_dto_1.CreateHolidayDto) === "function" ? _l : Object]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], WorkStandardController.prototype, "createHoliday", null);
__decorate([
    (0, common_1.Put)('holidays/:id'),
    (0, swagger_1.ApiOperation)({
        summary: '공휴일 수정',
        description: '기존 공휴일을 수정합니다',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: '공휴일 ID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '공휴일 수정 성공',
        type: holiday_response_dto_1.HolidayResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 요청 데이터',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '공휴일을 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: '해당 날짜에 이미 공휴일이 존재함',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_o = typeof update_holiday_dto_1.UpdateHolidayDto !== "undefined" && update_holiday_dto_1.UpdateHolidayDto) === "function" ? _o : Object]),
    __metadata("design:returntype", typeof (_p = typeof Promise !== "undefined" && Promise) === "function" ? _p : Object)
], WorkStandardController.prototype, "updateHoliday", null);
__decorate([
    (0, common_1.Delete)('holidays/:id'),
    (0, swagger_1.ApiOperation)({
        summary: '공휴일 삭제',
        description: '기존 공휴일을 삭제합니다',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: '공휴일 ID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '공휴일 삭제 성공',
        schema: {
            type: 'boolean',
            example: true,
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '공휴일을 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_q = typeof Promise !== "undefined" && Promise) === "function" ? _q : Object)
], WorkStandardController.prototype, "deleteHoliday", null);
__decorate([
    (0, common_1.Post)('seed-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'SEED 데이터 초기화',
        description: '시스템 초기 데이터를 설정합니다',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'SEED 데이터 초기화 성공',
        schema: {
            type: 'boolean',
            example: true,
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: '권한 부족',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_r = typeof Promise !== "undefined" && Promise) === "function" ? _r : Object)
], WorkStandardController.prototype, "initializeSeedData", null);
exports.WorkStandardController = WorkStandardController = __decorate([
    (0, swagger_1.ApiTags)('work-standard'),
    (0, common_1.Controller)({ path: 'work-standard', version: '1' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof work_standard_business_1.WorkStandardBusinessService !== "undefined" && work_standard_business_1.WorkStandardBusinessService) === "function" ? _a : Object])
], WorkStandardController);


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WorkStandardBusinessService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkStandardBusinessService = void 0;
const common_1 = __webpack_require__(1);
const work_standard_context_service_1 = __webpack_require__(78);
const attendance_type_response_dto_1 = __webpack_require__(83);
const attendance_type_list_response_dto_1 = __webpack_require__(84);
const holiday_response_dto_1 = __webpack_require__(85);
const holiday_list_response_dto_1 = __webpack_require__(86);
let WorkStandardBusinessService = WorkStandardBusinessService_1 = class WorkStandardBusinessService {
    constructor(workStandardContextService) {
        this.workStandardContextService = workStandardContextService;
        this.logger = new common_1.Logger(WorkStandardBusinessService_1.name);
    }
    async initializeSeedData() {
        await this.workStandardContextService.SEED_데이터_초기화_설정한다();
        this.logger.log('SEED 데이터 초기화 완료');
    }
    async getAttendanceTypeList(limit, page) {
        const result = await this.workStandardContextService.페이지네이션된_근무_유형_목록_조회한다(limit, page);
        return new attendance_type_list_response_dto_1.AttendanceTypeListResponseDto({
            attendanceTypes: attendance_type_response_dto_1.AttendanceTypeResponseDto.fromEntities(result.attendanceTypes),
            total: result.total,
            page: result.page,
            limit: result.limit,
        });
    }
    async createAttendanceType(dto) {
        const entity = await this.workStandardContextService.근무_유형을_생성한다(dto);
        return attendance_type_response_dto_1.AttendanceTypeResponseDto.fromEntity(entity);
    }
    async updateAttendanceType(attendanceTypeId, dto) {
        const entity = await this.workStandardContextService.근무_유형을_업데이트한다(attendanceTypeId, dto);
        return attendance_type_response_dto_1.AttendanceTypeResponseDto.fromEntity(entity);
    }
    async deleteAttendanceType(attendanceTypeId) {
        return await this.workStandardContextService.근무_유형을_삭제한다(attendanceTypeId);
    }
    async getAttendanceTypeById(attendanceTypeId) {
        const entity = await this.workStandardContextService.근무_유형_ID로_조회한다(attendanceTypeId);
        return entity ? attendance_type_response_dto_1.AttendanceTypeResponseDto.fromEntity(entity) : null;
    }
    async getAllAttendanceTypes() {
        const entities = await this.workStandardContextService.모든_근무_유형을_조회한다();
        return attendance_type_response_dto_1.AttendanceTypeResponseDto.fromEntities(entities);
    }
    async getHolidayList(year, limit, page) {
        const result = await this.workStandardContextService.페이지네이션된_연도별_휴일_목록_조회한다(year, limit, page);
        return new holiday_list_response_dto_1.HolidayListResponseDto({
            holidays: holiday_response_dto_1.HolidayResponseDto.fromEntities(result.holidays),
            total: result.total,
            page: result.page,
            limit: result.limit,
            year: result.year,
        });
    }
    async createHoliday(dto) {
        const entity = await this.workStandardContextService.관리자는_휴일을_생성한다(dto.holidayDate, dto.holidayName);
        await this.workStandardContextService.일간_이벤트_요약에_공휴일이_변경된다(dto.holidayDate);
        const year = parseInt(dto.holidayDate.split('-')[0]);
        const month = parseInt(dto.holidayDate.split('-')[1]);
        await this.workStandardContextService.월간_이벤트_요약에_공휴일이_변경된다(year, month);
        return holiday_response_dto_1.HolidayResponseDto.fromEntity(entity);
    }
    async updateHoliday(holidayId, dto) {
        const existingHoliday = await this.workStandardContextService.휴일_ID를_체크한다(holidayId);
        const holidayDate = dto.holidayDate ?? existingHoliday.holidayDate;
        const holidayName = dto.holidayName ?? existingHoliday.holidayName;
        const entity = await this.workStandardContextService.관리자는_휴일을_업데이트한다(holidayId, holidayDate, holidayName);
        await this.workStandardContextService.일간_이벤트_요약에_공휴일이_변경된다(holidayDate);
        const year = parseInt(holidayDate.split('-')[0]);
        const month = parseInt(holidayDate.split('-')[1]);
        await this.workStandardContextService.월간_이벤트_요약에_공휴일이_변경된다(year, month);
        return holiday_response_dto_1.HolidayResponseDto.fromEntity(entity);
    }
    async deleteHoliday(holidayId) {
        const holiday = await this.workStandardContextService.휴일_ID를_체크한다(holidayId);
        const isDeleted = await this.workStandardContextService.관리자는_휴일을_삭제한다(holidayId);
        if (isDeleted) {
            await this.workStandardContextService.일간_이벤트_요약에_공휴일이_변경된다(holiday.holidayDate);
            const year = parseInt(holiday.holidayDate.split('-')[0]);
            const month = parseInt(holiday.holidayDate.split('-')[1]);
            await this.workStandardContextService.월간_이벤트_요약에_공휴일이_변경된다(year, month);
        }
        return isDeleted;
    }
};
exports.WorkStandardBusinessService = WorkStandardBusinessService;
exports.WorkStandardBusinessService = WorkStandardBusinessService = WorkStandardBusinessService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof work_standard_context_service_1.WorkStandardContextService !== "undefined" && work_standard_context_service_1.WorkStandardContextService) === "function" ? _a : Object])
], WorkStandardBusinessService);


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WorkStandardContextService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkStandardContextService = void 0;
const common_1 = __webpack_require__(1);
const attendance_type_domain_service_1 = __webpack_require__(79);
const holiday_domain_service_1 = __webpack_require__(81);
let WorkStandardContextService = WorkStandardContextService_1 = class WorkStandardContextService {
    constructor(attendanceTypeDomainService, holidayDomainService) {
        this.attendanceTypeDomainService = attendanceTypeDomainService;
        this.holidayDomainService = holidayDomainService;
        this.logger = new common_1.Logger(WorkStandardContextService_1.name);
    }
    async 페이지네이션된_근무_유형_목록_조회한다(limit, page) {
        const { attendanceTypes, total } = await this.attendanceTypeDomainService.findAttendanceTypes(page, limit, undefined, { createdAt: 'DESC' });
        this.logger.log(`근무 유형 목록 조회 완료: ${attendanceTypes.length}개 (페이지: ${page}, 제한: ${limit})`);
        return {
            attendanceTypes,
            total,
            page,
            limit,
        };
    }
    async 근무_유형_ID로_조회한다(attendanceTypeId) {
        const attendanceType = await this.attendanceTypeDomainService.findAttendanceTypeById(attendanceTypeId);
        if (attendanceType) {
            this.logger.log(`근무 유형 조회 완료: ${attendanceType.title} (ID: ${attendanceTypeId})`);
        }
        else {
            this.logger.warn(`근무 유형을 찾을 수 없음: ${attendanceTypeId}`);
        }
        return attendanceType;
    }
    async 근무_유형을_생성한다(attendanceTypeData) {
        const savedAttendanceType = await this.attendanceTypeDomainService.createAttendanceType(attendanceTypeData);
        this.logger.log(`근무 유형 생성 완료: ${savedAttendanceType.title} (ID: ${savedAttendanceType.attendanceTypeId})`);
        return savedAttendanceType;
    }
    async 근무_유형을_업데이트한다(attendanceTypeId, updateData) {
        const updatedAttendanceType = await this.attendanceTypeDomainService.updateAttendanceType(attendanceTypeId, updateData);
        if (updatedAttendanceType) {
            this.logger.log(`근무 유형 업데이트 완료: ${updatedAttendanceType.title} (ID: ${attendanceTypeId})`);
        }
        return updatedAttendanceType;
    }
    async 근무_유형을_삭제한다(attendanceTypeId) {
        const isDeleted = await this.attendanceTypeDomainService.deleteAttendanceType(attendanceTypeId);
        if (isDeleted) {
            this.logger.log(`근무 유형 삭제 완료: ${attendanceTypeId}`);
        }
        else {
            this.logger.warn(`삭제할 근무 유형을 찾을 수 없음: ${attendanceTypeId}`);
        }
        return isDeleted;
    }
    async 모든_근무_유형을_조회한다() {
        const attendanceTypes = await this.attendanceTypeDomainService.findAllAttendanceTypes();
        this.logger.log(`모든 근무 유형 조회 완료: ${attendanceTypes.length}개`);
        return attendanceTypes;
    }
    async 페이지네이션된_연도별_휴일_목록_조회한다(year, limit, page) {
        const { holidays, total } = await this.holidayDomainService.findHolidaysByYear(year, page, limit, {
            holidayDate: 'ASC',
        });
        this.logger.log(`${year}년 휴일 목록 조회 완료: ${holidays.length}개 (페이지: ${page}, 제한: ${limit})`);
        return {
            holidays,
            total,
            page,
            limit,
            year,
        };
    }
    async 휴일_ID를_체크한다(holidayId) {
        const holiday = await this.holidayDomainService.findHolidayById(holidayId);
        if (!holiday) {
            throw new Error(`휴일을 찾을 수 없습니다: ${holidayId}`);
        }
        this.logger.log(`휴일 ID 체크 완료: ${holiday.holidayName} (ID: ${holidayId})`);
        return holiday;
    }
    async 관리자는_휴일을_생성한다(date, holidayName) {
        try {
            const existingHoliday = await this.holidayDomainService.findHolidayByDate(date);
            if (existingHoliday) {
                throw new Error(`해당 날짜에 이미 휴일이 존재합니다: ${date}`);
            }
            const savedHoliday = await this.holidayDomainService.createHoliday({
                holidayDate: date,
                holidayName,
            });
            this.logger.log(`휴일 생성 완료: ${savedHoliday.holidayName} (날짜: ${date})`);
            return savedHoliday;
        }
        catch (error) {
            this.logger.error(`휴일 생성 실패: ${date} - ${holidayName}`, error);
            throw error;
        }
    }
    async 관리자는_휴일을_업데이트한다(holidayId, date, holidayName) {
        try {
            await this.휴일_ID를_체크한다(holidayId);
            const existingHoliday = await this.holidayDomainService.findHolidayByDate(date);
            if (existingHoliday && existingHoliday.holidayId !== holidayId) {
                throw new Error(`해당 날짜에 이미 휴일이 존재합니다: ${date}`);
            }
            const updatedHoliday = await this.holidayDomainService.updateHoliday(holidayId, {
                holidayDate: date,
                holidayName,
            });
            this.logger.log(`휴일 업데이트 완료: ${updatedHoliday.holidayName} (날짜: ${date})`);
            return updatedHoliday;
        }
        catch (error) {
            this.logger.error(`휴일 업데이트 실패: ${holidayId} - ${date} - ${holidayName}`, error);
            throw error;
        }
    }
    async 관리자는_휴일을_삭제한다(holidayId) {
        try {
            const holiday = await this.휴일_ID를_체크한다(holidayId);
            const isDeleted = await this.holidayDomainService.deleteHoliday(holidayId);
            if (isDeleted) {
                this.logger.log(`휴일 삭제 완료: ${holiday.holidayName} (날짜: ${holiday.holidayDate})`);
            }
            return isDeleted;
        }
        catch (error) {
            this.logger.error(`휴일 삭제 실패: ${holidayId}`, error);
            throw error;
        }
    }
    async 일간_이벤트_요약에_공휴일이_변경된다(date) {
        this.logger.log(`일간 이벤트 요약 업데이트 예정: ${date}`);
    }
    async 월간_이벤트_요약에_공휴일이_변경된다(year, month) {
        this.logger.log(`월간 이벤트 요약 업데이트 예정: ${year}-${month}`);
    }
    async SEED_데이터_초기화_설정한다() {
        this.logger.log('SEED 데이터 초기화 설정 완료');
    }
};
exports.WorkStandardContextService = WorkStandardContextService;
exports.WorkStandardContextService = WorkStandardContextService = WorkStandardContextService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof attendance_type_domain_service_1.AttendanceTypeDomainService !== "undefined" && attendance_type_domain_service_1.AttendanceTypeDomainService) === "function" ? _a : Object, typeof (_b = typeof holiday_domain_service_1.HolidayDomainService !== "undefined" && holiday_domain_service_1.HolidayDomainService) === "function" ? _b : Object])
], WorkStandardContextService);


/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var AttendanceTypeDomainService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AttendanceTypeDomainService = void 0;
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(15);
const attendance_type_entity_1 = __webpack_require__(80);
let AttendanceTypeDomainService = AttendanceTypeDomainService_1 = class AttendanceTypeDomainService {
    constructor(attendanceTypeRepository) {
        this.attendanceTypeRepository = attendanceTypeRepository;
        this.logger = new common_1.Logger(AttendanceTypeDomainService_1.name);
    }
    async findAttendanceTypeById(attendanceTypeId) {
        return await this.attendanceTypeRepository.findOne({
            where: { attendanceTypeId },
        });
    }
    async findAttendanceTypes(page = 1, limit = 10, where, order) {
        const skip = (page - 1) * limit;
        const take = limit;
        const [attendanceTypes, total] = await Promise.all([
            this.attendanceTypeRepository.find({ where, order, skip, take }),
            this.attendanceTypeRepository.count({ where }),
        ]);
        return { attendanceTypes, total };
    }
    async createAttendanceType(attendanceTypeData) {
        const newAttendanceType = this.attendanceTypeRepository.create(attendanceTypeData);
        return await this.attendanceTypeRepository.save(newAttendanceType);
    }
    async updateAttendanceType(attendanceTypeId, updateData) {
        await this.attendanceTypeRepository.update(attendanceTypeId, updateData);
        return await this.findAttendanceTypeById(attendanceTypeId);
    }
    async deleteAttendanceType(attendanceTypeId) {
        const result = await this.attendanceTypeRepository.delete(attendanceTypeId);
        return result.affected > 0;
    }
    async saveAttendanceType(attendanceType) {
        return await this.attendanceTypeRepository.save(attendanceType);
    }
    async findAllAttendanceTypes() {
        return await this.attendanceTypeRepository.find();
    }
};
exports.AttendanceTypeDomainService = AttendanceTypeDomainService;
exports.AttendanceTypeDomainService = AttendanceTypeDomainService = AttendanceTypeDomainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_type_entity_1.AttendanceTypeEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], AttendanceTypeDomainService);


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AttendanceTypeEntity = void 0;
const typeorm_1 = __webpack_require__(15);
let AttendanceTypeEntity = class AttendanceTypeEntity {
    updateAttendanceTypeEntity(dto) {
        for (const key in dto) {
            if (dto[key]) {
                this[key] = dto[key];
            }
        }
    }
    calculateWorkTime() {
        if (this.workTime < 60)
            this.workTime = this.workTime * 60;
    }
};
exports.AttendanceTypeEntity = AttendanceTypeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AttendanceTypeEntity.prototype, "attendanceTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AttendanceTypeEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AttendanceTypeEntity.prototype, "workTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], AttendanceTypeEntity.prototype, "isRecognizedWorkTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], AttendanceTypeEntity.prototype, "startWorkTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], AttendanceTypeEntity.prototype, "endWorkTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], AttendanceTypeEntity.prototype, "deductedAnnualLeave", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], AttendanceTypeEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], AttendanceTypeEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AttendanceTypeEntity.prototype, "calculateWorkTime", null);
exports.AttendanceTypeEntity = AttendanceTypeEntity = __decorate([
    (0, typeorm_1.Entity)()
], AttendanceTypeEntity);


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var HolidayDomainService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HolidayDomainService = void 0;
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(9);
const typeorm_2 = __webpack_require__(15);
const holiday_info_entity_1 = __webpack_require__(82);
let HolidayDomainService = HolidayDomainService_1 = class HolidayDomainService {
    constructor(holidayRepository) {
        this.holidayRepository = holidayRepository;
        this.logger = new common_1.Logger(HolidayDomainService_1.name);
    }
    async findHolidayById(holidayId) {
        return await this.holidayRepository.findOne({
            where: { holidayId },
        });
    }
    async findHolidaysByYear(year, page = 1, limit = 10, order) {
        const where = {
            holidayDate: `${year}-%`,
        };
        const skip = (page - 1) * limit;
        const take = limit;
        const [holidays, total] = await Promise.all([
            this.holidayRepository.find({ where, order, skip, take }),
            this.holidayRepository.count({ where }),
        ]);
        return { holidays, total };
    }
    async findHolidays(page = 1, limit = 10, where, order) {
        const skip = (page - 1) * limit;
        const take = limit;
        const [holidays, total] = await Promise.all([
            this.holidayRepository.find({ where, order, skip, take }),
            this.holidayRepository.count({ where }),
        ]);
        return { holidays, total };
    }
    async createHoliday(holidayData) {
        const newHoliday = this.holidayRepository.create(holidayData);
        return await this.holidayRepository.save(newHoliday);
    }
    async updateHoliday(holidayId, updateData) {
        await this.holidayRepository.update(holidayId, updateData);
        return await this.findHolidayById(holidayId);
    }
    async deleteHoliday(holidayId) {
        const result = await this.holidayRepository.delete(holidayId);
        return result.affected > 0;
    }
    async saveHoliday(holiday) {
        return await this.holidayRepository.save(holiday);
    }
    async findAllHolidays() {
        return await this.holidayRepository.find();
    }
    async findHolidayByDate(holidayDate) {
        const holidays = await this.holidayRepository.find({
            where: { holidayDate },
        });
        return holidays.length > 0 ? holidays[0] : null;
    }
};
exports.HolidayDomainService = HolidayDomainService;
exports.HolidayDomainService = HolidayDomainService = HolidayDomainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(holiday_info_entity_1.HolidayInfoEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], HolidayDomainService);


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HolidayInfoEntity = void 0;
const typeorm_1 = __webpack_require__(15);
let HolidayInfoEntity = class HolidayInfoEntity {
};
exports.HolidayInfoEntity = HolidayInfoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], HolidayInfoEntity.prototype, "holidayId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HolidayInfoEntity.prototype, "holidayName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HolidayInfoEntity.prototype, "holidayDate", void 0);
exports.HolidayInfoEntity = HolidayInfoEntity = __decorate([
    (0, typeorm_1.Entity)()
], HolidayInfoEntity);


/***/ }),
/* 83 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AttendanceTypeResponseDto = void 0;
const swagger_1 = __webpack_require__(22);
class AttendanceTypeResponseDto {
    constructor(entity) {
        this.attendanceTypeId = entity.attendanceTypeId;
        this.title = entity.title;
        this.workTime = entity.workTime;
        this.isRecognizedWorkTime = entity.isRecognizedWorkTime;
        this.startWorkTime = entity.startWorkTime;
        this.endWorkTime = entity.endWorkTime;
        this.deductedAnnualLeave = entity.deductedAnnualLeave;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
    }
    static fromEntity(entity) {
        return new AttendanceTypeResponseDto(entity);
    }
    static fromEntities(entities) {
        return entities.map((entity) => AttendanceTypeResponseDto.fromEntity(entity));
    }
}
exports.AttendanceTypeResponseDto = AttendanceTypeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '근무 유형 ID',
        example: 'uuid-string',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], AttendanceTypeResponseDto.prototype, "attendanceTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '근무 유형 제목',
        example: '정규근무',
    }),
    __metadata("design:type", String)
], AttendanceTypeResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '근무 시간 (분)',
        example: 480,
        type: 'integer',
    }),
    __metadata("design:type", Number)
], AttendanceTypeResponseDto.prototype, "workTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '인정 근무 시간 여부',
        example: true,
    }),
    __metadata("design:type", Boolean)
], AttendanceTypeResponseDto.prototype, "isRecognizedWorkTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '시작 근무 시간',
        example: '09:00',
        nullable: true,
    }),
    __metadata("design:type", String)
], AttendanceTypeResponseDto.prototype, "startWorkTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '종료 근무 시간',
        example: '18:00',
        nullable: true,
    }),
    __metadata("design:type", String)
], AttendanceTypeResponseDto.prototype, "endWorkTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '차감 연차',
        example: 0,
        type: 'number',
        format: 'float',
    }),
    __metadata("design:type", Number)
], AttendanceTypeResponseDto.prototype, "deductedAnnualLeave", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '생성일시',
        example: '2023-12-01T10:00:00Z',
        format: 'date-time',
    }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], AttendanceTypeResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '수정일시',
        example: '2023-12-01T10:00:00Z',
        format: 'date-time',
    }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], AttendanceTypeResponseDto.prototype, "updatedAt", void 0);


/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AttendanceTypeListResponseDto = void 0;
const swagger_1 = __webpack_require__(22);
const attendance_type_response_dto_1 = __webpack_require__(83);
class AttendanceTypeListResponseDto {
    constructor(data) {
        this.attendanceTypes = data.attendanceTypes;
        this.total = data.total;
        this.page = data.page;
        this.limit = data.limit;
    }
}
exports.AttendanceTypeListResponseDto = AttendanceTypeListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '근무 유형 목록',
        type: [attendance_type_response_dto_1.AttendanceTypeResponseDto],
    }),
    __metadata("design:type", Array)
], AttendanceTypeListResponseDto.prototype, "attendanceTypes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '전체 개수',
        example: 10,
        type: 'integer',
    }),
    __metadata("design:type", Number)
], AttendanceTypeListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '현재 페이지',
        example: 1,
        type: 'integer',
    }),
    __metadata("design:type", Number)
], AttendanceTypeListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '페이지당 항목 수',
        example: 10,
        type: 'integer',
    }),
    __metadata("design:type", Number)
], AttendanceTypeListResponseDto.prototype, "limit", void 0);


/***/ }),
/* 85 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HolidayResponseDto = void 0;
const swagger_1 = __webpack_require__(22);
class HolidayResponseDto {
    constructor(entity) {
        this.holidayId = entity.holidayId;
        this.holidayName = entity.holidayName;
        this.holidayDate = entity.holidayDate;
    }
    static fromEntity(entity) {
        return new HolidayResponseDto(entity);
    }
    static fromEntities(entities) {
        return entities.map((entity) => HolidayResponseDto.fromEntity(entity));
    }
}
exports.HolidayResponseDto = HolidayResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공휴일 ID',
        example: 'uuid-string',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], HolidayResponseDto.prototype, "holidayId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공휴일 이름',
        example: '신정',
    }),
    __metadata("design:type", String)
], HolidayResponseDto.prototype, "holidayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공휴일 날짜',
        example: '2024-01-01',
        format: 'date',
    }),
    __metadata("design:type", String)
], HolidayResponseDto.prototype, "holidayDate", void 0);


/***/ }),
/* 86 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HolidayListResponseDto = void 0;
const swagger_1 = __webpack_require__(22);
const holiday_response_dto_1 = __webpack_require__(85);
class HolidayListResponseDto {
    constructor(data) {
        this.holidays = data.holidays;
        this.total = data.total;
        this.page = data.page;
        this.limit = data.limit;
        this.year = data.year;
    }
}
exports.HolidayListResponseDto = HolidayListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공휴일 목록',
        type: [holiday_response_dto_1.HolidayResponseDto],
    }),
    __metadata("design:type", Array)
], HolidayListResponseDto.prototype, "holidays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '전체 개수',
        example: 15,
        type: 'integer',
    }),
    __metadata("design:type", Number)
], HolidayListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '현재 페이지',
        example: 1,
        type: 'integer',
    }),
    __metadata("design:type", Number)
], HolidayListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '페이지당 항목 수',
        example: 10,
        type: 'integer',
    }),
    __metadata("design:type", Number)
], HolidayListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '조회 연도',
        example: 2024,
        type: 'integer',
    }),
    __metadata("design:type", Number)
], HolidayListResponseDto.prototype, "year", void 0);


/***/ }),
/* 87 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAttendanceTypeDto = void 0;
const swagger_1 = __webpack_require__(22);
const class_validator_1 = __webpack_require__(49);
class CreateAttendanceTypeDto {
    constructor() {
        this.deductedAnnualLeave = 0;
    }
}
exports.CreateAttendanceTypeDto = CreateAttendanceTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '근무 유형 제목',
        example: '정규근무',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAttendanceTypeDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '근무 시간 (분)',
        example: 480,
        minimum: 0,
        maximum: 1440,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1440),
    __metadata("design:type", Number)
], CreateAttendanceTypeDto.prototype, "workTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '인정 근무 시간 여부',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAttendanceTypeDto.prototype, "isRecognizedWorkTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '시작 근무 시간',
        example: '09:00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAttendanceTypeDto.prototype, "startWorkTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '종료 근무 시간',
        example: '18:00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAttendanceTypeDto.prototype, "endWorkTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '차감 연차',
        example: 0,
        default: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateAttendanceTypeDto.prototype, "deductedAnnualLeave", void 0);


/***/ }),
/* 88 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateAttendanceTypeDto = void 0;
const swagger_1 = __webpack_require__(22);
const class_validator_1 = __webpack_require__(49);
class UpdateAttendanceTypeDto {
}
exports.UpdateAttendanceTypeDto = UpdateAttendanceTypeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '근무 유형 제목',
        example: '정규근무',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAttendanceTypeDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '근무 시간 (분)',
        example: 480,
        minimum: 0,
        maximum: 1440,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1440),
    __metadata("design:type", Number)
], UpdateAttendanceTypeDto.prototype, "workTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '인정 근무 시간 여부',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAttendanceTypeDto.prototype, "isRecognizedWorkTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '시작 근무 시간',
        example: '09:00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAttendanceTypeDto.prototype, "startWorkTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '종료 근무 시간',
        example: '18:00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAttendanceTypeDto.prototype, "endWorkTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '차감 연차',
        example: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateAttendanceTypeDto.prototype, "deductedAnnualLeave", void 0);


/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateHolidayDto = void 0;
const swagger_1 = __webpack_require__(22);
const class_validator_1 = __webpack_require__(49);
class CreateHolidayDto {
}
exports.CreateHolidayDto = CreateHolidayDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공휴일 이름',
        example: '신정',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHolidayDto.prototype, "holidayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공휴일 날짜',
        example: '2024-01-01',
        format: 'date',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateHolidayDto.prototype, "holidayDate", void 0);


/***/ }),
/* 90 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateHolidayDto = void 0;
const swagger_1 = __webpack_require__(22);
const class_validator_1 = __webpack_require__(49);
class UpdateHolidayDto {
}
exports.UpdateHolidayDto = UpdateHolidayDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '공휴일 이름',
        example: '신정',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHolidayDto.prototype, "holidayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '공휴일 날짜',
        example: '2024-01-01',
        format: 'date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateHolidayDto.prototype, "holidayDate", void 0);


/***/ }),
/* 91 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkStandardContextModule = void 0;
const common_1 = __webpack_require__(1);
const attendance_type_module_1 = __webpack_require__(92);
const holiday_module_1 = __webpack_require__(93);
const work_standard_context_service_1 = __webpack_require__(78);
let WorkStandardContextModule = class WorkStandardContextModule {
};
exports.WorkStandardContextModule = WorkStandardContextModule;
exports.WorkStandardContextModule = WorkStandardContextModule = __decorate([
    (0, common_1.Module)({
        imports: [attendance_type_module_1.AttendanceTypeModule, holiday_module_1.HolidayModule],
        providers: [work_standard_context_service_1.WorkStandardContextService],
        exports: [work_standard_context_service_1.WorkStandardContextService],
    })
], WorkStandardContextModule);


/***/ }),
/* 92 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AttendanceTypeModule = void 0;
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(9);
const attendance_type_entity_1 = __webpack_require__(80);
const attendance_type_domain_service_1 = __webpack_require__(79);
let AttendanceTypeModule = class AttendanceTypeModule {
};
exports.AttendanceTypeModule = AttendanceTypeModule;
exports.AttendanceTypeModule = AttendanceTypeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([attendance_type_entity_1.AttendanceTypeEntity])],
        providers: [attendance_type_domain_service_1.AttendanceTypeDomainService],
        exports: [attendance_type_domain_service_1.AttendanceTypeDomainService],
    })
], AttendanceTypeModule);


/***/ }),
/* 93 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HolidayModule = void 0;
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(9);
const holiday_info_entity_1 = __webpack_require__(82);
const holiday_domain_service_1 = __webpack_require__(81);
let HolidayModule = class HolidayModule {
};
exports.HolidayModule = HolidayModule;
exports.HolidayModule = HolidayModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([holiday_info_entity_1.HolidayInfoEntity])],
        providers: [holiday_domain_service_1.HolidayDomainService],
        exports: [holiday_domain_service_1.HolidayDomainService],
    })
], HolidayModule);


/***/ }),
/* 94 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JWT_CONFIG = void 0;
const dotenv_1 = __webpack_require__(95);
const config_1 = __webpack_require__(8);
(0, dotenv_1.config)();
exports["default"] = (0, config_1.registerAs)('database', () => {
    return {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
        username: process.env.POSTGRES_USER || 'admin',
        password: process.env.POSTGRES_PASSWORD || '1234',
        database: process.env.POSTGRES_DB || 'attendance-server',
    };
});
exports.JWT_CONFIG = (0, config_1.registerAs)('jwt', () => {
    return {
        secret: process.env.GLOBAL_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    };
});


/***/ }),
/* 95 */
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),
/* 96 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResponseInterceptor = void 0;
const common_1 = __webpack_require__(1);
const operators_1 = __webpack_require__(97);
const date_helper_1 = __webpack_require__(24);
let ResponseInterceptor = class ResponseInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((result) => {
            if (result === undefined || result === null) {
                return {
                    success: true,
                    message: '요청이 성공적으로 처리되었습니다.',
                    timestamp: date_helper_1.DateHelper.now(),
                    data: null,
                };
            }
            const hasDataProperty = result && typeof result === 'object' && 'data' in result;
            return {
                success: true,
                message: result.message || '요청이 성공적으로 처리되었습니다.',
                timestamp: date_helper_1.DateHelper.now(),
                data: hasDataProperty ? result.data : result,
                ...(result && typeof result === 'object' && 'meta' in result && { meta: result.meta }),
            };
        }));
    }
};
exports.ResponseInterceptor = ResponseInterceptor;
exports.ResponseInterceptor = ResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseInterceptor);


/***/ }),
/* 97 */
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ }),
/* 98 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.settingSwagger = settingSwagger;
const swagger_1 = __webpack_require__(22);
async function settingSwagger(app) {
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Integrated API')
        .setDescription('통합 API 문서')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup(`api/docs`, app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            filter: true,
            docExpansion: 'none',
            displayRequestDuration: true,
            defaultModelsExpandDepth: -1,
            defaultModelExpandDepth: 3,
            tryItOutEnabled: true,
            syntaxHighlight: {
                activate: true,
                theme: 'monokai',
            },
        },
        customSiteTitle: 'Integrated API',
    });
}


/***/ }),
/* 99 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggingInterceptor = void 0;
const common_1 = __webpack_require__(1);
const operators_1 = __webpack_require__(97);
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    constructor() {
        this.logger = new common_1.Logger(LoggingInterceptor_1.name);
    }
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const method = req.method;
        const url = req.url;
        const now = Date.now();
        this.logger.log(`Incoming Request: ${method} ${url}, Body: ${JSON.stringify(req.body)}`);
        return next.handle().pipe((0, operators_1.tap)(() => {
            const statusCode = res.statusCode;
            const responseTime = Date.now() - now;
            this.logger.log(`Outgoing Response: ${method} ${url} ${statusCode} - ${responseTime}ms`);
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const path_1 = __webpack_require__(3);
const app_module_1 = __webpack_require__(4);
const jwt_auth_guard_1 = __webpack_require__(43);
const roles_guard_1 = __webpack_require__(51);
const response_interceptor_1 = __webpack_require__(96);
const swagger_util_1 = __webpack_require__(98);
const logging_interceptor_1 = __webpack_require__(99);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(app.get(core_1.Reflector)), new roles_guard_1.RolesGuard(app.get(core_1.Reflector)));
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor(), new logging_interceptor_1.LoggingInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    const uploadPath = (0, path_1.join)(process.cwd(), 'public');
    app.useStaticAssets(uploadPath, {
        prefix: '/public',
        index: false,
        fallthrough: false,
    });
    (0, swagger_util_1.settingSwagger)(app);
    await app.listen(process.env.PORT || 5000);
}
bootstrap();

})();

/******/ })()
;