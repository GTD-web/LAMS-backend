"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDepartmentAuthorityDomainModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_department_authority_entity_1 = require("./entities/user-department-authority.entity");
const user_department_authority_domain_service_1 = require("./services/user-department-authority-domain.service");
let UserDepartmentAuthorityDomainModule = class UserDepartmentAuthorityDomainModule {
};
exports.UserDepartmentAuthorityDomainModule = UserDepartmentAuthorityDomainModule;
exports.UserDepartmentAuthorityDomainModule = UserDepartmentAuthorityDomainModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_department_authority_entity_1.UserDepartmentAuthorityEntity])],
        providers: [user_department_authority_domain_service_1.UserDepartmentAuthorityDomainService],
        exports: [user_department_authority_domain_service_1.UserDepartmentAuthorityDomainService],
    })
], UserDepartmentAuthorityDomainModule);
//# sourceMappingURL=user-department-authority-domain.module.js.map