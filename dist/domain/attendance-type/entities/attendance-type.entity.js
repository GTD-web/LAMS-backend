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
exports.AttendanceTypeEntity = void 0;
const typeorm_1 = require("typeorm");
let AttendanceTypeEntity = class AttendanceTypeEntity {
    updateAttendanceTypeEntity(dto) {
        for (const key in dto) {
            if (dto[key]) {
                this[key] = dto[key];
            }
        }
    }
    calculateWorkTime() {
        if (this.workTime < 60)
            this.workTime = this.workTime * 60;
    }
};
exports.AttendanceTypeEntity = AttendanceTypeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AttendanceTypeEntity.prototype, "attendanceTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AttendanceTypeEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AttendanceTypeEntity.prototype, "workTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], AttendanceTypeEntity.prototype, "isRecognizedWorkTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], AttendanceTypeEntity.prototype, "startWorkTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], AttendanceTypeEntity.prototype, "endWorkTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], AttendanceTypeEntity.prototype, "deductedAnnualLeave", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AttendanceTypeEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AttendanceTypeEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AttendanceTypeEntity.prototype, "calculateWorkTime", null);
exports.AttendanceTypeEntity = AttendanceTypeEntity = __decorate([
    (0, typeorm_1.Entity)()
], AttendanceTypeEntity);
//# sourceMappingURL=attendance-type.entity.js.map