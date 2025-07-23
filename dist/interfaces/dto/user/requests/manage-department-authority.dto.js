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
exports.ManageDepartmentAuthorityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const authority_type_enum_1 = require("../../../../domain/user-department-authority/enum/authority-type.enum");
const class_validator_1 = require("class-validator");
class ManageDepartmentAuthorityDto {
}
exports.ManageDepartmentAuthorityDto = ManageDepartmentAuthorityDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '사용자 ID',
        example: 'uuid-v4-string',
        format: 'uuid',
    }),
    (0, class_validator_1.IsUUID)(4, { message: '유효한 UUID 형식이어야 합니다' }),
    (0, class_validator_1.IsNotEmpty)({ message: '사용자 ID는 필수입니다' }),
    __metadata("design:type", String)
], ManageDepartmentAuthorityDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '권한 액션',
        example: 'add',
        enum: ['add', 'delete'],
    }),
    (0, class_validator_1.IsIn)(['add', 'delete'], { message: '액션은 add 또는 delete여야 합니다' }),
    (0, class_validator_1.IsNotEmpty)({ message: '액션은 필수입니다' }),
    __metadata("design:type", String)
], ManageDepartmentAuthorityDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '권한 타입',
        example: 'access',
        enum: ['access', 'review'],
    }),
    (0, class_validator_1.IsIn)(['access', 'review'], { message: '타입은 access 또는 review여야 합니다' }),
    (0, class_validator_1.IsNotEmpty)({ message: '타입은 필수입니다' }),
    __metadata("design:type", String)
], ManageDepartmentAuthorityDto.prototype, "type", void 0);
//# sourceMappingURL=manage-department-authority.dto.js.map