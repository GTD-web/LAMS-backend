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
exports.OrganizationBusinessService = void 0;
const common_1 = require("@nestjs/common");
const organization_context_service_1 = require("../../contexts/organization/organization-context.service");
const department_response_dto_1 = require("../../interfaces/dto/organization/responses/department-response.dto");
const employee_response_dto_1 = require("../../interfaces/dto/organization/responses/employee-response.dto");
const sync_organization_response_dto_1 = require("../../interfaces/dto/organization/responses/sync-organization-response.dto");
const class_transformer_1 = require("class-transformer");
const user_department_authority_context_1 = require("../../contexts/user-department-authority/user-department-authority-context");
let OrganizationBusinessService = class OrganizationBusinessService {
    constructor(organizationContextService, userDepartmentAuthorityContext) {
        this.organizationContextService = organizationContextService;
        this.userDepartmentAuthorityContext = userDepartmentAuthorityContext;
    }
    async syncOrganization() {
        const mmsDepartments = await this.organizationContextService.getDepartmentsFromMMS();
        const mmsEmployees = await this.organizationContextService.getEmployeesFromMMS();
        await this.organizationContextService.부서를_업데이트하고_없는부서는_삭제한다(mmsDepartments);
        for (const mmsEmployee of mmsEmployees) {
            const employee = await this.organizationContextService.직원을_업데이트한다(mmsEmployee);
            if (mmsEmployee.department && mmsEmployee.status === '재직중') {
                await this.organizationContextService.직원_부서_중간테이블_데이터를_삭제_갱신한다(employee, mmsEmployee.department._id);
            }
        }
        return new sync_organization_response_dto_1.SyncOrganizationResponseDto();
    }
    async getDepartmentList(paginationQuery) {
        return await this.organizationContextService.페이지네이션된_부서_목록을_조회한다(paginationQuery);
    }
    async getAccessibleAuthorizedDepartments(userId) {
        const departments = await this.userDepartmentAuthorityContext.사용자의_접근_가능한_부서_목록을_조회한다(userId);
        return departments.map((department) => (0, class_transformer_1.plainToInstance)(department_response_dto_1.DepartmentResponseDto, department));
    }
    async getReviewableAuthorizedDepartments(userId) {
        const departments = await this.userDepartmentAuthorityContext.사용자의_검토_가능한_부서_목록을_조회한다(userId);
        return departments.map((department) => (0, class_transformer_1.plainToInstance)(department_response_dto_1.DepartmentResponseDto, department));
    }
    async toggleDepartmentExclusion(departmentId) {
        const result = await this.organizationContextService.부서의_제외_여부를_변경한다(departmentId);
        return (0, class_transformer_1.plainToInstance)(department_response_dto_1.DepartmentResponseDto, result);
    }
    async getEmployeeListByDepartment(departmentId, paginationQuery) {
        const result = await this.organizationContextService.해당_부서_직원의_페이지네이션된_목록을_조회한다(departmentId, paginationQuery);
        await this.organizationContextService.직원들의_연차_정보를_갱신해서_보여준다();
        return result;
    }
    async toggleEmployeeExclusion(employeeId) {
        if (!employeeId || employeeId.trim().length === 0) {
            throw new Error('직원 ID가 필요합니다.');
        }
        const result = await this.organizationContextService.직원의_제외_여부_변경한다(employeeId);
        return (0, class_transformer_1.plainToInstance)(employee_response_dto_1.EmployeeResponseDto, result);
    }
    async getActiveEmployeesByDepartment(departmentId) {
        const result = await this.organizationContextService.퇴사데이터가_있는_직원을_제외한_부서의_직원을_조회한다(departmentId);
        return result.map((employee) => (0, class_transformer_1.plainToInstance)(employee_response_dto_1.EmployeeResponseDto, employee));
    }
};
exports.OrganizationBusinessService = OrganizationBusinessService;
exports.OrganizationBusinessService = OrganizationBusinessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [organization_context_service_1.OrganizationContextService,
        user_department_authority_context_1.UserDepartmentAuthorityContext])
], OrganizationBusinessService);
//# sourceMappingURL=organization.business.js.map