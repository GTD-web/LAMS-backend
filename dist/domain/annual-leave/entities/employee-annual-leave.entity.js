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
exports.EmployeeAnnualLeaveEntity = exports.BirthDayLeaveStatus = void 0;
const employee_info_entity_1 = require("../../employee/entities/employee-info.entity");
const typeorm_1 = require("typeorm");
var BirthDayLeaveStatus;
(function (BirthDayLeaveStatus) {
    BirthDayLeaveStatus["CAN_NOT_INPUT"] = "???? ??? ? ??";
    BirthDayLeaveStatus["CAN_NOT_USED"] = "?? ?? ??? ? ??";
    BirthDayLeaveStatus["USED"] = "?? ?? ???";
})(BirthDayLeaveStatus || (exports.BirthDayLeaveStatus = BirthDayLeaveStatus = {}));
let EmployeeAnnualLeaveEntity = class EmployeeAnnualLeaveEntity {
    updateAnnualLeave(dto) {
        for (const key in dto) {
            if (dto[key] !== undefined) {
                this[key] = dto[key];
            }
        }
    }
};
exports.EmployeeAnnualLeaveEntity = EmployeeAnnualLeaveEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EmployeeAnnualLeaveEntity.prototype, "annualLeaveId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_info_entity_1.EmployeeInfoEntity),
    (0, typeorm_1.JoinColumn)({ name: 'employeeId' }),
    __metadata("design:type", employee_info_entity_1.EmployeeInfoEntity)
], EmployeeAnnualLeaveEntity.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], EmployeeAnnualLeaveEntity.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], EmployeeAnnualLeaveEntity.prototype, "fiscalYearTotalLeave", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], EmployeeAnnualLeaveEntity.prototype, "currentFiscalYearLeave", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], EmployeeAnnualLeaveEntity.prototype, "entryDateBasedTotalLeave", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], EmployeeAnnualLeaveEntity.prototype, "usedAnnualLeave", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], EmployeeAnnualLeaveEntity.prototype, "remainedAnnualLeave", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: BirthDayLeaveStatus.CAN_NOT_USED }),
    __metadata("design:type", String)
], EmployeeAnnualLeaveEntity.prototype, "birthDayLeaveStatus", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', {
        nullable: true,
    }),
    __metadata("design:type", Array)
], EmployeeAnnualLeaveEntity.prototype, "birthDayLeaveDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeAnnualLeaveEntity.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EmployeeAnnualLeaveEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], EmployeeAnnualLeaveEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], EmployeeAnnualLeaveEntity.prototype, "isAdjusted", void 0);
exports.EmployeeAnnualLeaveEntity = EmployeeAnnualLeaveEntity = __decorate([
    (0, typeorm_1.Entity)()
], EmployeeAnnualLeaveEntity);
//# sourceMappingURL=employee-annual-leave.entity.js.map