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
exports.SyncOrganizationResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SyncOrganizationResponseDto {
    constructor(message = '조직 동기화가 성공적으로 완료되었습니다.') {
        this.message = message;
        this.completedAt = new Date().toISOString();
        this.success = true;
    }
}
exports.SyncOrganizationResponseDto = SyncOrganizationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '동기화 성공 메시지',
        example: '조직 동기화가 성공적으로 완료되었습니다.',
    }),
    __metadata("design:type", String)
], SyncOrganizationResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '동기화 완료 시간',
        example: '2024-01-21T10:30:00Z',
        format: 'date-time',
    }),
    __metadata("design:type", String)
], SyncOrganizationResponseDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '동기화 성공 여부',
        example: true,
    }),
    __metadata("design:type", Boolean)
], SyncOrganizationResponseDto.prototype, "success", void 0);
//# sourceMappingURL=sync-organization-response.dto.js.map