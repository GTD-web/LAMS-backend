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
var WorkStandardContextService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkStandardContextService = void 0;
const common_1 = require("@nestjs/common");
const attendance_type_domain_service_1 = require("../../domain/attendance-type/services/attendance-type-domain.service");
const holiday_domain_service_1 = require("../../domain/holiday/services/holiday-domain.service");
let WorkStandardContextService = WorkStandardContextService_1 = class WorkStandardContextService {
    constructor(attendanceTypeDomainService, holidayDomainService) {
        this.attendanceTypeDomainService = attendanceTypeDomainService;
        this.holidayDomainService = holidayDomainService;
        this.logger = new common_1.Logger(WorkStandardContextService_1.name);
    }
    async 페이지네이션된_근무_유형_목록_조회한다(limit, page) {
        const { attendanceTypes, total } = await this.attendanceTypeDomainService.findAttendanceTypes(page, limit, undefined, { createdAt: 'DESC' });
        this.logger.log(`근무 유형 목록 조회 완료: ${attendanceTypes.length}개 (페이지: ${page}, 제한: ${limit})`);
        return {
            attendanceTypes,
            total,
            page,
            limit,
        };
    }
    async 근무_유형_ID로_조회한다(attendanceTypeId) {
        const attendanceType = await this.attendanceTypeDomainService.findAttendanceTypeById(attendanceTypeId);
        if (attendanceType) {
            this.logger.log(`근무 유형 조회 완료: ${attendanceType.title} (ID: ${attendanceTypeId})`);
        }
        else {
            this.logger.warn(`근무 유형을 찾을 수 없음: ${attendanceTypeId}`);
        }
        return attendanceType;
    }
    async 근무_유형을_생성한다(attendanceTypeData) {
        const savedAttendanceType = await this.attendanceTypeDomainService.createAttendanceType(attendanceTypeData);
        this.logger.log(`근무 유형 생성 완료: ${savedAttendanceType.title} (ID: ${savedAttendanceType.attendanceTypeId})`);
        return savedAttendanceType;
    }
    async 근무_유형을_업데이트한다(attendanceTypeId, updateData) {
        const updatedAttendanceType = await this.attendanceTypeDomainService.updateAttendanceType(attendanceTypeId, updateData);
        if (updatedAttendanceType) {
            this.logger.log(`근무 유형 업데이트 완료: ${updatedAttendanceType.title} (ID: ${attendanceTypeId})`);
        }
        return updatedAttendanceType;
    }
    async 근무_유형을_삭제한다(attendanceTypeId) {
        const isDeleted = await this.attendanceTypeDomainService.deleteAttendanceType(attendanceTypeId);
        if (isDeleted) {
            this.logger.log(`근무 유형 삭제 완료: ${attendanceTypeId}`);
        }
        else {
            this.logger.warn(`삭제할 근무 유형을 찾을 수 없음: ${attendanceTypeId}`);
        }
        return isDeleted;
    }
    async 모든_근무_유형을_조회한다() {
        const attendanceTypes = await this.attendanceTypeDomainService.findAllAttendanceTypes();
        this.logger.log(`모든 근무 유형 조회 완료: ${attendanceTypes.length}개`);
        return attendanceTypes;
    }
    async 페이지네이션된_연도별_휴일_목록_조회한다(year, limit, page) {
        const { holidays, total } = await this.holidayDomainService.findHolidaysByYear(year, page, limit, {
            holidayDate: 'ASC',
        });
        this.logger.log(`${year}년 휴일 목록 조회 완료: ${holidays.length}개 (페이지: ${page}, 제한: ${limit})`);
        return {
            holidays,
            total,
            page,
            limit,
            year,
        };
    }
    async 휴일_ID를_체크한다(holidayId) {
        const holiday = await this.holidayDomainService.findHolidayById(holidayId);
        if (!holiday) {
            throw new Error(`휴일을 찾을 수 없습니다: ${holidayId}`);
        }
        this.logger.log(`휴일 ID 체크 완료: ${holiday.holidayName} (ID: ${holidayId})`);
        return holiday;
    }
    async 관리자는_휴일을_생성한다(date, holidayName) {
        try {
            const existingHoliday = await this.holidayDomainService.findHolidayByDate(date);
            if (existingHoliday) {
                throw new Error(`해당 날짜에 이미 휴일이 존재합니다: ${date}`);
            }
            const savedHoliday = await this.holidayDomainService.createHoliday({
                holidayDate: date,
                holidayName,
            });
            this.logger.log(`휴일 생성 완료: ${savedHoliday.holidayName} (날짜: ${date})`);
            return savedHoliday;
        }
        catch (error) {
            this.logger.error(`휴일 생성 실패: ${date} - ${holidayName}`, error);
            throw error;
        }
    }
    async 관리자는_휴일을_업데이트한다(holidayId, date, holidayName) {
        try {
            await this.휴일_ID를_체크한다(holidayId);
            const existingHoliday = await this.holidayDomainService.findHolidayByDate(date);
            if (existingHoliday && existingHoliday.holidayId !== holidayId) {
                throw new Error(`해당 날짜에 이미 휴일이 존재합니다: ${date}`);
            }
            const updatedHoliday = await this.holidayDomainService.updateHoliday(holidayId, {
                holidayDate: date,
                holidayName,
            });
            this.logger.log(`휴일 업데이트 완료: ${updatedHoliday.holidayName} (날짜: ${date})`);
            return updatedHoliday;
        }
        catch (error) {
            this.logger.error(`휴일 업데이트 실패: ${holidayId} - ${date} - ${holidayName}`, error);
            throw error;
        }
    }
    async 관리자는_휴일을_삭제한다(holidayId) {
        try {
            const holiday = await this.휴일_ID를_체크한다(holidayId);
            const isDeleted = await this.holidayDomainService.deleteHoliday(holidayId);
            if (isDeleted) {
                this.logger.log(`휴일 삭제 완료: ${holiday.holidayName} (날짜: ${holiday.holidayDate})`);
            }
            return isDeleted;
        }
        catch (error) {
            this.logger.error(`휴일 삭제 실패: ${holidayId}`, error);
            throw error;
        }
    }
    async 일간_이벤트_요약에_공휴일이_변경된다(date) {
        this.logger.log(`일간 이벤트 요약 업데이트 예정: ${date}`);
    }
    async 월간_이벤트_요약에_공휴일이_변경된다(year, month) {
        this.logger.log(`월간 이벤트 요약 업데이트 예정: ${year}-${month}`);
    }
    async SEED_데이터_초기화_설정한다() {
        this.logger.log('SEED 데이터 초기화 설정 완료');
    }
};
exports.WorkStandardContextService = WorkStandardContextService;
exports.WorkStandardContextService = WorkStandardContextService = WorkStandardContextService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attendance_type_domain_service_1.AttendanceTypeDomainService,
        holiday_domain_service_1.HolidayDomainService])
], WorkStandardContextService);
//# sourceMappingURL=work-standard-context.service.js.map