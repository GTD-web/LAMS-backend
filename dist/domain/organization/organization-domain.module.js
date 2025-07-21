"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationDomainModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const department_info_entity_1 = require("./department/entities/department-info.entity");
const department_employee_entity_1 = require("./department/entities/department-employee.entity");
const employee_info_entity_1 = require("./employee/entities/employee-info.entity");
const department_domain_service_1 = require("./department/services/department-domain.service");
const employee_domain_service_1 = require("./employee/services/employee-domain.service");
const department_employee_domain_service_1 = require("./department-employee/department-employee-domain.service");
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
//# sourceMappingURL=organization-domain.module.js.map