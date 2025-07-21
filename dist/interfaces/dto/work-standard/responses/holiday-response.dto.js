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
exports.HolidayResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class HolidayResponseDto {
    constructor(entity) {
        this.holidayId = entity.holidayId;
        this.holidayName = entity.holidayName;
        this.holidayDate = entity.holidayDate;
    }
    static fromEntity(entity) {
        return new HolidayResponseDto(entity);
    }
    static fromEntities(entities) {
        return entities.map((entity) => HolidayResponseDto.fromEntity(entity));
    }
}
exports.HolidayResponseDto = HolidayResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공휴일 ID',
        example: 'uuid-string',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], HolidayResponseDto.prototype, "holidayId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공휴일 이름',
        example: '신정',
    }),
    __metadata("design:type", String)
], HolidayResponseDto.prototype, "holidayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공휴일 날짜',
        example: '2024-01-01',
        format: 'date',
    }),
    __metadata("design:type", String)
], HolidayResponseDto.prototype, "holidayDate", void 0);
//# sourceMappingURL=holiday-response.dto.js.map