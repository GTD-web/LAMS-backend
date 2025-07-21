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
exports.EmployeeInfoEntity = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const daily_event_summary_entity_1 = require("../../../attendance/daily-attendance/entities/daily-event-summary.entity");
const department_employee_entity_1 = require("../../department/entities/department-employee.entity");
const department_info_entity_1 = require("../../department/entities/department-info.entity");
const date_helper_1 = require("../../../../common/utils/helpers/date.helper");
let EmployeeInfoEntity = class EmployeeInfoEntity {
    isActive() {
        if (!this.quitedAt)
            return true;
        const today = date_helper_1.DateHelper.today();
        return this.quitedAt > today;
    }
    isActiveAt(date) {
        if (this.entryAt && date < this.entryAt)
            return false;
        if (this.quitedAt && date >= this.quitedAt)
            return false;
        return true;
    }
    getYearsOfService(baseDate) {
        if (!this.entryAt)
            return 0;
        const endDate = baseDate || this.quitedAt || date_helper_1.DateHelper.today();
        return date_helper_1.DateHelper.calculateWorkPeriod(this.entryAt, endDate) / 12;
    }
    getAge() {
        if (!this.birthDate)
            return null;
        return date_helper_1.DateHelper.calculateAge(this.birthDate);
    }
    updateInfo(updates) {
        Object.assign(this, updates);
    }
    toggleExcludeFromCalculation() {
        this.isExcludedFromCalculation = !this.isExcludedFromCalculation;
    }
};
exports.EmployeeInfoEntity = EmployeeInfoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)({
        description: '직원 아이디',
        example: 'exEmployeeId',
    }),
    __metadata("design:type", String)
], EmployeeInfoEntity.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({
        description: '직원 이름',
        example: 'exEmployeeName',
    }),
    __metadata("design:type", String)
], EmployeeInfoEntity.prototype, "employeeName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({
        description: '사번',
        example: 'exEmployeeNumber',
    }),
    __metadata("design:type", String)
], EmployeeInfoEntity.prototype, "employeeNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({
        description: '직원 이메일',
        example: 'exEmployeeEmail',
    }),
    __metadata("design:type", String)
], EmployeeInfoEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'date',
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({
        description: '입사일',
        example: '2021-01-01',
    }),
    __metadata("design:type", String)
], EmployeeInfoEntity.prototype, "entryAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_info_entity_1.DepartmentInfoEntity),
    (0, typeorm_1.JoinColumn)({ name: 'departmentId' }),
    (0, swagger_1.ApiProperty)({
        description: '부서',
        example: 'exDepartment',
    }),
    __metadata("design:type", department_info_entity_1.DepartmentInfoEntity)
], EmployeeInfoEntity.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, swagger_1.ApiProperty)({
        description: '생일',
        example: '1990-01-01',
        required: false,
    }),
    __metadata("design:type", String)
], EmployeeInfoEntity.prototype, "birthDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({
        description: '퇴사일',
        example: '2023-12-31',
        required: false,
    }),
    __metadata("design:type", String)
], EmployeeInfoEntity.prototype, "quitedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => daily_event_summary_entity_1.DailyEventSummaryEntity, (dailyEventSummary) => dailyEventSummary.employee, {
        cascade: true,
        nullable: true,
    }),
    __metadata("design:type", Array)
], EmployeeInfoEntity.prototype, "dailyEventSummaries", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    (0, swagger_1.ApiProperty)({
        description: '계산에서 제외할지 여부',
        example: false,
        required: false,
    }),
    __metadata("design:type", Boolean)
], EmployeeInfoEntity.prototype, "isExcludedFromCalculation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => department_employee_entity_1.DepartmentEmployeeEntity, (employee) => employee.employee),
    __metadata("design:type", Array)
], EmployeeInfoEntity.prototype, "departments", void 0);
exports.EmployeeInfoEntity = EmployeeInfoEntity = __decorate([
    (0, typeorm_1.Entity)()
], EmployeeInfoEntity);
//# sourceMappingURL=employee-info.entity.js.map