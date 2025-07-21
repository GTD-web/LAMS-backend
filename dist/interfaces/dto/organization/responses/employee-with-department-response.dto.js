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
exports.EmployeeWithDepartmentResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const employee_response_dto_1 = require("./employee-response.dto");
const department_response_dto_1 = require("./department-response.dto");
let EmployeeWithDepartmentResponseDto = class EmployeeWithDepartmentResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.EmployeeWithDepartmentResponseDto = EmployeeWithDepartmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '직원 정보',
        type: employee_response_dto_1.EmployeeResponseDto,
    }),
    __metadata("design:type", employee_response_dto_1.EmployeeResponseDto)
], EmployeeWithDepartmentResponseDto.prototype, "employee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '소속 부서 정보',
        type: department_response_dto_1.DepartmentResponseDto,
    }),
    __metadata("design:type", department_response_dto_1.DepartmentResponseDto)
], EmployeeWithDepartmentResponseDto.prototype, "department", void 0);
exports.EmployeeWithDepartmentResponseDto = EmployeeWithDepartmentResponseDto = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], EmployeeWithDepartmentResponseDto);
//# sourceMappingURL=employee-with-department-response.dto.js.map