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
exports.UsedAttendanceEntity = void 0;
const employee_info_entity_1 = require("../../../employee/entities/employee-info.entity");
const typeorm_1 = require("typeorm");
const attendance_type_entity_1 = require("../../../attendance-type/entities/attendance-type.entity");
let UsedAttendanceEntity = class UsedAttendanceEntity {
    updateUsedAttendance(dto) {
        for (const key in dto) {
            if (dto[key]) {
                this[key] = dto[key];
            }
        }
    }
};
exports.UsedAttendanceEntity = UsedAttendanceEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UsedAttendanceEntity.prototype, "usedAttendanceId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UsedAttendanceEntity.prototype, "usedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", String)
], UsedAttendanceEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", String)
], UsedAttendanceEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_info_entity_1.EmployeeInfoEntity),
    (0, typeorm_1.JoinColumn)({ name: 'employeeId' }),
    __metadata("design:type", employee_info_entity_1.EmployeeInfoEntity)
], UsedAttendanceEntity.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => attendance_type_entity_1.AttendanceTypeEntity),
    (0, typeorm_1.JoinColumn)({ name: 'attendanceTypeId' }),
    __metadata("design:type", attendance_type_entity_1.AttendanceTypeEntity)
], UsedAttendanceEntity.prototype, "attendanceType", void 0);
exports.UsedAttendanceEntity = UsedAttendanceEntity = __decorate([
    (0, typeorm_1.Entity)()
], UsedAttendanceEntity);
//# sourceMappingURL=used-attendance.entity.js.map