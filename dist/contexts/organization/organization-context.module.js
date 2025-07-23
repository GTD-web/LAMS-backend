"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationContextModule = void 0;
const common_1 = require("@nestjs/common");
const organization_context_service_1 = require("./organization-context.service");
const department_domain_module_1 = require("../../domain/department/department-domain.module");
const employee_domain_module_1 = require("../../domain/employee/employee-domain.module");
const department_employee_domain_module_1 = require("../../domain/department-employee/department-employee-domain.module");
let OrganizationContextModule = class OrganizationContextModule {
};
exports.OrganizationContextModule = OrganizationContextModule;
exports.OrganizationContextModule = OrganizationContextModule = __decorate([
    (0, common_1.Module)({
        imports: [department_domain_module_1.DepartmentDomainModule, employee_domain_module_1.EmployeeDomainModule, department_employee_domain_module_1.DepartmentEmployeeDomainModule],
        providers: [organization_context_service_1.OrganizationContextService],
        exports: [organization_context_service_1.OrganizationContextService],
    })
], OrganizationContextModule);
//# sourceMappingURL=organization-context.module.js.map