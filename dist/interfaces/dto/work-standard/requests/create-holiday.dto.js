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
exports.CreateHolidayDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateHolidayDto {
}
exports.CreateHolidayDto = CreateHolidayDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공휴일 이름',
        example: '신정',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHolidayDto.prototype, "holidayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '공휴일 날짜',
        example: '2024-01-01',
        format: 'date',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateHolidayDto.prototype, "holidayDate", void 0);
//# sourceMappingURL=create-holiday.dto.js.map