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
exports.CreateAttendanceTypeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateAttendanceTypeDto {
    constructor() {
        this.deductedAnnualLeave = 0;
    }
}
exports.CreateAttendanceTypeDto = CreateAttendanceTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '근무 유형 제목',
        example: '정규근무',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAttendanceTypeDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '근무 시간 (분)',
        example: 480,
        minimum: 0,
        maximum: 1440,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1440),
    __metadata("design:type", Number)
], CreateAttendanceTypeDto.prototype, "workTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '인정 근무 시간 여부',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAttendanceTypeDto.prototype, "isRecognizedWorkTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '시작 근무 시간',
        example: '09:00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAttendanceTypeDto.prototype, "startWorkTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '종료 근무 시간',
        example: '18:00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAttendanceTypeDto.prototype, "endWorkTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '차감 연차',
        example: 0,
        default: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateAttendanceTypeDto.prototype, "deductedAnnualLeave", void 0);
//# sourceMappingURL=create-attendance-type.dto.js.map