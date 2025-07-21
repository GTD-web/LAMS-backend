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
exports.CheckDepartmentAccessGuard = void 0;
const common_1 = require("@nestjs/common");
const department_domain_service_1 = require("../../domain/organization/department/services/department-domain.service");
let CheckDepartmentAccessGuard = class CheckDepartmentAccessGuard {
    constructor(departmentService) {
        this.departmentService = departmentService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const departmentId = request.params.departmentId;
        if (!user) {
            throw new common_1.ForbiddenException('???? ????.');
        }
        if (!departmentId) {
            throw new common_1.ForbiddenException('?? ID? ????.');
        }
        const department = await this.departmentService.findDepartmentById(departmentId);
        if (!department) {
            throw new common_1.ForbiddenException('??? ?? ? ????.');
        }
        if (department.isAccessAuthority(user.sub) || user.roles.includes('SYSTEM_ADMIN')) {
            request.department = department;
            return true;
        }
        throw new common_1.ForbiddenException('?? ?? ??? ????.');
    }
};
exports.CheckDepartmentAccessGuard = CheckDepartmentAccessGuard;
exports.CheckDepartmentAccessGuard = CheckDepartmentAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [department_domain_service_1.DepartmentDomainService])
], CheckDepartmentAccessGuard);
//# sourceMappingURL=check-department-access.guard.js.map