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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkStandardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const work_standard_business_1 = require("../../business/work-standard/work-standard.business");
const attendance_type_response_dto_1 = require("../dto/work-standard/responses/attendance-type-response.dto");
const attendance_type_list_response_dto_1 = require("../dto/work-standard/responses/attendance-type-list-response.dto");
const holiday_response_dto_1 = require("../dto/work-standard/responses/holiday-response.dto");
const holiday_list_response_dto_1 = require("../dto/work-standard/responses/holiday-list-response.dto");
const create_attendance_type_dto_1 = require("../dto/work-standard/requests/create-attendance-type.dto");
const update_attendance_type_dto_1 = require("../dto/work-standard/requests/update-attendance-type.dto");
const create_holiday_dto_1 = require("../dto/work-standard/requests/create-holiday.dto");
const update_holiday_dto_1 = require("../dto/work-standard/requests/update-holiday.dto");
const error_response_dto_1 = require("../../common/dtos/common/error-response.dto");
let WorkStandardController = class WorkStandardController {
    constructor(workStandardBusinessService) {
        this.workStandardBusinessService = workStandardBusinessService;
    }
    async getAttendanceTypes(page = 1, limit = 10) {
        return await this.workStandardBusinessService.getAttendanceTypeList(limit, page);
    }
    async getAllAttendanceTypes() {
        return await this.workStandardBusinessService.getAllAttendanceTypes();
    }
    async getAttendanceTypeById(id) {
        return await this.workStandardBusinessService.getAttendanceTypeById(id);
    }
    async createAttendanceType(dto) {
        return await this.workStandardBusinessService.createAttendanceType(dto);
    }
    async updateAttendanceType(id, dto) {
        return await this.workStandardBusinessService.updateAttendanceType(id, dto);
    }
    async deleteAttendanceType(id) {
        return await this.workStandardBusinessService.deleteAttendanceType(id);
    }
    async getHolidays(year, page = 1, limit = 10) {
        return await this.workStandardBusinessService.getHolidayList(year, limit, page);
    }
    async createHoliday(dto) {
        return await this.workStandardBusinessService.createHoliday(dto);
    }
    async updateHoliday(id, dto) {
        return await this.workStandardBusinessService.updateHoliday(id, dto);
    }
    async deleteHoliday(id) {
        return await this.workStandardBusinessService.deleteHoliday(id);
    }
    async initializeSeedData() {
        await this.workStandardBusinessService.initializeSeedData();
        return true;
    }
};
exports.WorkStandardController = WorkStandardController;
__decorate([
    (0, common_1.Get)('attendance-types'),
    (0, swagger_1.ApiOperation)({
        summary: '근무 유형 목록 조회',
        description: '페이지네이션된 근무 유형 목록을 조회합니다',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        description: '페이지 번호 (1부터 시작)',
        type: 'integer',
        example: 1,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        description: '페이지당 항목 수',
        type: 'integer',
        example: 10,
        required: false,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '근무 유형 목록 조회 성공',
        type: attendance_type_list_response_dto_1.AttendanceTypeListResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: '서버 내부 오류',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], WorkStandardController.prototype, "getAttendanceTypes", null);
__decorate([
    (0, common_1.Get)('attendance-types/all'),
    (0, swagger_1.ApiOperation)({
        summary: '모든 근무 유형 조회',
        description: '페이지네이션 없이 모든 근무 유형을 조회합니다',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '모든 근무 유형 조회 성공',
        type: [attendance_type_response_dto_1.AttendanceTypeResponseDto],
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkStandardController.prototype, "getAllAttendanceTypes", null);
__decorate([
    (0, common_1.Get)('attendance-types/:id'),
    (0, swagger_1.ApiOperation)({
        summary: '근무 유형 상세 조회',
        description: 'ID로 특정 근무 유형을 조회합니다',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: '근무 유형 ID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '근무 유형 조회 성공',
        type: attendance_type_response_dto_1.AttendanceTypeResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '근무 유형을 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkStandardController.prototype, "getAttendanceTypeById", null);
__decorate([
    (0, common_1.Post)('attendance-types'),
    (0, swagger_1.ApiOperation)({
        summary: '근무 유형 생성',
        description: '새로운 근무 유형을 생성합니다',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: '근무 유형 생성 성공',
        type: attendance_type_response_dto_1.AttendanceTypeResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 요청 데이터',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attendance_type_dto_1.CreateAttendanceTypeDto]),
    __metadata("design:returntype", Promise)
], WorkStandardController.prototype, "createAttendanceType", null);
__decorate([
    (0, common_1.Put)('attendance-types/:id'),
    (0, swagger_1.ApiOperation)({
        summary: '근무 유형 수정',
        description: '기존 근무 유형을 수정합니다',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: '근무 유형 ID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '근무 유형 수정 성공',
        type: attendance_type_response_dto_1.AttendanceTypeResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 요청 데이터',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '근무 유형을 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_attendance_type_dto_1.UpdateAttendanceTypeDto]),
    __metadata("design:returntype", Promise)
], WorkStandardController.prototype, "updateAttendanceType", null);
__decorate([
    (0, common_1.Delete)('attendance-types/:id'),
    (0, swagger_1.ApiOperation)({
        summary: '근무 유형 삭제',
        description: '기존 근무 유형을 삭제합니다',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: '근무 유형 ID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '근무 유형 삭제 성공',
        schema: {
            type: 'boolean',
            example: true,
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '근무 유형을 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkStandardController.prototype, "deleteAttendanceType", null);
__decorate([
    (0, common_1.Get)('holidays'),
    (0, swagger_1.ApiOperation)({
        summary: '공휴일 목록 조회',
        description: '연도별 페이지네이션된 공휴일 목록을 조회합니다',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'year',
        description: '조회할 연도',
        type: 'integer',
        example: 2024,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        description: '페이지 번호 (1부터 시작)',
        type: 'integer',
        example: 1,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        description: '페이지당 항목 수',
        type: 'integer',
        example: 10,
        required: false,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '공휴일 목록 조회 성공',
        type: holiday_list_response_dto_1.HolidayListResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], WorkStandardController.prototype, "getHolidays", null);
__decorate([
    (0, common_1.Post)('holidays'),
    (0, swagger_1.ApiOperation)({
        summary: '공휴일 생성',
        description: '새로운 공휴일을 생성합니다',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: '공휴일 생성 성공',
        type: holiday_response_dto_1.HolidayResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 요청 데이터',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: '해당 날짜에 이미 공휴일이 존재함',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_holiday_dto_1.CreateHolidayDto]),
    __metadata("design:returntype", Promise)
], WorkStandardController.prototype, "createHoliday", null);
__decorate([
    (0, common_1.Put)('holidays/:id'),
    (0, swagger_1.ApiOperation)({
        summary: '공휴일 수정',
        description: '기존 공휴일을 수정합니다',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: '공휴일 ID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '공휴일 수정 성공',
        type: holiday_response_dto_1.HolidayResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 요청 데이터',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '공휴일을 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: '해당 날짜에 이미 공휴일이 존재함',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_holiday_dto_1.UpdateHolidayDto]),
    __metadata("design:returntype", Promise)
], WorkStandardController.prototype, "updateHoliday", null);
__decorate([
    (0, common_1.Delete)('holidays/:id'),
    (0, swagger_1.ApiOperation)({
        summary: '공휴일 삭제',
        description: '기존 공휴일을 삭제합니다',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: '공휴일 ID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '공휴일 삭제 성공',
        schema: {
            type: 'boolean',
            example: true,
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '공휴일을 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkStandardController.prototype, "deleteHoliday", null);
__decorate([
    (0, common_1.Post)('seed-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'SEED 데이터 초기화',
        description: '시스템 초기 데이터를 설정합니다',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'SEED 데이터 초기화 성공',
        schema: {
            type: 'boolean',
            example: true,
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: '권한 부족',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkStandardController.prototype, "initializeSeedData", null);
exports.WorkStandardController = WorkStandardController = __decorate([
    (0, swagger_1.ApiTags)('work-standard'),
    (0, common_1.Controller)({ path: 'work-standard', version: '1' }),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [work_standard_business_1.WorkStandardBusinessService])
], WorkStandardController);
//# sourceMappingURL=work-standard.controller.js.map