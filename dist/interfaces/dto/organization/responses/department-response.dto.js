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
exports.DepartmentResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
let DepartmentResponseDto = class DepartmentResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.DepartmentResponseDto = DepartmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서 고유 ID',
        example: 'b520bc5c-d90d-4ec6-aa27-d527e05a2f28',
        format: 'uuid',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서명',
        example: '개발',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "departmentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서코드',
        example: 'DEV001',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "departmentCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'MMS 부서ID',
        example: 'mms_dept_001',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "mmsDepartmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서 제외 여부',
        example: false,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], DepartmentResponseDto.prototype, "isExclude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '상위 부서ID',
        example: 'parent-dept-uuid',
        format: 'uuid',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "parentDepartmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '조직 정보 ID',
        example: 'org-chart-uuid',
        format: 'uuid',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentResponseDto.prototype, "orgChartInfoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서 생성일',
        example: '2025-01-01T00:00:00.000Z',
        format: 'date-time',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], DepartmentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서 수정일',
        example: '2025-01-01T00:00:00.000Z',
        format: 'date-time',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], DepartmentResponseDto.prototype, "updatedAt", void 0);
exports.DepartmentResponseDto = DepartmentResponseDto = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], DepartmentResponseDto);
//# sourceMappingURL=department-response.dto.js.map