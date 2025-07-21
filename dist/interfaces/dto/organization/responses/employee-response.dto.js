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
exports.EmployeeResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
let EmployeeResponseDto = class EmployeeResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.EmployeeResponseDto = EmployeeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '직원 고유 ID',
        example: 'employee-uuid-123',
        format: 'uuid',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '직원명',
        example: '김개발',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "employeeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '직원 번호',
        example: 'EMP001',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "employeeNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'MMS 직원 ID',
        example: 'mms_emp_001',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "mmsEmployeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '계산 제외 여부',
        example: false,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], EmployeeResponseDto.prototype, "isExcludedFromCalculation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '소속 부서ID',
        example: 'department-uuid',
        required: false,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '직원 생성일',
        example: '2025-01-01T00:00:00.000Z',
        format: 'date-time',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], EmployeeResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '직원 수정일',
        example: '2025-01-01T00:00:00.000Z',
        format: 'date-time',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], EmployeeResponseDto.prototype, "updatedAt", void 0);
exports.EmployeeResponseDto = EmployeeResponseDto = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], EmployeeResponseDto);
//# sourceMappingURL=employee-response.dto.js.map