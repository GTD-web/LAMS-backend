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
var DepartmentDomainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentDomainService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const department_info_entity_1 = require("../entities/department-info.entity");
let DepartmentDomainService = DepartmentDomainService_1 = class DepartmentDomainService {
    constructor(departmentRepository) {
        this.departmentRepository = departmentRepository;
        this.logger = new common_1.Logger(DepartmentDomainService_1.name);
    }
    async findDepartmentById(departmentId) {
        return await this.departmentRepository.findOne({
            where: { departmentId },
            relations: ['employees', 'employees.employee', 'accessAuthorities', 'reviewAuthorities'],
        });
    }
    async findDepartmentByCode(departmentCode) {
        return await this.departmentRepository.findOne({
            where: { departmentCode },
        });
    }
    async findAllDepartments(isExclude) {
        const whereCondition = isExclude !== undefined ? { isExclude } : {};
        return await this.departmentRepository.find({
            where: whereCondition,
            order: { createdAt: 'DESC' },
            relations: ['employees', 'employees.employee'],
        });
    }
    async findPaginatedDepartments(page, limit, isExclude) {
        const skip = (page - 1) * limit;
        const whereCondition = isExclude !== undefined ? { isExclude } : {};
        const [departments, total] = await this.departmentRepository.findAndCount({
            where: whereCondition,
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
            relations: ['employees', 'employees.employee'],
        });
        this.logger.log(`페이지네이션된 부서 목록 조회: ${departments.length}개 조회`);
        return { departments, total };
    }
    async updateDepartment(departmentId, updateData) {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new common_1.BadRequestException('부서 ID가 필요합니다.');
        }
        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new common_1.NotFoundException('부서를 찾을 수 없습니다.');
        }
        Object.assign(department, updateData);
        const updatedDepartment = await this.departmentRepository.save(department);
        this.logger.log(`부서 정보 수정 완료: ${updatedDepartment.departmentName}`);
        return updatedDepartment;
    }
    async toggleDepartmentExclusion(departmentId) {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new common_1.BadRequestException('부서 ID가 필요합니다.');
        }
        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new common_1.NotFoundException('부서를 찾을 수 없습니다.');
        }
        department.isExclude = !department.isExclude;
        const updatedDepartment = await this.departmentRepository.save(department);
        this.logger.log(`부서 제외 여부 변경: ${updatedDepartment.departmentName} -> ${updatedDepartment.isExclude}`);
        return updatedDepartment;
    }
    async findDepartmentByMMSDepartmentId(mmsDepartmentId) {
        return await this.departmentRepository.findOne({
            where: { mmsDepartmentId },
        });
    }
    async createOrUpdateDepartment(departmentData, parentDepartment) {
        let department = await this.findDepartmentByMMSDepartmentId(departmentData.id);
        if (department) {
            department.departmentName = departmentData.department_name;
            department.departmentCode = departmentData.department_code;
        }
        else {
            department = this.departmentRepository.create({
                departmentId: departmentData.id,
                departmentName: departmentData.department_name,
                departmentCode: departmentData.department_code,
            });
        }
        if (parentDepartment) {
            department.parent = parentDepartment;
        }
        if (departmentData.child_departments && departmentData.child_departments.length > 0) {
            for (const childDepartment of departmentData.child_departments) {
                await this.createOrUpdateDepartment(childDepartment, department);
            }
        }
        const savedDepartment = await this.departmentRepository.save(department);
        this.logger.log(`MMS 부서 생성: ${savedDepartment.departmentName}`);
        return savedDepartment;
    }
    async removeDepartment(departmentId) {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new common_1.BadRequestException('부서 ID가 필요합니다.');
        }
        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new common_1.NotFoundException('부서를 찾을 수 없습니다.');
        }
        await this.departmentRepository.remove(department);
        this.logger.log(`부서 삭제 완료: ${department.departmentName}`);
    }
    async searchDepartments(searchCriteria) {
        const { departmentName, departmentCode, isExclude, keyword, limit = 10, offset = 0 } = searchCriteria;
        const whereConditions = [];
        if (keyword) {
            const keywordConditions = {
                departmentName: (0, typeorm_2.ILike)(`%${keyword}%`),
            };
            if (isExclude !== undefined) {
                keywordConditions.isExclude = isExclude;
            }
            whereConditions.push(keywordConditions);
            const codeConditions = {
                departmentCode: (0, typeorm_2.ILike)(`%${keyword}%`),
            };
            if (isExclude !== undefined) {
                codeConditions.isExclude = isExclude;
            }
            whereConditions.push(codeConditions);
        }
        else {
            const individualConditions = {};
            if (departmentName) {
                individualConditions.departmentName = (0, typeorm_2.ILike)(`%${departmentName}%`);
            }
            if (departmentCode) {
                individualConditions.departmentCode = (0, typeorm_2.ILike)(`%${departmentCode}%`);
            }
            if (isExclude !== undefined) {
                individualConditions.isExclude = isExclude;
            }
            if (Object.keys(individualConditions).length > 0) {
                whereConditions.push(individualConditions);
            }
        }
        const findOptions = {
            where: whereConditions.length > 0 ? whereConditions : isExclude !== undefined ? { isExclude } : undefined,
            order: { departmentName: 'ASC' },
            skip: offset,
            take: limit,
            relations: ['employees', 'employees.employee'],
        };
        const [departments, total] = await this.departmentRepository.findAndCount(findOptions);
        this.logger.log(`부서 검색 완료: ${departments.length}개 조회 (총 ${total}개)`);
        return { departments, total };
    }
};
exports.DepartmentDomainService = DepartmentDomainService;
exports.DepartmentDomainService = DepartmentDomainService = DepartmentDomainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(department_info_entity_1.DepartmentInfoEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DepartmentDomainService);
//# sourceMappingURL=department-domain.service.js.map