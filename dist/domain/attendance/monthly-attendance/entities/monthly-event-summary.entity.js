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
var MonthlyEmployeeAttendanceInfoEntity_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyEmployeeAttendanceInfoEntity = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let MonthlyEmployeeAttendanceInfoEntity = MonthlyEmployeeAttendanceInfoEntity_1 = class MonthlyEmployeeAttendanceInfoEntity {
    updateSummary(params) {
        this.employeeNumber = params.employeeInfo.employeeNumber;
        this.employeeId = params.employeeInfo.employeeId;
        this.employeeName = params.employeeInfo.employeeName;
        this.yyyymm = params.yyyymm;
        this.totalWorkableTime = params.totalWorkableTime;
        this.totalWorkTime = params.totalWorkTime;
        this.workDaysCount = params.workDaysCount;
        this.avgWorkTimes = params.avgWorkTimes;
        this.attendanceTypeCount = params.attendanceTypeCount;
        this.weeklyWorkTimeSummary = params.weeklyWorkTimeSummary;
        this.dailyEventSummary = params.dailyEventSummary;
        this.lateDetails = params.lateDetails;
        this.absenceDetails = params.absenceDetails;
        this.earlyLeaveDetails = params.earlyLeaveDetails;
        this.note = params.note;
    }
    static create(params) {
        const entity = new MonthlyEmployeeAttendanceInfoEntity_1();
        entity.updateSummary(params);
        return entity;
    }
};
exports.MonthlyEmployeeAttendanceInfoEntity = MonthlyEmployeeAttendanceInfoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)({
        description: '월별 이벤트 요약 아이디',
        example: 'exMonthlyEventSummaryId',
    }),
    __metadata("design:type", String)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "monthlyEventSummaryId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({
        description: '사원 번호',
        example: '23027',
    }),
    __metadata("design:type", String)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "employeeNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({
        description: '사원 고유 아이디',
        example: 'exEmployeeId',
    }),
    __metadata("design:type", String)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({
        description: '사원 이름',
        example: '홍길동',
    }),
    __metadata("design:type", String)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "employeeName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({
        description: '해당 년도의 월',
        example: '2023-07',
    }),
    __metadata("design:type", String)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "yyyymm", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, swagger_1.ApiProperty)({
        description: '비고',
        example: '연차 1일 사용',
    }),
    __metadata("design:type", String)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    (0, swagger_1.ApiProperty)({
        description: '추가 비고',
        example: '연차 1일 사용',
    }),
    __metadata("design:type", String)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "additionalNote", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({
        description: '근무 수',
        example: 22,
    }),
    __metadata("design:type", Number)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "workDaysCount", void 0);
__decorate([
    (0, typeorm_1.Column)('int', {
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({
        description: '가능 근무 시간 (분)',
        example: 12801,
    }),
    __metadata("design:type", Number)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "totalWorkableTime", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    (0, swagger_1.ApiProperty)({
        description: '근무 시간 (분)',
        example: 12801,
    }),
    __metadata("design:type", Number)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "totalWorkTime", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    (0, swagger_1.ApiProperty)({
        description: '평균 근무 시간 (분)',
        example: 581.86,
    }),
    __metadata("design:type", Number)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "avgWorkTimes", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json'),
    (0, swagger_1.ApiProperty)({
        description: '근태 형태 수',
        example: {
            오전반차: 0,
            오후반차: 0,
            종일: 1,
        },
    }),
    __metadata("design:type", Object)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "attendanceTypeCount", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', {
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({
        description: '일별 이벤트 요약',
        example: [
            {
                dailyEventSummaryId: '8a5a35e8-46fd-458f-9ccf-843404b5e0c8',
                date: '2024-06-01',
                enter: '2024-06-01 09:05:30',
                leave: '2024-06-01 17:58:50',
                workTime: 533,
                usedAttendances: [],
            },
        ],
    }),
    __metadata("design:type", Array)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "dailyEventSummary", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', {
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({
        description: '주별 이벤트 요약',
        example: [
            {
                weekNumber: 21,
                startDate: '2024-05-26',
                endDate: '2024-06-01',
                weeklyWorkTime: 533,
            },
        ],
    }),
    __metadata("design:type", Array)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "weeklyWorkTimeSummary", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', {
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({
        description: '지각 세부 정보',
        example: [
            {
                dailyEventSummaryId: '8a5a35e8-46fd-458f-9ccf-843404b5e0c8',
                date: '2024-06-01',
                enter: '2024-06-01 09:05:30',
                leave: '2024-06-01 17:58:50',
                workTime: 533,
                usedAttendances: [],
            },
        ],
    }),
    __metadata("design:type", Array)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "lateDetails", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', {
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({
        description: '결근 세부 정보',
        example: [
            {
                dailyEventSummaryId: '8a5a35e8-46fd-458f-9ccf-843404b5e0c8',
                date: '2024-06-01',
                enter: '2024-06-01 09:05:30',
                leave: '2024-06-01 17:58:50',
                workTime: 533,
                usedAttendances: [],
            },
        ],
    }),
    __metadata("design:type", Array)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "absenceDetails", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', {
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({
        description: '조퇴 세부 정보',
        example: [
            {
                dailyEventSummaryId: '8a5a35e8-46fd-458f-9ccf-843404b5e0c8',
                date: '2024-06-01',
                enter: '2024-06-01 09:05:30',
                leave: '2024-06-01 17:58:50',
                workTime: 533,
                usedAttendances: [],
            },
        ],
    }),
    __metadata("design:type", Array)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "earlyLeaveDetails", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MonthlyEmployeeAttendanceInfoEntity.prototype, "updatedAt", void 0);
exports.MonthlyEmployeeAttendanceInfoEntity = MonthlyEmployeeAttendanceInfoEntity = MonthlyEmployeeAttendanceInfoEntity_1 = __decorate([
    (0, typeorm_1.Entity)()
], MonthlyEmployeeAttendanceInfoEntity);
//# sourceMappingURL=monthly-event-summary.entity.js.map