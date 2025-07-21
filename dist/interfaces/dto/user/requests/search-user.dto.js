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
exports.SearchUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SearchUserDto {
}
exports.SearchUserDto = SearchUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '사용자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: '올바른 UUID 형식이어야 합니다.' }),
    __metadata("design:type", String)
], SearchUserDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '사용자 이메일',
        example: 'user@example.com',
        format: 'email',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: '올바른 이메일 형식이어야 합니다.' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toLowerCase().trim()),
    __metadata("design:type", String)
], SearchUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '사용자 이름',
        example: '김철수',
        minLength: 2,
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '이름은 문자열이어야 합니다.' }),
    (0, class_validator_1.Length)(2, 50, { message: '이름은 2자 이상 50자 이하여야 합니다.' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], SearchUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '로그인 ID',
        example: 'user123',
        minLength: 3,
        maxLength: 30,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '로그인 ID는 문자열이어야 합니다.' }),
    (0, class_validator_1.Length)(3, 30, { message: '로그인 ID는 3자 이상 30자 이하여야 합니다.' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], SearchUserDto.prototype, "loginId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '검색 키워드 (이름, 이메일, 로그인 ID 통합 검색)',
        example: '김철수',
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '검색 키워드는 문자열이어야 합니다.' }),
    (0, class_validator_1.Length)(2, 100, { message: '검색 키워드는 2자 이상 100자 이하여야 합니다.' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], SearchUserDto.prototype, "keyword", void 0);
//# sourceMappingURL=search-user.dto.js.map