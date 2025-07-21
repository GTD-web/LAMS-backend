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
exports.OrganizationTreeResponseDto = exports.SaveOrganizationDto = exports.OrganizationEmployeeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class OrganizationEmployeeDto {
}
exports.OrganizationEmployeeDto = OrganizationEmployeeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '직원 ID',
        example: 'emp-123',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OrganizationEmployeeDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '직원 이름',
        example: '홍길동',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OrganizationEmployeeDto.prototype, "employeeName", void 0);
class SaveOrganizationDto {
}
exports.SaveOrganizationDto = SaveOrganizationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '부서 ID (신규 생성시 생략 가능)',
        example: 'dept-123',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SaveOrganizationDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서명',
        example: '개발팀',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SaveOrganizationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '지원 부서 여부',
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SaveOrganizationDto.prototype, "isSupport", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '상위 부서 ID',
        example: 'dept-parent-123',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SaveOrganizationDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '부서 소속 직원 목록',
        type: [OrganizationEmployeeDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OrganizationEmployeeDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SaveOrganizationDto.prototype, "employees", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '하위 부서 목록',
        type: [SaveOrganizationDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SaveOrganizationDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SaveOrganizationDto.prototype, "children", void 0);
class OrganizationTreeResponseDto {
    constructor(id, name, isSupport, parentId, employees, children) {
        this.id = id;
        this.name = name;
        this.isSupport = isSupport;
        this.parentId = parentId;
        this.employees = employees;
        this.children = children;
    }
}
exports.OrganizationTreeResponseDto = OrganizationTreeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서 ID',
        example: 'dept-123',
    }),
    __metadata("design:type", String)
], OrganizationTreeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서명',
        example: '개발팀',
    }),
    __metadata("design:type", String)
], OrganizationTreeResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '지원 부서 여부',
        example: false,
    }),
    __metadata("design:type", Boolean)
], OrganizationTreeResponseDto.prototype, "isSupport", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '상위 부서 ID',
        example: 'dept-parent-123',
    }),
    __metadata("design:type", String)
], OrganizationTreeResponseDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서 소속 직원 목록',
        type: [OrganizationEmployeeDto],
    }),
    __metadata("design:type", Array)
], OrganizationTreeResponseDto.prototype, "employees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '하위 부서 목록',
        type: [OrganizationTreeResponseDto],
    }),
    __metadata("design:type", Array)
], OrganizationTreeResponseDto.prototype, "children", void 0);
//# sourceMappingURL=organization.dto.js.map