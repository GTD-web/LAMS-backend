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
var WorkStandardBusinessService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkStandardBusinessService = void 0;
const common_1 = require("@nestjs/common");
const work_standard_context_service_1 = require("../../contexts/work-standard/work-standard-context.service");
const attendance_type_response_dto_1 = require("../../interfaces/dto/work-standard/responses/attendance-type-response.dto");
const attendance_type_list_response_dto_1 = require("../../interfaces/dto/work-standard/responses/attendance-type-list-response.dto");
const holiday_response_dto_1 = require("../../interfaces/dto/work-standard/responses/holiday-response.dto");
const holiday_list_response_dto_1 = require("../../interfaces/dto/work-standard/responses/holiday-list-response.dto");
let WorkStandardBusinessService = WorkStandardBusinessService_1 = class WorkStandardBusinessService {
    constructor(workStandardContextService) {
        this.workStandardContextService = workStandardContextService;
        this.logger = new common_1.Logger(WorkStandardBusinessService_1.name);
    }
    async initializeSeedData() {
        await this.workStandardContextService.SEED_데이터_초기화_설정한다();
        this.logger.log('SEED 데이터 초기화 완료');
    }
    async getAttendanceTypeList(limit, page) {
        const result = await this.workStandardContextService.페이지네이션된_근무_유형_목록_조회한다(limit, page);
        return new attendance_type_list_response_dto_1.AttendanceTypeListResponseDto({
            attendanceTypes: attendance_type_response_dto_1.AttendanceTypeResponseDto.fromEntities(result.attendanceTypes),
            total: result.total,
            page: result.page,
            limit: result.limit,
        });
    }
    async createAttendanceType(dto) {
        const entity = await this.workStandardContextService.근무_유형을_생성한다(dto);
        return attendance_type_response_dto_1.AttendanceTypeResponseDto.fromEntity(entity);
    }
    async updateAttendanceType(attendanceTypeId, dto) {
        const entity = await this.workStandardContextService.근무_유형을_업데이트한다(attendanceTypeId, dto);
        return attendance_type_response_dto_1.AttendanceTypeResponseDto.fromEntity(entity);
    }
    async deleteAttendanceType(attendanceTypeId) {
        return await this.workStandardContextService.근무_유형을_삭제한다(attendanceTypeId);
    }
    async getAttendanceTypeById(attendanceTypeId) {
        const entity = await this.workStandardContextService.근무_유형_ID로_조회한다(attendanceTypeId);
        return entity ? attendance_type_response_dto_1.AttendanceTypeResponseDto.fromEntity(entity) : null;
    }
    async getAllAttendanceTypes() {
        const entities = await this.workStandardContextService.모든_근무_유형을_조회한다();
        return attendance_type_response_dto_1.AttendanceTypeResponseDto.fromEntities(entities);
    }
    async getHolidayList(year, limit, page) {
        const result = await this.workStandardContextService.페이지네이션된_연도별_휴일_목록_조회한다(year, limit, page);
        return new holiday_list_response_dto_1.HolidayListResponseDto({
            holidays: holiday_response_dto_1.HolidayResponseDto.fromEntities(result.holidays),
            total: result.total,
            page: result.page,
            limit: result.limit,
            year: result.year,
        });
    }
    async createHoliday(dto) {
        const entity = await this.workStandardContextService.관리자는_휴일을_생성한다(dto.holidayDate, dto.holidayName);
        await this.workStandardContextService.일간_이벤트_요약에_공휴일이_변경된다(dto.holidayDate);
        const year = parseInt(dto.holidayDate.split('-')[0]);
        const month = parseInt(dto.holidayDate.split('-')[1]);
        await this.workStandardContextService.월간_이벤트_요약에_공휴일이_변경된다(year, month);
        return holiday_response_dto_1.HolidayResponseDto.fromEntity(entity);
    }
    async updateHoliday(holidayId, dto) {
        const existingHoliday = await this.workStandardContextService.휴일_ID를_체크한다(holidayId);
        const holidayDate = dto.holidayDate ?? existingHoliday.holidayDate;
        const holidayName = dto.holidayName ?? existingHoliday.holidayName;
        const entity = await this.workStandardContextService.관리자는_휴일을_업데이트한다(holidayId, holidayDate, holidayName);
        await this.workStandardContextService.일간_이벤트_요약에_공휴일이_변경된다(holidayDate);
        const year = parseInt(holidayDate.split('-')[0]);
        const month = parseInt(holidayDate.split('-')[1]);
        await this.workStandardContextService.월간_이벤트_요약에_공휴일이_변경된다(year, month);
        return holiday_response_dto_1.HolidayResponseDto.fromEntity(entity);
    }
    async deleteHoliday(holidayId) {
        const holiday = await this.workStandardContextService.휴일_ID를_체크한다(holidayId);
        const isDeleted = await this.workStandardContextService.관리자는_휴일을_삭제한다(holidayId);
        if (isDeleted) {
            await this.workStandardContextService.일간_이벤트_요약에_공휴일이_변경된다(holiday.holidayDate);
            const year = parseInt(holiday.holidayDate.split('-')[0]);
            const month = parseInt(holiday.holidayDate.split('-')[1]);
            await this.workStandardContextService.월간_이벤트_요약에_공휴일이_변경된다(year, month);
        }
        return isDeleted;
    }
};
exports.WorkStandardBusinessService = WorkStandardBusinessService;
exports.WorkStandardBusinessService = WorkStandardBusinessService = WorkStandardBusinessService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [work_standard_context_service_1.WorkStandardContextService])
], WorkStandardBusinessService);
//# sourceMappingURL=work-standard.business.js.map