"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkStandardContextModule = void 0;
const common_1 = require("@nestjs/common");
const attendance_type_module_1 = require("../../domain/attendance-type/attendance-type.module");
const holiday_module_1 = require("../../domain/holiday/holiday.module");
const work_standard_context_service_1 = require("./work-standard-context.service");
let WorkStandardContextModule = class WorkStandardContextModule {
};
exports.WorkStandardContextModule = WorkStandardContextModule;
exports.WorkStandardContextModule = WorkStandardContextModule = __decorate([
    (0, common_1.Module)({
        imports: [attendance_type_module_1.AttendanceTypeModule, holiday_module_1.HolidayModule],
        providers: [work_standard_context_service_1.WorkStandardContextService],
        exports: [work_standard_context_service_1.WorkStandardContextService],
    })
], WorkStandardContextModule);
//# sourceMappingURL=work-standard-context.module.js.map