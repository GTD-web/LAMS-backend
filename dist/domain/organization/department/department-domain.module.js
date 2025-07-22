"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentDomainModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const department_info_entity_1 = require("./entities/department-info.entity");
const department_domain_service_1 = require("./services/department-domain.service");
let DepartmentDomainModule = class DepartmentDomainModule {
};
exports.DepartmentDomainModule = DepartmentDomainModule;
exports.DepartmentDomainModule = DepartmentDomainModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([department_info_entity_1.DepartmentInfoEntity])],
        providers: [department_domain_service_1.DepartmentDomainService],
        exports: [department_domain_service_1.DepartmentDomainService],
    })
], DepartmentDomainModule);
//# sourceMappingURL=department-domain.module.js.map