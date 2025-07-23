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
var EmployeeDomainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeDomainService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_info_entity_1 = require("../entities/employee-info.entity");
const pagination_response_dto_1 = require("../../../common/dtos/pagination/pagination-response.dto");
const employee_response_dto_1 = require("../../../interfaces/dto/organization/responses/employee-response.dto");
const class_transformer_1 = require("class-transformer");
let EmployeeDomainService = EmployeeDomainService_1 = class EmployeeDomainService {
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
        this.logger = new common_1.Logger(EmployeeDomainService_1.name);
    }
    async toggleEmployeeExclude(employeeId) {
        const employee = await this.findEmployeeById(employeeId);
        if (!employee) {
            throw new common_1.NotFoundException('직원을 찾을 수 없습니다.');
        }
        employee.isExcludedFromCalculation = !employee.isExcludedFromCalculation;
        const updatedEmployee = await this.employeeRepository.save(employee);
        return updatedEmployee;
    }
    async findEmployeeById(employeeId) {
        return await this.employeeRepository.findOne({
            where: { employeeId },
            relations: ['department'],
        });
    }
    async findEmployeeByEmployeeNumber(employeeNumber) {
        return await this.employeeRepository.findOne({
            where: { employeeNumber },
            relations: ['department'],
        });
    }
    async findAllEmployees(isExclude) {
        const whereCondition = isExclude !== undefined ? { isExcludedFromCalculation: isExclude } : {};
        return await this.employeeRepository.find({
            where: whereCondition,
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
    }
    async findEmployeesByDepartmentWithQuitFilter(departmentId) {
        return await this.employeeRepository.find({
            where: {
                department: { departmentId },
                quitedAt: (0, typeorm_2.IsNull)(),
            },
            relations: ['department'],
            order: { employeeName: 'ASC' },
        });
    }
    async findActiveEmployees() {
        return await this.employeeRepository.find({
            where: { quitedAt: (0, typeorm_2.IsNull)() },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
    }
    async findInactiveEmployees() {
        return await this.employeeRepository.find({
            where: { quitedAt: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()) },
            relations: ['department'],
            order: { quitedAt: 'DESC' },
        });
    }
    async searchEmployeesWithCriteria(searchCriteria) {
        const { employeeName, employeeNumber, departmentId, isExcludedFromCalculation, keyword, limit = 10, page = 1, } = searchCriteria;
        const whereConditions = [];
        if (keyword) {
            const keywordConditions = {
                employeeName: (0, typeorm_2.ILike)(`%${keyword}%`),
            };
            if (isExcludedFromCalculation !== undefined) {
                keywordConditions.isExcludedFromCalculation = isExcludedFromCalculation;
            }
            if (departmentId) {
                keywordConditions.department = { departmentId };
            }
            whereConditions.push(keywordConditions);
            const numberConditions = {
                employeeNumber: (0, typeorm_2.ILike)(`%${keyword}%`),
            };
            if (isExcludedFromCalculation !== undefined) {
                numberConditions.isExcludedFromCalculation = isExcludedFromCalculation;
            }
            if (departmentId) {
                numberConditions.department = { departmentId };
            }
            whereConditions.push(numberConditions);
        }
        else {
            const individualConditions = {};
            if (employeeName) {
                individualConditions.employeeName = (0, typeorm_2.ILike)(`%${employeeName}%`);
            }
            if (employeeNumber) {
                individualConditions.employeeNumber = (0, typeorm_2.ILike)(`%${employeeNumber}%`);
            }
            if (departmentId) {
                individualConditions.department = { departmentId };
            }
            if (isExcludedFromCalculation !== undefined) {
                individualConditions.isExcludedFromCalculation = isExcludedFromCalculation;
            }
            if (Object.keys(individualConditions).length > 0) {
                whereConditions.push(individualConditions);
            }
        }
        const findOptions = {
            where: whereConditions.length > 0 ? whereConditions : undefined,
            order: { employeeName: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
            relations: ['department'],
        };
        const [employees, total] = await this.employeeRepository.findAndCount(findOptions);
        const meta = new pagination_response_dto_1.PaginationMetaDto(page, limit, total);
        const employeeDtos = employees.map((employee) => (0, class_transformer_1.plainToInstance)(employee_response_dto_1.EmployeeResponseDto, employee));
        const paginatedResult = new pagination_response_dto_1.PaginatedResponseDto(employeeDtos, meta);
        this.logger.log(`직원 검색 완료: ${employees.length}명 조회 (총 ${total}명)`);
        return paginatedResult;
    }
    async searchEmployees(searchTerm) {
        return await this.employeeRepository.find({
            where: [{ employeeName: (0, typeorm_2.Like)(`%${searchTerm}%`) }, { employeeNumber: (0, typeorm_2.Like)(`%${searchTerm}%`) }],
            relations: ['department'],
            order: { employeeName: 'ASC' },
        });
    }
    async searchEmployeesByNumber(employeeNumber) {
        if (!employeeNumber || employeeNumber.trim().length === 0) {
            throw new common_1.BadRequestException('사원번호가 필요합니다.');
        }
        const employees = await this.employeeRepository.find({
            where: { employeeNumber: (0, typeorm_2.ILike)(`%${employeeNumber}%`) },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
        this.logger.log(`사원번호 검색 완료: ${employees.length}명 조회`);
        return employees;
    }
    async findActiveEmployeesByDepartment(departmentId) {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new common_1.BadRequestException('부서 ID가 필요합니다.');
        }
        const employees = await this.employeeRepository.find({
            where: {
                department: { departmentId },
                quitedAt: (0, typeorm_2.IsNull)(),
            },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
        this.logger.log(`부서별 활성 직원 조회 완료: ${employees.length}명 조회`);
        return employees;
    }
    async findIncludedEmployees() {
        const employees = await this.employeeRepository.find({
            where: { isExcludedFromCalculation: false },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
        this.logger.log(`계산 포함 직원 조회 완료: ${employees.length}명 조회`);
        return employees;
    }
    async findExcludedEmployees() {
        const employees = await this.employeeRepository.find({
            where: { isExcludedFromCalculation: true },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
        this.logger.log(`계산 제외 직원 조회 완료: ${employees.length}명 조회`);
        return employees;
    }
    async saveEmployee(employee) {
        return await this.employeeRepository.save(employee);
    }
};
exports.EmployeeDomainService = EmployeeDomainService;
exports.EmployeeDomainService = EmployeeDomainService = EmployeeDomainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_info_entity_1.EmployeeInfoEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmployeeDomainService);
//# sourceMappingURL=employee-domain.service.js.map