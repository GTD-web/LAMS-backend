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
var DataSnapshotInfoEntity_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSnapshotInfoEntity = exports.SnapshotType = void 0;
const typeorm_1 = require("typeorm");
const data_snapshot_child_entity_1 = require("./data-snapshot-child.entity");
const department_info_entity_1 = require("../../organization/department/entities/department-info.entity");
const data_snapshot_approval_request_info_entity_1 = require("./data-snapshot-approval-request-info.entity");
const date_helper_1 = require("../../../common/utils/helpers/date.helper");
var SnapshotType;
(function (SnapshotType) {
    SnapshotType["DAILY"] = "DAILY";
    SnapshotType["WEEKLY"] = "WEEKLY";
    SnapshotType["MONTHLY"] = "MONTHLY";
    SnapshotType["ANNUAL"] = "ANNUAL_LEAVE";
})(SnapshotType || (exports.SnapshotType = SnapshotType = {}));
let DataSnapshotInfoEntity = DataSnapshotInfoEntity_1 = class DataSnapshotInfoEntity {
    updateSnapshot(dto) {
        this.snapshotName = dto.snapshotName;
        this.description = dto.snapshotDescription;
    }
    afterLoadFunction() {
        this.createdAt = date_helper_1.DateHelper.toKoreanDateTime(this.createdAt);
        if (this.dataSnapshotChildInfoList) {
            this.dataSnapshotChildInfoList.sort((a, b) => a.employeeName.localeCompare(b.employeeName, 'ko'));
        }
    }
    static createSnapshot({ snapshotName, description, snapshotType, yyyy, mm, department, dataSnapshotChildInfoList, }) {
        const snapshot = new DataSnapshotInfoEntity_1();
        snapshot.snapshotName = snapshotName;
        snapshot.description = description;
        snapshot.snapshotType = snapshotType;
        snapshot.yyyy = yyyy;
        snapshot.mm = mm;
        snapshot.department = department;
        snapshot.dataSnapshotChildInfoList = dataSnapshotChildInfoList;
        return snapshot;
    }
};
exports.DataSnapshotInfoEntity = DataSnapshotInfoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DataSnapshotInfoEntity.prototype, "dataSnapshotId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DataSnapshotInfoEntity.prototype, "snapshotName", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], DataSnapshotInfoEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], DataSnapshotInfoEntity.prototype, "snapshotType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DataSnapshotInfoEntity.prototype, "yyyy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DataSnapshotInfoEntity.prototype, "mm", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => data_snapshot_child_entity_1.DataSnapshotChildInfoEntity, (child) => child.parentSnapshot, {
        cascade: ['insert', 'update', 'remove'],
    }),
    __metadata("design:type", Array)
], DataSnapshotInfoEntity.prototype, "dataSnapshotChildInfoList", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_info_entity_1.DepartmentInfoEntity, { eager: true, cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: 'departmentId' }),
    __metadata("design:type", department_info_entity_1.DepartmentInfoEntity)
], DataSnapshotInfoEntity.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => data_snapshot_approval_request_info_entity_1.DataSnapshotApprovalRequestInfoEntity, (approvalRequest) => approvalRequest.dataSnapshot),
    __metadata("design:type", data_snapshot_approval_request_info_entity_1.DataSnapshotApprovalRequestInfoEntity)
], DataSnapshotInfoEntity.prototype, "approvalRequest", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", String)
], DataSnapshotInfoEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", String)
], DataSnapshotInfoEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataSnapshotInfoEntity.prototype, "afterLoadFunction", null);
exports.DataSnapshotInfoEntity = DataSnapshotInfoEntity = DataSnapshotInfoEntity_1 = __decorate([
    (0, typeorm_1.Entity)()
], DataSnapshotInfoEntity);
//# sourceMappingURL=data-snapshot-info.entity.js.map