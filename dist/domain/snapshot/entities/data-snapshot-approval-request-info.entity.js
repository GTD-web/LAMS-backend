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
exports.DataSnapshotApprovalRequestInfoEntity = exports.SnapshotApprovalRequestStatus = void 0;
const typeorm_1 = require("typeorm");
const data_snapshot_info_entity_1 = require("./data-snapshot-info.entity");
const approval_request_info_entity_1 = require("../../approval/entities/approval-request-info.entity");
var SnapshotApprovalRequestStatus;
(function (SnapshotApprovalRequestStatus) {
    SnapshotApprovalRequestStatus["CREATE_SNAPSHOT_REQUEST"] = "?? ?? ??? ?? ??";
    SnapshotApprovalRequestStatus["CREATE_SNAPSHOT_APPROVAL"] = "?? ?? ??? ?? ??";
    SnapshotApprovalRequestStatus["CREATE_SNAPSHOT_REJECTION"] = "?? ?? ??? ?? ??";
    SnapshotApprovalRequestStatus["CANCEL_SNAPSHOT_CANCELLATION"] = "?? ?? ??? ?? ??";
})(SnapshotApprovalRequestStatus || (exports.SnapshotApprovalRequestStatus = SnapshotApprovalRequestStatus = {}));
let DataSnapshotApprovalRequestInfoEntity = class DataSnapshotApprovalRequestInfoEntity extends approval_request_info_entity_1.ApprovalRequestBaseInfoEntity {
    cancel() {
        this.status = SnapshotApprovalRequestStatus.CANCEL_SNAPSHOT_CANCELLATION;
    }
    approve() {
        this.status = SnapshotApprovalRequestStatus.CREATE_SNAPSHOT_APPROVAL;
    }
    reject() {
        this.status = SnapshotApprovalRequestStatus.CREATE_SNAPSHOT_REJECTION;
    }
};
exports.DataSnapshotApprovalRequestInfoEntity = DataSnapshotApprovalRequestInfoEntity;
__decorate([
    (0, typeorm_1.OneToOne)(() => data_snapshot_info_entity_1.DataSnapshotInfoEntity, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", data_snapshot_info_entity_1.DataSnapshotInfoEntity)
], DataSnapshotApprovalRequestInfoEntity.prototype, "dataSnapshot", void 0);
exports.DataSnapshotApprovalRequestInfoEntity = DataSnapshotApprovalRequestInfoEntity = __decorate([
    (0, typeorm_1.ChildEntity)()
], DataSnapshotApprovalRequestInfoEntity);
//# sourceMappingURL=data-snapshot-approval-request-info.entity.js.map