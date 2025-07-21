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
exports.ApprovalRequestBaseInfoEntity = void 0;
const typeorm_1 = require("typeorm");
const approval_history_info_entity_1 = require("./approval-history-info.entity");
const approval_step_info_entity_1 = require("./approval-step-info.entity");
const user_entity_1 = require("../../user/entities/user.entity");
let ApprovalRequestBaseInfoEntity = class ApprovalRequestBaseInfoEntity {
    setComputed() {
        if (this.steps) {
            this.steps = this.steps.sort((a, b) => a.stepOrder - b.stepOrder);
        }
    }
};
exports.ApprovalRequestBaseInfoEntity = ApprovalRequestBaseInfoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ApprovalRequestBaseInfoEntity.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.requests),
    __metadata("design:type", user_entity_1.UserEntity)
], ApprovalRequestBaseInfoEntity.prototype, "requester", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], ApprovalRequestBaseInfoEntity.prototype, "requestType", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ApprovalRequestBaseInfoEntity.prototype, "requestTitle", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ApprovalRequestBaseInfoEntity.prototype, "requestContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], ApprovalRequestBaseInfoEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => approval_step_info_entity_1.ApprovalStepInfoEntity, (step) => step.request),
    __metadata("design:type", Array)
], ApprovalRequestBaseInfoEntity.prototype, "steps", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => approval_history_info_entity_1.ApprovalHistoryInfoEntity, (history) => history.request),
    __metadata("design:type", Array)
], ApprovalRequestBaseInfoEntity.prototype, "histories", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ApprovalRequestBaseInfoEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ApprovalRequestBaseInfoEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApprovalRequestBaseInfoEntity.prototype, "setComputed", null);
exports.ApprovalRequestBaseInfoEntity = ApprovalRequestBaseInfoEntity = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.TableInheritance)({ column: { type: 'varchar', name: 'type' } })
], ApprovalRequestBaseInfoEntity);
//# sourceMappingURL=approval-request-info.entity.js.map