"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceModule = void 0;
const common_1 = require("@nestjs/common");
const attendance_type_module_1 = require("../attendance-type/attendance-type.module");
const daily_attendance_module_1 = require("./daily-attendance/daily-attendance.module");
const monthly_attendance_module_1 = require("./monthly-attendance/monthly-attendance.module");
const used_attendance_module_1 = require("./used-attendance/used-attendance.module");
let AttendanceModule = class AttendanceModule {
};
exports.AttendanceModule = AttendanceModule;
exports.AttendanceModule = AttendanceModule = __decorate([
    (0, common_1.Module)({
        imports: [attendance_type_module_1.AttendanceTypeModule, daily_attendance_module_1.DailyAttendanceModule, monthly_attendance_module_1.MonthlyAttendanceModule, used_attendance_module_1.UsedAttendanceModule],
        exports: [attendance_type_module_1.AttendanceTypeModule, daily_attendance_module_1.DailyAttendanceModule, monthly_attendance_module_1.MonthlyAttendanceModule, used_attendance_module_1.UsedAttendanceModule],
    })
], AttendanceModule);
//# sourceMappingURL=attendance.module.js.map