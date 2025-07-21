"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationBusinessModule = void 0;
const common_1 = require("@nestjs/common");
const organization_business_1 = require("./organization.business");
const organization_context_module_1 = require("../../contexts/organization/organization-context.module");
const organization_controller_1 = require("../../interfaces/controllers/organization.controller");
const departments_controller_1 = require("../../interfaces/controllers/departments.controller");
const employees_controller_1 = require("../../interfaces/controllers/employees.controller");
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
//# sourceMappingURL=organization-business.module.js.map