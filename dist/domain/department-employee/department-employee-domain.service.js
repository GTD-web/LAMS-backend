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
var DepartmentEmployeeDomainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentEmployeeDomainService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const department_employee_entity_1 = require("./entities/department-employee.entity");
let DepartmentEmployeeDomainService = DepartmentEmployeeDomainService_1 = class DepartmentEmployeeDomainService {
    constructor(departmentEmployeeRepository) {
        this.departmentEmployeeRepository = departmentEmployeeRepository;
        this.logger = new common_1.Logger(DepartmentEmployeeDomainService_1.name);
    }
    async saveDepartmentEmployee(department, employee) {
        const departmentEmployee = new department_employee_entity_1.DepartmentEmployeeEntity();
        departmentEmployee.department = department;
        departmentEmployee.employee = employee;
        const savedRelation = await this.departmentEmployeeRepository.save(departmentEmployee);
        this.logger.log(`부서-직원 관계 생성: ${department.departmentName} -> ${employee.employeeName}`);
        return savedRelation;
    }
    async deleteDepartmentEmployeeByEmployeeId(employeeId) {
        await this.departmentEmployeeRepository.delete({ employee: { employeeId } });
        this.logger.log(`직원 ID로 부서-직원 관계 삭제: ${employeeId}`);
    }
    async findDepartmentEmployeesByDepartmentId(departmentId) {
        const relations = await this.departmentEmployeeRepository.find({
            where: { department: { departmentId } },
            relations: ['department', 'employee'],
        });
        this.logger.log(`부서별 직원 관계 조회: ${departmentId} -> ${relations.length}개`);
        return relations;
    }
    async findDepartmentEmployeesByEmployeeId(employeeId) {
        const relations = await this.departmentEmployeeRepository.find({
            where: { employee: { employeeId } },
            relations: ['department', 'employee'],
        });
        this.logger.log(`직원별 부서 관계 조회: ${employeeId} -> ${relations.length}개`);
        return relations;
    }
    async deleteAllDepartmentEmployees() {
        await this.departmentEmployeeRepository.clear();
    }
    async existsDepartmentEmployee(departmentId, employeeId) {
        const count = await this.departmentEmployeeRepository.count({
            where: {
                department: { departmentId },
                employee: { employeeId },
            },
        });
        return count > 0;
    }
};
exports.DepartmentEmployeeDomainService = DepartmentEmployeeDomainService;
exports.DepartmentEmployeeDomainService = DepartmentEmployeeDomainService = DepartmentEmployeeDomainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(department_employee_entity_1.DepartmentEmployeeEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DepartmentEmployeeDomainService);
//# sourceMappingURL=department-employee-domain.service.js.map