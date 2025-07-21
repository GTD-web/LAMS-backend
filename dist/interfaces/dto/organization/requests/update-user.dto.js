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
exports.UpdateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const user_enum_1 = require("../../../../domain/user/enum/user.enum");
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '사용자 이름',
        example: '이이',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '사용자 이름 문자여야 합니다' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '이메일 주소',
        example: 'woo.mh@lumir.space',
        format: 'email',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: '효과적인 이메일 주소를 입력해주세요' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toLowerCase().trim()),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '사용자 권한 목록',
        example: ['SYSTEM_USER', 'ATTENDANCE_USER', 'PROJECT_USER', 'LRIM_USER'],
        type: [String],
        enum: user_enum_1.UserRole,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: '권한 배열 타입이어야 합니다' }),
    (0, class_validator_1.IsEnum)(user_enum_1.UserRole, { each: true, message: '효과적인 권한을 선택해주세요' }),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '계정 상태',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: '상태 boolean 값이어야 합니다' }),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '통합 계정 상태',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: '통합 계정 상태 boolean 값이어야 합니다' }),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isIntegrated", void 0);
//# sourceMappingURL=update-user.dto.js.map