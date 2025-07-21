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
exports.DailyEventSummaryEntity = void 0;
const employee_info_entity_1 = require("../../../organization/employee/entities/employee-info.entity");
const typeorm_1 = require("typeorm");
const date_helper_1 = require("../../../../common/utils/helpers/date.helper");
let DailyEventSummaryEntity = class DailyEventSummaryEntity {
    calculateWorkTime() {
        if (this.enter && this.leave && this.date) {
            const workHours = date_helper_1.DateHelper.calculateWorkHours(this.enter, this.leave, this.date);
            this.workTime = Math.floor(workHours * 60);
        }
        else {
            this.workTime = null;
        }
    }
    inputEventTime(earliest, latest) {
        this.enter = earliest;
        this.leave = latest;
        this.realEnter = earliest;
        this.realLeave = latest;
        this.isAbsent = false;
        this.isLate = false;
        this.isEarlyLeave = false;
        this.isChecked = true;
        this.note = '';
    }
    resetEventTime() {
        this.enter = '';
        this.leave = '';
        this.realEnter = '';
        this.realLeave = '';
        this.isAbsent = false;
        this.isLate = false;
        this.isEarlyLeave = false;
        this.isChecked = true;
        this.note = '';
    }
    updateNote(note) {
        this.note = note;
    }
};
exports.DailyEventSummaryEntity = DailyEventSummaryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DailyEventSummaryEntity.prototype, "dailyEventSummaryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], DailyEventSummaryEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_info_entity_1.EmployeeInfoEntity, (employee) => employee.dailyEventSummaries, {
        nullable: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", employee_info_entity_1.EmployeeInfoEntity)
], DailyEventSummaryEntity.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], DailyEventSummaryEntity.prototype, "isHoliday", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DailyEventSummaryEntity.prototype, "enter", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DailyEventSummaryEntity.prototype, "leave", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DailyEventSummaryEntity.prototype, "realEnter", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DailyEventSummaryEntity.prototype, "realLeave", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], DailyEventSummaryEntity.prototype, "isChecked", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], DailyEventSummaryEntity.prototype, "isLate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], DailyEventSummaryEntity.prototype, "isEarlyLeave", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], DailyEventSummaryEntity.prototype, "isAbsent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DailyEventSummaryEntity.prototype, "workTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DailyEventSummaryEntity.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DailyEventSummaryEntity.prototype, "calculateWorkTime", null);
exports.DailyEventSummaryEntity = DailyEventSummaryEntity = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)(['date', 'employee'])
], DailyEventSummaryEntity);
//# sourceMappingURL=daily-event-summary.entity.js.map