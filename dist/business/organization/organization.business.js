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
var OrganizationBusinessService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationBusinessService = void 0;
const common_1 = require("@nestjs/common");
const organization_context_service_1 = require("../../contexts/organization/organization-context.service");
const employee_response_dto_1 = require("../../interfaces/dto/organization/responses/employee-response.dto");
const success_message_helper_1 = require("../../common/helpers/success-message.helper");
const class_transformer_1 = require("class-transformer");
let OrganizationBusinessService = OrganizationBusinessService_1 = class OrganizationBusinessService {
    constructor(organizationContextService) {
        this.organizationContextService = organizationContextService;
        this.logger = new common_1.Logger(OrganizationBusinessService_1.name);
    }
    async syncOrganization() {
        try {
            await this.organizationContextService.부서를_업데이트하고_없는부서는_삭제한다();
            await this.organizationContextService.직원을_업데이트한다();
            await this.organizationContextService.직원_부서_중간테이블_데이터를_삭제_갱신한다();
            this.logger.log('조직 동기화 완료');
            return success_message_helper_1.SuccessMessageHelper.createSyncSuccessResponse(success_message_helper_1.SuccessMessageHelper.MESSAGES.ORGANIZATION_SYNCED);
        }
        catch (error) {
            this.logger.error('조직 동기화 실패', error.stack);
            throw new Error('조직 동기화 중 오류가 발생했습니다. 관리자에게 문의하세요.');
        }
    }
    async getDepartmentList(paginationQuery) {
        if (!paginationQuery.page || !paginationQuery.limit) {
            throw new Error('페이지 정보가 필요합니다.');
        }
        const { page = 1, limit = 10 } = paginationQuery;
        const result = await this.organizationContextService.페이지네이션된_부서_목록을_조회한다(limit, page);
        return success_message_helper_1.SuccessMessageHelper.createPaginatedSuccessResponse(success_message_helper_1.SuccessMessageHelper.MESSAGES.DEPARTMENT_LIST_RETRIEVED, result.data || [], result.meta || { page, limit, total: 0, totalPages: 0 });
    }
    async toggleDepartmentExclusion(departmentId) {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new Error('부서 ID가 필요합니다.');
        }
        const result = await this.organizationContextService.부서의_제외_여부를_변경한다(departmentId);
        return success_message_helper_1.SuccessMessageHelper.createToggleSuccessResponse(success_message_helper_1.SuccessMessageHelper.MESSAGES.DEPARTMENT_EXCLUSION_TOGGLED, result, 'isExclude', result.isExclude);
    }
    async getEmployeeListByDepartment(departmentId, paginationQuery) {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new Error('부서 ID가 필요합니다.');
        }
        if (!paginationQuery.page || !paginationQuery.limit) {
            throw new Error('페이지 정보가 필요합니다.');
        }
        const { page = 1, limit = 10 } = paginationQuery;
        const result = await this.organizationContextService.부서에_해당하는_직원_페이지네이션된_목록을_조회한다(departmentId, limit, page);
        await this.organizationContextService.직원들의_연차_정보를_갱신해서_보여준다();
        return success_message_helper_1.SuccessMessageHelper.createPaginatedSuccessResponse(success_message_helper_1.SuccessMessageHelper.MESSAGES.EMPLOYEE_LIST_RETRIEVED, result.data || [], result.meta || { page, limit, total: 0, totalPages: 0 });
    }
    async toggleEmployeeExclusion(employeeId) {
        if (!employeeId || employeeId.trim().length === 0) {
            throw new Error('직원 ID가 필요합니다.');
        }
        const result = await this.organizationContextService.직원의_제외_여부_변경한다(employeeId);
        const employeeDto = (0, class_transformer_1.plainToInstance)(employee_response_dto_1.EmployeeResponseDto, result);
        return success_message_helper_1.SuccessMessageHelper.createToggleSuccessResponse(success_message_helper_1.SuccessMessageHelper.MESSAGES.EMPLOYEE_EXCLUSION_TOGGLED, employeeDto, 'isExcludedFromCalculation', result.isExcludedFromCalculation);
    }
    async getActiveEmployeesByDepartment(departmentId) {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new Error('부서 ID가 필요합니다.');
        }
        const result = await this.organizationContextService.퇴사데이터가_있는_직원을_제외한_부서의_직원을_조회한다(departmentId);
        const employeeDtos = result.map((employee) => (0, class_transformer_1.plainToInstance)(employee_response_dto_1.EmployeeResponseDto, employee));
        return success_message_helper_1.SuccessMessageHelper.createRetrievalSuccessResponse(success_message_helper_1.SuccessMessageHelper.MESSAGES.EMPLOYEE_LIST_RETRIEVED, employeeDtos, employeeDtos.length);
    }
};
exports.OrganizationBusinessService = OrganizationBusinessService;
exports.OrganizationBusinessService = OrganizationBusinessService = OrganizationBusinessService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [organization_context_service_1.OrganizationContextService])
], OrganizationBusinessService);
//# sourceMappingURL=organization.business.js.map