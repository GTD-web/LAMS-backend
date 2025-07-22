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
const typeorm_1 = require("typeorm");
const department_info_entity_1 = require("../../organization/department/entities/department-info.entity");
const approval_request_info_entity_1 = require("../../approval/entities/approval-request-info.entity");
const approval_step_info_entity_1 = require("../../approval/entities/approval-step-info.entity");
var LamsUserRole;
(function (LamsUserRole) {
    LamsUserRole["ATTENDANCE_ADMIN"] = "ATTENDANCE_ADMIN";
    LamsUserRole["ATTENDANCE_USER"] = "ATTENDANCE_USER";
})(LamsUserRole || (exports.LamsUserRole = LamsUserRole = {}));
let UserEntity = class UserEntity {
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
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "updatedAt", void 0);
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
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.TableInheritance)({ column: { type: 'varchar', name: 'type' } })
], UserEntity);
//# sourceMappingURL=user.entity.js.map