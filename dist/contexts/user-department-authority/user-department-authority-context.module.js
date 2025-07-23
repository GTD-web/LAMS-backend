"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDepartmentAuthorityContextModule = void 0;
const common_1 = require("@nestjs/common");
const user_department_authority_context_1 = require("./user-department-authority-context");
const user_domain_module_1 = require("../../domain/user/user-domain.module");
const department_domain_module_1 = require("../../domain/department/department-domain.module");
const user_department_authority_domain_module_1 = require("../../domain/user-department-authority/user-department-authority-domain.module");
let UserDepartmentAuthorityContextModule = class UserDepartmentAuthorityContextModule {
};
exports.UserDepartmentAuthorityContextModule = UserDepartmentAuthorityContextModule;
exports.UserDepartmentAuthorityContextModule = UserDepartmentAuthorityContextModule = __decorate([
    (0, common_1.Module)({
        imports: [user_domain_module_1.UserDomainModule, department_domain_module_1.DepartmentDomainModule, user_department_authority_domain_module_1.UserDepartmentAuthorityDomainModule],
        providers: [user_department_authority_context_1.UserDepartmentAuthorityContext],
        exports: [user_department_authority_context_1.UserDepartmentAuthorityContext],
    })
], UserDepartmentAuthorityContextModule);
//# sourceMappingURL=user-department-authority-context.module.js.map