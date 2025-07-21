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
exports.AttendanceTypeResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AttendanceTypeResponseDto {
    constructor(entity) {
        this.attendanceTypeId = entity.attendanceTypeId;
        this.title = entity.title;
        this.workTime = entity.workTime;
        this.isRecognizedWorkTime = entity.isRecognizedWorkTime;
        this.startWorkTime = entity.startWorkTime;
        this.endWorkTime = entity.endWorkTime;
        this.deductedAnnualLeave = entity.deductedAnnualLeave;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
    }
    static fromEntity(entity) {
        return new AttendanceTypeResponseDto(entity);
    }
    static fromEntities(entities) {
        return entities.map((entity) => AttendanceTypeResponseDto.fromEntity(entity));
    }
}
exports.AttendanceTypeResponseDto = AttendanceTypeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '근무 유형 ID',
        example: 'uuid-string',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], AttendanceTypeResponseDto.prototype, "attendanceTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '근무 유형 제목',
        example: '정규근무',
    }),
    __metadata("design:type", String)
], AttendanceTypeResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '근무 시간 (분)',
        example: 480,
        type: 'integer',
    }),
    __metadata("design:type", Number)
], AttendanceTypeResponseDto.prototype, "workTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '인정 근무 시간 여부',
        example: true,
    }),
    __metadata("design:type", Boolean)
], AttendanceTypeResponseDto.prototype, "isRecognizedWorkTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '시작 근무 시간',
        example: '09:00',
        nullable: true,
    }),
    __metadata("design:type", String)
], AttendanceTypeResponseDto.prototype, "startWorkTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '종료 근무 시간',
        example: '18:00',
        nullable: true,
    }),
    __metadata("design:type", String)
], AttendanceTypeResponseDto.prototype, "endWorkTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '차감 연차',
        example: 0,
        type: 'number',
        format: 'float',
    }),
    __metadata("design:type", Number)
], AttendanceTypeResponseDto.prototype, "deductedAnnualLeave", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '생성일시',
        example: '2023-12-01T10:00:00Z',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], AttendanceTypeResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '수정일시',
        example: '2023-12-01T10:00:00Z',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], AttendanceTypeResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=attendance-type-response.dto.js.map