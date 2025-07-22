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
var OrganizationContextService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationContextService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const department_domain_service_1 = require("../../domain/organization/department/services/department-domain.service");
const employee_domain_service_1 = require("../../domain/organization/employee/services/employee-domain.service");
const department_employee_domain_service_1 = require("../../domain/organization/department-employee/department-employee-domain.service");
const employee_info_entity_1 = require("../../domain/organization/employee/entities/employee-info.entity");
const department_employee_entity_1 = require("../../domain/organization/department-employee/entities/department-employee.entity");
let OrganizationContextService = OrganizationContextService_1 = class OrganizationContextService {
    constructor(departmentDomainService, employeeDomainService, departmentEmployeeDomainService) {
        this.departmentDomainService = departmentDomainService;
        this.employeeDomainService = employeeDomainService;
        this.departmentEmployeeDomainService = departmentEmployeeDomainService;
        this.logger = new common_1.Logger(OrganizationContextService_1.name);
        this.MMS_BASE_URL = 'https://lumir-metadata-manager.vercel.app';
    }
    async getDepartmentsFromMMS() {
        try {
            const department = await axios_1.default.get(`${this.MMS_BASE_URL}/api/departments?hierarchy=true`);
            console.log('department:', department.data);
            return department.data;
        }
        catch (error) {
            this.logger.error('MMS 부서 데이터 조회 실패', error);
            throw new Error('MMS 부서 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    }
    async getEmployeesFromMMS() {
        try {
            const employee = await axios_1.default.get(`${this.MMS_BASE_URL}/api/employees`);
            console.log('employee:', employee.data);
            return employee.data;
        }
        catch (error) {
            this.logger.error('MMS 직원 데이터 조회 실패', error);
            throw new Error('MMS 직원 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    }
    async 부서를_업데이트하고_없는부서는_삭제한다(mmsDepartments) {
        try {
            const existingDepartments = await this.departmentDomainService.findAllDepartments();
            for (const mmsDept of mmsDepartments) {
                await this.departmentDomainService.createOrUpdateDepartment(mmsDept);
            }
            const mmsIds = mmsDepartments.map((dept) => dept.id);
            for (const existingDept of existingDepartments) {
                if (existingDept.mmsDepartmentId && !mmsIds.includes(existingDept.mmsDepartmentId)) {
                    await this.departmentDomainService.removeDepartment(existingDept.departmentId);
                }
            }
            this.logger.log('부서 업데이트 및 삭제 완료');
        }
        catch (error) {
            this.logger.error('부서 업데이트 및 삭제 실패', error.stack);
            throw error;
        }
    }
    async 직원을_업데이트한다(mmsEmployee) {
        try {
            const existingEmployee = await this.employeeDomainService.findEmployeeByEmployeeNumber(mmsEmployee.employee_number);
            if (existingEmployee) {
                existingEmployee.employeeName = mmsEmployee.name;
                existingEmployee.email = mmsEmployee.email;
                existingEmployee.entryAt = mmsEmployee.hire_date;
                if (mmsEmployee.department?._id) {
                    const department = await this.departmentDomainService.findDepartmentByMMSDepartmentId(mmsEmployee.department._id);
                    if (department) {
                        existingEmployee.department = department;
                    }
                }
                await this.employeeDomainService.saveEmployee(existingEmployee);
                this.logger.log(`직원 정보 업데이트: ${mmsEmployee.name}`);
            }
            else {
                const newEmployee = new employee_info_entity_1.EmployeeInfoEntity();
                newEmployee.employeeNumber = mmsEmployee.employee_number;
                newEmployee.employeeName = mmsEmployee.name;
                newEmployee.email = mmsEmployee.email;
                newEmployee.entryAt = mmsEmployee.hire_date;
                newEmployee.isExcludedFromCalculation = false;
                if (mmsEmployee.department?._id) {
                    const department = await this.departmentDomainService.findDepartmentByMMSDepartmentId(mmsEmployee.department._id);
                    if (department) {
                        newEmployee.department = department;
                    }
                }
                this.logger.log(`새 직원 생성: ${mmsEmployee.name}`);
                return await this.employeeDomainService.saveEmployee(newEmployee);
            }
        }
        catch (error) {
            this.logger.error('직원 업데이트 실패', error.stack);
            throw error;
        }
    }
    async 직원_부서_중간테이블_데이터를_삭제_갱신한다(employee, departmentId) {
        await this.departmentEmployeeDomainService.deleteDepartmentEmployeeByEmployeeId(employee.employeeId);
        const department = await this.departmentDomainService.findDepartmentByMMSDepartmentId(departmentId);
        const departmentEmployee = new department_employee_entity_1.DepartmentEmployeeEntity();
        departmentEmployee.department = department;
        departmentEmployee.employee = employee;
        await this.departmentEmployeeDomainService.saveDepartmentEmployee(employee.department, employee);
    }
    async 페이지네이션된_부서_목록을_조회한다(paginationQuery) {
        return await this.departmentDomainService.findPaginatedDepartments(paginationQuery.page, paginationQuery.limit);
    }
    async 권한이_있는_부서_조회(userId) {
        return await this.departmentDomainService.findAllDepartments();
    }
    async 부서의_제외_여부를_변경한다(departmentId) {
        return await this.departmentDomainService.toggleDepartmentExclusion(departmentId);
    }
    async 해당_부서_직원의_페이지네이션된_목록을_조회한다(departmentId, paginationQuery) {
        return await this.employeeDomainService.searchEmployeesWithCriteria({
            departmentId,
            paginationQuery,
        });
    }
    async 직원들의_연차_정보를_갱신해서_보여준다() {
        this.logger.log('직원들의 연차 정보 갱신 완료');
    }
    async 직원의_제외_여부_변경한다(employeeId) {
        return await this.employeeDomainService.toggleEmployeeExclude(employeeId);
    }
    async 퇴사데이터가_있는_직원을_제외한_부서의_직원을_조회한다(departmentId) {
        return await this.employeeDomainService.findActiveEmployeesByDepartment(departmentId);
    }
    async findDepartmentById(departmentId) {
        return await this.departmentDomainService.findDepartmentById(departmentId);
    }
};
exports.OrganizationContextService = OrganizationContextService;
exports.OrganizationContextService = OrganizationContextService = OrganizationContextService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [department_domain_service_1.DepartmentDomainService,
        employee_domain_service_1.EmployeeDomainService,
        department_employee_domain_service_1.DepartmentEmployeeDomainService])
], OrganizationContextService);
//# sourceMappingURL=organization-context.service.js.map