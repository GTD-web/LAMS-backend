"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceTypeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const attendance_type_entity_1 = require("./entities/attendance-type.entity");
const attendance_type_domain_service_1 = require("./services/attendance-type-domain.service");
let AttendanceTypeModule = class AttendanceTypeModule {
};
exports.AttendanceTypeModule = AttendanceTypeModule;
exports.AttendanceTypeModule = AttendanceTypeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([attendance_type_entity_1.AttendanceTypeEntity])],
        providers: [attendance_type_domain_service_1.AttendanceTypeDomainService],
        exports: [attendance_type_domain_service_1.AttendanceTypeDomainService],
    })
], AttendanceTypeModule);
//# sourceMappingURL=attendance-type.module.js.map