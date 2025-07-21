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
exports.ApprovalStepInfoEntity = exports.ApprovalStepStatus = void 0;
const typeorm_1 = require("typeorm");
const approval_request_info_entity_1 = require("./approval-request-info.entity");
const user_entity_1 = require("../../user/entities/user.entity");
var ApprovalStepStatus;
(function (ApprovalStepStatus) {
    ApprovalStepStatus["PENDING"] = "\uB300\uAE30\uC911";
    ApprovalStepStatus["APPROVED"] = "\uC2B9\uC778";
    ApprovalStepStatus["REJECTED"] = "\uAC70\uC808";
    ApprovalStepStatus["CANCELLED"] = "\uCDE8\uC18C";
})(ApprovalStepStatus || (exports.ApprovalStepStatus = ApprovalStepStatus = {}));
let ApprovalStepInfoEntity = class ApprovalStepInfoEntity {
    cancel() {
        this.status = ApprovalStepStatus.CANCELLED;
    }
    approve() {
        this.status = ApprovalStepStatus.APPROVED;
    }
    reject(reason) {
        this.status = ApprovalStepStatus.REJECTED;
        this.reason = reason;
    }
    pending() {
        this.status = ApprovalStepStatus.PENDING;
    }
};
exports.ApprovalStepInfoEntity = ApprovalStepInfoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ApprovalStepInfoEntity.prototype, "stepId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.approvalSteps),
    __metadata("design:type", user_entity_1.UserEntity)
], ApprovalStepInfoEntity.prototype, "approver", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => approval_request_info_entity_1.ApprovalRequestBaseInfoEntity, (request) => request.steps),
    __metadata("design:type", approval_request_info_entity_1.ApprovalRequestBaseInfoEntity)
], ApprovalStepInfoEntity.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ApprovalStepInfoEntity.prototype, "stepOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], ApprovalStepInfoEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], ApprovalStepInfoEntity.prototype, "reason", void 0);
exports.ApprovalStepInfoEntity = ApprovalStepInfoEntity = __decorate([
    (0, typeorm_1.Entity)()
], ApprovalStepInfoEntity);
//# sourceMappingURL=approval-step-info.entity.js.map