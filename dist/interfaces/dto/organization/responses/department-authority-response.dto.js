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
exports.DepartmentAuthorityResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const authority_type_enum_1 = require("../../../../domain/user-department-authority/enum/authority-type.enum");
const class_transformer_1 = require("class-transformer");
let DepartmentAuthorityResponse = class DepartmentAuthorityResponse {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.DepartmentAuthorityResponse = DepartmentAuthorityResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentAuthorityResponse.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '부서 이름',
        example: '개발',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentAuthorityResponse.prototype, "departmentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentAuthorityResponse.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '권한 유형',
        example: 'access',
        enum: ['access', 'review'],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentAuthorityResponse.prototype, "authorityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '액션',
        example: 'add',
        enum: ['add', 'delete'],
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentAuthorityResponse.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '성공 여부',
        example: true,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], DepartmentAuthorityResponse.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '메시지',
        example: '부서 권한이 성공적으로 추가되었습니다.',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], DepartmentAuthorityResponse.prototype, "message", void 0);
exports.DepartmentAuthorityResponse = DepartmentAuthorityResponse = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], DepartmentAuthorityResponse);
//# sourceMappingURL=department-authority-response.dto.js.map