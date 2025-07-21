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
exports.MMSWebhookRequestDto = exports.MMSDepartmentResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class MMSDepartmentResponseDto {
}
exports.MMSDepartmentResponseDto = MMSDepartmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '부서ID', example: '67d0f0a79af04fc1b2f65ab1' }),
    __metadata("design:type", String)
], MMSDepartmentResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '부서명', example: '루미르주식회사' }),
    __metadata("design:type", String)
], MMSDepartmentResponseDto.prototype, "department_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '부서코드', example: '루미르' }),
    __metadata("design:type", String)
], MMSDepartmentResponseDto.prototype, "department_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '관리자 ID', example: null }),
    __metadata("design:type", String)
], MMSDepartmentResponseDto.prototype, "manager_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '상위 부서ID', example: null }),
    __metadata("design:type", String)
], MMSDepartmentResponseDto.prototype, "parent_department_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '생성일', example: '2025-03-12T02:25:43.837Z' }),
    __metadata("design:type", String)
], MMSDepartmentResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '수정일', example: '2025-04-01T09:13:11.654Z' }),
    __metadata("design:type", String)
], MMSDepartmentResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '버전', example: 0 }),
    __metadata("design:type", Number)
], MMSDepartmentResponseDto.prototype, "__v", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '하위 부서목록', type: [MMSDepartmentResponseDto] }),
    __metadata("design:type", Array)
], MMSDepartmentResponseDto.prototype, "child_departments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '부서ID', example: '67d0f0a79af04fc1b2f65ab1' }),
    __metadata("design:type", String)
], MMSDepartmentResponseDto.prototype, "id", void 0);
class MMSWebhookRequestDto {
}
exports.MMSWebhookRequestDto = MMSWebhookRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '이벤트 타입', example: 'employee.updated' }),
    __metadata("design:type", String)
], MMSWebhookRequestDto.prototype, "event_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '엔티티 타입', example: 'employee' }),
    __metadata("design:type", String)
], MMSWebhookRequestDto.prototype, "entity_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '타임스탬프', example: '2025-04-29T02:11:51.794Z' }),
    __metadata("design:type", String)
], MMSWebhookRequestDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '페이로드' }),
    __metadata("design:type", MMSDepartmentResponseDto)
], MMSWebhookRequestDto.prototype, "payload", void 0);
//# sourceMappingURL=mms-department-import.dto.js.map