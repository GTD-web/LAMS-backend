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
exports.DepartmentEmployeeEntity = void 0;
const typeorm_1 = require("typeorm");
const department_info_entity_1 = require("./department-info.entity");
const employee_info_entity_1 = require("../../employee/entities/employee-info.entity");
let DepartmentEmployeeEntity = class DepartmentEmployeeEntity {
};
exports.DepartmentEmployeeEntity = DepartmentEmployeeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DepartmentEmployeeEntity.prototype, "departmentEmployeeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_info_entity_1.DepartmentInfoEntity, (department) => department.employees),
    __metadata("design:type", department_info_entity_1.DepartmentInfoEntity)
], DepartmentEmployeeEntity.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_info_entity_1.EmployeeInfoEntity, (employee) => employee.department),
    __metadata("design:type", employee_info_entity_1.EmployeeInfoEntity)
], DepartmentEmployeeEntity.prototype, "employee", void 0);
exports.DepartmentEmployeeEntity = DepartmentEmployeeEntity = __decorate([
    (0, typeorm_1.Entity)()
], DepartmentEmployeeEntity);
//# sourceMappingURL=department-employee.entity.js.map