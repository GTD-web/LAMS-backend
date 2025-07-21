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
exports.UserResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const user_enum_1 = require("../../../../domain/user/enum/user.enum");
let UserResponseDto = class UserResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 고유 ID',
        example: 'b520bc5c-d90d-4ec6-aa27-d527e05a2f28',
        format: 'uuid',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 이름',
        example: '각김',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이메일 주소',
        example: 'sam.kim@lumir.space',
        format: 'email',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 권한 목록',
        example: ['SYSTEM_USER', 'ATTENDANCE_USER', 'PROJECT_USER', 'LRIM_USER'],
        type: [String],
        enum: user_enum_1.UserRole,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], UserResponseDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '계정 활성 여부',
        example: true,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '통합 계정 여부',
        example: true,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "isIntegrated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 유형',
        example: 'UserEntity',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '계정 생성 시간',
        example: '2025-07-11T08:05:22.339Z',
        format: 'date-time',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '계정 정보 업데이트 시간',
        example: '2025-07-11T08:05:22.339Z',
        format: 'date-time',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '권한 접근 여부',
        example: true,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "hasAccessAuthority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '권한 검토 여부',
        example: true,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "hasReviewAuthority", void 0);
exports.UserResponseDto = UserResponseDto = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], UserResponseDto);
//# sourceMappingURL=user-response.dto.js.map