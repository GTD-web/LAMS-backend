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
exports.HolidayListResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const holiday_response_dto_1 = require("./holiday-response.dto");
class HolidayListResponseDto {
    constructor(data) {
        this.holidays = data.holidays;
        this.total = data.total;
        this.page = data.page;
        this.limit = data.limit;
        this.year = data.year;
    }
}
exports.HolidayListResponseDto = HolidayListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공휴일 목록',
        type: [holiday_response_dto_1.HolidayResponseDto],
    }),
    __metadata("design:type", Array)
], HolidayListResponseDto.prototype, "holidays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '전체 개수',
        example: 15,
        type: 'integer',
    }),
    __metadata("design:type", Number)
], HolidayListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '현재 페이지',
        example: 1,
        type: 'integer',
    }),
    __metadata("design:type", Number)
], HolidayListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '페이지당 항목 수',
        example: 10,
        type: 'integer',
    }),
    __metadata("design:type", Number)
], HolidayListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '조회 연도',
        example: 2024,
        type: 'integer',
    }),
    __metadata("design:type", Number)
], HolidayListResponseDto.prototype, "year", void 0);
//# sourceMappingURL=holiday-list-response.dto.js.map