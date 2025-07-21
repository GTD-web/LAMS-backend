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
var AttendanceTypeDomainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceTypeDomainService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_type_entity_1 = require("../entities/attendance-type.entity");
let AttendanceTypeDomainService = AttendanceTypeDomainService_1 = class AttendanceTypeDomainService {
    constructor(attendanceTypeRepository) {
        this.attendanceTypeRepository = attendanceTypeRepository;
        this.logger = new common_1.Logger(AttendanceTypeDomainService_1.name);
    }
    async findAttendanceTypeById(attendanceTypeId) {
        return await this.attendanceTypeRepository.findOne({
            where: { attendanceTypeId },
        });
    }
    async findAttendanceTypes(page = 1, limit = 10, where, order) {
        const skip = (page - 1) * limit;
        const take = limit;
        const [attendanceTypes, total] = await Promise.all([
            this.attendanceTypeRepository.find({ where, order, skip, take }),
            this.attendanceTypeRepository.count({ where }),
        ]);
        return { attendanceTypes, total };
    }
    async createAttendanceType(attendanceTypeData) {
        const newAttendanceType = this.attendanceTypeRepository.create(attendanceTypeData);
        return await this.attendanceTypeRepository.save(newAttendanceType);
    }
    async updateAttendanceType(attendanceTypeId, updateData) {
        await this.attendanceTypeRepository.update(attendanceTypeId, updateData);
        return await this.findAttendanceTypeById(attendanceTypeId);
    }
    async deleteAttendanceType(attendanceTypeId) {
        const result = await this.attendanceTypeRepository.delete(attendanceTypeId);
        return result.affected > 0;
    }
    async saveAttendanceType(attendanceType) {
        return await this.attendanceTypeRepository.save(attendanceType);
    }
    async findAllAttendanceTypes() {
        return await this.attendanceTypeRepository.find();
    }
};
exports.AttendanceTypeDomainService = AttendanceTypeDomainService;
exports.AttendanceTypeDomainService = AttendanceTypeDomainService = AttendanceTypeDomainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_type_entity_1.AttendanceTypeEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AttendanceTypeDomainService);
//# sourceMappingURL=attendance-type-domain.service.js.map