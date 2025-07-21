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
exports.ApprovalHistoryInfoEntity = exports.ApprovalHistoryAction = void 0;
const typeorm_1 = require("typeorm");
const approval_request_info_entity_1 = require("./approval-request-info.entity");
const date_helper_1 = require("../../../common/utils/helpers/date.helper");
const user_entity_1 = require("../../user/entities/user.entity");
var ApprovalHistoryAction;
(function (ApprovalHistoryAction) {
    ApprovalHistoryAction["APPROVE"] = "\uC2B9\uC778";
    ApprovalHistoryAction["REJECT"] = "\uBC18\uB824";
    ApprovalHistoryAction["CANCEL"] = "\uCDE8\uC18C";
    ApprovalHistoryAction["REQUEST"] = "\uC2E0\uCCAD";
})(ApprovalHistoryAction || (exports.ApprovalHistoryAction = ApprovalHistoryAction = {}));
let ApprovalHistoryInfoEntity = class ApprovalHistoryInfoEntity {
    afterLoad() {
        this.actionAt = date_helper_1.DateHelper.parseTime(date_helper_1.DateHelper.toKoreanTime(this.actionAt));
    }
};
exports.ApprovalHistoryInfoEntity = ApprovalHistoryInfoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ApprovalHistoryInfoEntity.prototype, "historyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], ApprovalHistoryInfoEntity.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity),
    __metadata("design:type", user_entity_1.UserEntity)
], ApprovalHistoryInfoEntity.prototype, "actionBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => approval_request_info_entity_1.ApprovalRequestBaseInfoEntity),
    __metadata("design:type", approval_request_info_entity_1.ApprovalRequestBaseInfoEntity)
], ApprovalHistoryInfoEntity.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ApprovalHistoryInfoEntity.prototype, "actionAt", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], ApprovalHistoryInfoEntity.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApprovalHistoryInfoEntity.prototype, "afterLoad", null);
exports.ApprovalHistoryInfoEntity = ApprovalHistoryInfoEntity = __decorate([
    (0, typeorm_1.Entity)()
], ApprovalHistoryInfoEntity);
//# sourceMappingURL=approval-history-info.entity.js.map