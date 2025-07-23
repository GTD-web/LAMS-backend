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
exports.DepartmentInfoEntity = void 0;
const typeorm_1 = require("typeorm");
const department_employee_entity_1 = require("../../department-employee/entities/department-employee.entity");
const user_entity_1 = require("../../user/entities/user.entity");
let DepartmentInfoEntity = class DepartmentInfoEntity {
    toggleExclude() {
        this.isExclude = !this.isExclude;
    }
    isAccessAuthority(user) {
        return this.accessAuthorities.some((u) => u.userId === user.userId);
    }
    isReviewAuthority(user) {
        return this.reviewAuthorities.some((u) => u.userId === user.userId);
    }
};
exports.DepartmentInfoEntity = DepartmentInfoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DepartmentInfoEntity.prototype, "departmentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DepartmentInfoEntity.prototype, "departmentName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DepartmentInfoEntity.prototype, "departmentCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DepartmentInfoEntity.prototype, "mmsDepartmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.UserEntity, (user) => user.accessableDepartments, {
        cascade: true,
        eager: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinTable)({ name: 'accessAuthorities' }),
    __metadata("design:type", Array)
], DepartmentInfoEntity.prototype, "accessAuthorities", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.UserEntity, (user) => user.reviewableDepartments, {
        cascade: true,
        eager: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinTable)({ name: 'reviewAuthorities' }),
    __metadata("design:type", Array)
], DepartmentInfoEntity.prototype, "reviewAuthorities", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], DepartmentInfoEntity.prototype, "isExclude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], DepartmentInfoEntity.prototype, "parentDepartmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => DepartmentInfoEntity, (department) => department.children, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'parentDepartmentId' }),
    __metadata("design:type", DepartmentInfoEntity)
], DepartmentInfoEntity.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => DepartmentInfoEntity, (department) => department.parent),
    __metadata("design:type", Array)
], DepartmentInfoEntity.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => department_employee_entity_1.DepartmentEmployeeEntity, (employee) => employee.department),
    __metadata("design:type", Array)
], DepartmentInfoEntity.prototype, "employees", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DepartmentInfoEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DepartmentInfoEntity.prototype, "updatedAt", void 0);
exports.DepartmentInfoEntity = DepartmentInfoEntity = __decorate([
    (0, typeorm_1.Entity)()
], DepartmentInfoEntity);
//# sourceMappingURL=department-info.entity.js.map