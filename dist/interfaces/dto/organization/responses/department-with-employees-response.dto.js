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
exports.DepartmentWithEmployeesResponseDto = exports.EmployeeInDepartmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const department_response_dto_1 = require("./department-response.dto");
let EmployeeInDepartmentDto = class EmployeeInDepartmentDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.EmployeeInDepartmentDto = EmployeeInDepartmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '직원 고유 ID',
        example: 'employee-uuid',
        format: 'uuid',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmployeeInDepartmentDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '직원명',
        example: '김개발',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmployeeInDepartmentDto.prototype, "employeeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '직원 번호',
        example: 'EMP001',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmployeeInDepartmentDto.prototype, "employeeNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '계산 제외 여부',
        example: false,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], EmployeeInDepartmentDto.prototype, "isExcludedFromCalculation", void 0);
exports.EmployeeInDepartmentDto = EmployeeInDepartmentDto = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], EmployeeInDepartmentDto);
let DepartmentWithEmployeesResponseDto = class DepartmentWithEmployeesResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.DepartmentWithEmployeesResponseDto = DepartmentWithEmployeesResponseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '부서 정보',
        type: department_response_dto_1.DepartmentResponseDto,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => department_response_dto_1.DepartmentResponseDto),
    __metadata("design:type", department_response_dto_1.DepartmentResponseDto)
], DepartmentWithEmployeesResponseDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서 소속 직원 목록',
        type: [EmployeeInDepartmentDto],
        isArray: true,
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => EmployeeInDepartmentDto),
    __metadata("design:type", Array)
], DepartmentWithEmployeesResponseDto.prototype, "employees", void 0);
exports.DepartmentWithEmployeesResponseDto = DepartmentWithEmployeesResponseDto = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], DepartmentWithEmployeesResponseDto);
//# sourceMappingURL=department-with-employees-response.dto.js.map