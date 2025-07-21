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
exports.SnapshotApprovalNotificationEntity = void 0;
const typeorm_1 = require("typeorm");
const base_notification_entity_1 = require("./base-notification.entity");
const data_snapshot_approval_request_info_entity_1 = require("../../snapshot/entities/data-snapshot-approval-request-info.entity");
let SnapshotApprovalNotificationEntity = class SnapshotApprovalNotificationEntity extends base_notification_entity_1.BaseNotificationEntity {
    read() {
        super.read();
    }
};
exports.SnapshotApprovalNotificationEntity = SnapshotApprovalNotificationEntity;
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SnapshotApprovalNotificationEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => data_snapshot_approval_request_info_entity_1.DataSnapshotApprovalRequestInfoEntity),
    (0, typeorm_1.JoinColumn)({ name: 'requestId' }),
    __metadata("design:type", data_snapshot_approval_request_info_entity_1.DataSnapshotApprovalRequestInfoEntity)
], SnapshotApprovalNotificationEntity.prototype, "approvalRequest", void 0);
exports.SnapshotApprovalNotificationEntity = SnapshotApprovalNotificationEntity = __decorate([
    (0, typeorm_1.ChildEntity)()
], SnapshotApprovalNotificationEntity);
//# sourceMappingURL=approval-notification.entity.js.map