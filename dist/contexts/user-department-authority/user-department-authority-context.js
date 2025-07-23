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
exports.UserDepartmentAuthorityContext = void 0;
const common_1 = require("@nestjs/common");
const department_domain_service_1 = require("../../domain/department/services/department-domain.service");
const user_department_authority_domain_service_1 = require("../../domain/user-department-authority/services/user-department-authority-domain.service");
const user_domain_service_1 = require("../../domain/user/services/user-domain.service");
let UserDepartmentAuthorityContext = class UserDepartmentAuthorityContext {
    constructor(userDepartmentAuthorityDomainService, userDomainService, departmentDomainService) {
        this.userDepartmentAuthorityDomainService = userDepartmentAuthorityDomainService;
        this.userDomainService = userDomainService;
        this.departmentDomainService = departmentDomainService;
    }
    async 사용자의_부서_권한을_추가한다(userId, departmentId, type) {
        const user = await this.userDomainService.getUserById(userId);
        const department = await this.departmentDomainService.findDepartmentById(departmentId);
        return await this.userDepartmentAuthorityDomainService.grantAuthority(user, department, type);
    }
    async 사용자의_부서_권한을_삭제한다(userId, departmentId, type) {
        return await this.userDepartmentAuthorityDomainService.removeAuthority(userId, departmentId, type);
    }
    async 사용자의_접근_가능한_부서_목록을_조회한다(userId) {
        return await this.userDepartmentAuthorityDomainService.getUserAccessibleDepartment(userId);
    }
    async 사용자의_검토_가능한_부서_목록을_조회한다(userId) {
        return await this.userDepartmentAuthorityDomainService.getUserReviewableDepartment(userId);
    }
};
exports.UserDepartmentAuthorityContext = UserDepartmentAuthorityContext;
exports.UserDepartmentAuthorityContext = UserDepartmentAuthorityContext = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_department_authority_domain_service_1.UserDepartmentAuthorityDomainService,
        user_domain_service_1.UserDomainService,
        department_domain_service_1.DepartmentDomainService])
], UserDepartmentAuthorityContext);
//# sourceMappingURL=user-department-authority-context.js.map