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
var HolidayDomainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolidayDomainService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const holiday_info_entity_1 = require("../entities/holiday-info.entity");
let HolidayDomainService = HolidayDomainService_1 = class HolidayDomainService {
    constructor(holidayRepository) {
        this.holidayRepository = holidayRepository;
        this.logger = new common_1.Logger(HolidayDomainService_1.name);
    }
    async findHolidayById(holidayId) {
        return await this.holidayRepository.findOne({
            where: { holidayId },
        });
    }
    async findHolidaysByYear(year, page = 1, limit = 10, order) {
        const where = {
            holidayDate: `${year}-%`,
        };
        const skip = (page - 1) * limit;
        const take = limit;
        const [holidays, total] = await Promise.all([
            this.holidayRepository.find({ where, order, skip, take }),
            this.holidayRepository.count({ where }),
        ]);
        return { holidays, total };
    }
    async findHolidays(page = 1, limit = 10, where, order) {
        const skip = (page - 1) * limit;
        const take = limit;
        const [holidays, total] = await Promise.all([
            this.holidayRepository.find({ where, order, skip, take }),
            this.holidayRepository.count({ where }),
        ]);
        return { holidays, total };
    }
    async createHoliday(holidayData) {
        const newHoliday = this.holidayRepository.create(holidayData);
        return await this.holidayRepository.save(newHoliday);
    }
    async updateHoliday(holidayId, updateData) {
        await this.holidayRepository.update(holidayId, updateData);
        return await this.findHolidayById(holidayId);
    }
    async deleteHoliday(holidayId) {
        const result = await this.holidayRepository.delete(holidayId);
        return result.affected > 0;
    }
    async saveHoliday(holiday) {
        return await this.holidayRepository.save(holiday);
    }
    async findAllHolidays() {
        return await this.holidayRepository.find();
    }
    async findHolidayByDate(holidayDate) {
        const holidays = await this.holidayRepository.find({
            where: { holidayDate },
        });
        return holidays.length > 0 ? holidays[0] : null;
    }
};
exports.HolidayDomainService = HolidayDomainService;
exports.HolidayDomainService = HolidayDomainService = HolidayDomainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(holiday_info_entity_1.HolidayInfoEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HolidayDomainService);
//# sourceMappingURL=holiday-domain.service.js.map