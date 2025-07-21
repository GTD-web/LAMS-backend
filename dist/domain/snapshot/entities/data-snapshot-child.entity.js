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
var DataSnapshotChildInfoEntity_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSnapshotChildInfoEntity = void 0;
const typeorm_1 = require("typeorm");
const data_snapshot_info_entity_1 = require("./data-snapshot-info.entity");
let DataSnapshotChildInfoEntity = DataSnapshotChildInfoEntity_1 = class DataSnapshotChildInfoEntity {
    parseToJSON() {
        this.snapshotData = JSON.parse(this.snapshotData);
    }
    static createChildSnapshotListFromParent(snapshotData) {
        return snapshotData.map((data) => {
            const dataSnapshotChildEntity = new DataSnapshotChildInfoEntity_1();
            dataSnapshotChildEntity.employeeId = data.employeeId;
            dataSnapshotChildEntity.employeeName = data.employeeName;
            dataSnapshotChildEntity.employeeNumber = data.employeeNumber;
            dataSnapshotChildEntity.yyyy = data.yyyymm.slice(0, 4);
            dataSnapshotChildEntity.mm = data.yyyymm.slice(5, 7);
            dataSnapshotChildEntity.snapshotData = JSON.stringify(data);
            return dataSnapshotChildEntity;
        });
    }
};
exports.DataSnapshotChildInfoEntity = DataSnapshotChildInfoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DataSnapshotChildInfoEntity.prototype, "dataSnapshotChildId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DataSnapshotChildInfoEntity.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DataSnapshotChildInfoEntity.prototype, "employeeName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DataSnapshotChildInfoEntity.prototype, "employeeNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DataSnapshotChildInfoEntity.prototype, "yyyy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DataSnapshotChildInfoEntity.prototype, "mm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", String)
], DataSnapshotChildInfoEntity.prototype, "snapshotData", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => data_snapshot_info_entity_1.DataSnapshotInfoEntity, (snapshot) => snapshot.dataSnapshotChildInfoList, { onDelete: 'CASCADE' }),
    __metadata("design:type", data_snapshot_info_entity_1.DataSnapshotInfoEntity)
], DataSnapshotChildInfoEntity.prototype, "parentSnapshot", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", String)
], DataSnapshotChildInfoEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataSnapshotChildInfoEntity.prototype, "parseToJSON", null);
exports.DataSnapshotChildInfoEntity = DataSnapshotChildInfoEntity = DataSnapshotChildInfoEntity_1 = __decorate([
    (0, typeorm_1.Entity)()
], DataSnapshotChildInfoEntity);
//# sourceMappingURL=data-snapshot-child.entity.js.map