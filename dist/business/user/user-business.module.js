"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBusinessModule = void 0;
const common_1 = require("@nestjs/common");
const user_business_1 = require("./user.business");
const user_context_module_1 = require("../../contexts/user/user-context.module");
const organization_context_module_1 = require("../../contexts/organization/organization-context.module");
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
//# sourceMappingURL=user-business.module.js.map