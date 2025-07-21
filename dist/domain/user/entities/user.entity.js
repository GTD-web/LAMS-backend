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
exports.UserEntity = exports.LamsUserRole = void 0;
const bcrypt = require("bcrypt");
const typeorm_1 = require("typeorm");
const user_enum_1 = require("../enum/user.enum");
const department_info_entity_1 = require("../../organization/department/entities/department-info.entity");
const approval_request_info_entity_1 = require("../../approval/entities/approval-request-info.entity");
const approval_step_info_entity_1 = require("../../approval/entities/approval-step-info.entity");
var LamsUserRole;
(function (LamsUserRole) {
    LamsUserRole["ATTENDANCE_ADMIN"] = "ATTENDANCE_ADMIN";
    LamsUserRole["ATTENDANCE_USER"] = "ATTENDANCE_USER";
})(LamsUserRole || (exports.LamsUserRole = LamsUserRole = {}));
let UserEntity = class UserEntity {
    setLamsRoles(role) {
        this.roles = this.roles.filter((r) => r !== LamsUserRole.ATTENDANCE_ADMIN && r !== LamsUserRole.ATTENDANCE_USER);
        this.roles.push(role);
    }
    includeAccessableDepartment(department) {
        if (!this.accessableDepartments) {
            this.accessableDepartments = [];
        }
        if (!this.isAccessableDepartment(department)) {
            this.accessableDepartments.push(department);
        }
    }
    includeReviewableDepartment(department) {
        if (!this.reviewableDepartments) {
            this.reviewableDepartments = [];
        }
        if (!this.isReviewableDepartment(department)) {
            this.reviewableDepartments.push(department);
        }
    }
    excludeAccessableDepartment(department) {
        this.accessableDepartments = this.accessableDepartments.filter((dept) => dept.departmentId !== department.departmentId);
    }
    excludeReviewableDepartment(department) {
        this.reviewableDepartments = this.reviewableDepartments.filter((dept) => dept.departmentId !== department.departmentId);
    }
    isAccessableDepartment(department) {
        return this.accessableDepartments.some((dept) => dept.departmentId === department.departmentId);
    }
    isReviewableDepartment(department) {
        return this.reviewableDepartments.some((dept) => dept.departmentId === department.departmentId);
    }
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    validatePassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
    updateHashedPassword(password) {
        return bcrypt.hashSync(password, 10);
    }
    setSystemRole(role) {
        this.roles = this.roles.filter((r) => r !== user_enum_1.SystemRole.SYSTEM_ADMIN && r !== user_enum_1.SystemRole.SYSTEM_USER);
        this.roles.push(role);
    }
    toggleIsActive() {
        this.isActive = !this.isActive;
    }
    setDefaultRoles() {
        if (!this.roles || this.roles.length === 0) {
            this.roles = [user_enum_1.UserRole.SYSTEM_USER, user_enum_1.UserRole.ATTENDANCE_USER, user_enum_1.UserRole.PROJECT_USER, user_enum_1.UserRole.LRIM_USER];
        }
    }
    checkRoles() {
        if (this.roles) {
            this.roles = this.roles.filter((role) => Object.values(user_enum_1.UserRole).includes(role));
        }
    }
    sortRoles() {
        const roleOrder = [
            user_enum_1.UserRole.SYSTEM_ADMIN,
            user_enum_1.UserRole.SYSTEM_USER,
            user_enum_1.UserRole.ATTENDANCE_ADMIN,
            user_enum_1.UserRole.ATTENDANCE_USER,
            user_enum_1.UserRole.PROJECT_ADMIN,
            user_enum_1.UserRole.PROJECT_USER,
            user_enum_1.UserRole.LRIM_ADMIN,
            user_enum_1.UserRole.LRIM_USER,
        ];
        this.roles.sort((a, b) => roleOrder.indexOf(a) - roleOrder.indexOf(b));
    }
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        unique: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], UserEntity.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: true,
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isIntegrated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: 'UserEntity', nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "hasAccessAuthority", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "hasReviewAuthority", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => department_info_entity_1.DepartmentInfoEntity, (department) => department.accessAuthorities),
    __metadata("design:type", Array)
], UserEntity.prototype, "accessableDepartments", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => department_info_entity_1.DepartmentInfoEntity, (department) => department.reviewAuthorities),
    __metadata("design:type", Array)
], UserEntity.prototype, "reviewableDepartments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => approval_request_info_entity_1.ApprovalRequestBaseInfoEntity, (request) => request.requester),
    __metadata("design:type", Array)
], UserEntity.prototype, "requests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => approval_step_info_entity_1.ApprovalStepInfoEntity, (step) => step.approver),
    __metadata("design:type", Array)
], UserEntity.prototype, "approvalSteps", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserEntity.prototype, "hashPassword", null);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserEntity.prototype, "setDefaultRoles", null);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserEntity.prototype, "checkRoles", null);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserEntity.prototype, "sortRoles", null);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.TableInheritance)({ column: { type: 'varchar', name: 'type' } })
], UserEntity);
//# sourceMappingURL=user.entity.js.map