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
exports.OrganizationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const organization_business_1 = require("../../business/organization/organization.business");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_enum_1 = require("../../domain/user/enum/user.enum");
const pagination_query_dto_1 = require("../../common/dtos/pagination/pagination-query.dto");
const pagination_response_dto_1 = require("../../common/dtos/pagination/pagination-response.dto");
const sync_organization_response_dto_1 = require("../dto/organization/responses/sync-organization-response.dto");
const department_response_dto_1 = require("../dto/organization/responses/department-response.dto");
const employee_response_dto_1 = require("../dto/organization/responses/employee-response.dto");
const error_response_dto_1 = require("../../common/dtos/common/error-response.dto");
let OrganizationController = class OrganizationController {
    constructor(organizationBusinessService) {
        this.organizationBusinessService = organizationBusinessService;
    }
    async syncOrganization() {
        return await this.organizationBusinessService.syncOrganization();
    }
    async getDepartmentList(paginationQuery) {
        return await this.organizationBusinessService.getDepartmentList(paginationQuery);
    }
    async toggleDepartmentExclusion(departmentId) {
        return await this.organizationBusinessService.toggleDepartmentExclusion(departmentId);
    }
    async getEmployeeListByDepartment(departmentId, paginationQuery) {
        return await this.organizationBusinessService.getEmployeeListByDepartment(departmentId, paginationQuery);
    }
    async toggleEmployeeExclusion(employeeId) {
        return await this.organizationBusinessService.toggleEmployeeExclusion(employeeId);
    }
    async getActiveEmployeesByDepartment(departmentId) {
        return await this.organizationBusinessService.getActiveEmployeesByDepartment(departmentId);
    }
};
exports.OrganizationController = OrganizationController;
__decorate([
    (0, common_1.Post)('sync'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '조직 동기화',
        description: 'MMS 시스템과 조직 정보를 동기화합니다. 부서 및 직원 정보를 최신 상태로 업데이트합니다.',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: '조직 동기화 성공',
        type: sync_organization_response_dto_1.SyncOrganizationResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: '접근 권한 없음 - 시스템 관리자 권한 필요',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: '조직 동기화 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "syncOrganization", null);
__decorate([
    (0, common_1.Get)('departments'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '부서 목록 조회',
        description: '페이지네이션된 부서 목록을 조회합니다.',
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
        description: '부서 목록 조회 성공',
        type: pagination_response_dto_1.PaginatedResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: '접근 권한 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getDepartmentList", null);
__decorate([
    (0, common_1.Patch)('departments/:departmentId/toggle-exclusion'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '부서 제외 여부 변경',
        description: '특정 부서의 제외 여부를 토글합니다.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '부서 제외 여부 변경 성공',
        type: department_response_dto_1.DepartmentResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: '접근 권한 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '부서를 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 부서 ID',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('departmentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "toggleDepartmentExclusion", null);
__decorate([
    (0, common_1.Get)('departments/:departmentId/employees'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '부서별 직원 목록 조회',
        description: '특정 부서에 속한 직원들의 페이지네이션된 목록을 조회합니다.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
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
        description: '부서별 직원 목록 조회 성공',
        type: pagination_response_dto_1.PaginatedResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: '접근 권한 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '부서를 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 부서 ID',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('departmentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getEmployeeListByDepartment", null);
__decorate([
    (0, common_1.Patch)('employees/:employeeId/toggle-exclusion'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '직원 제외 여부 변경',
        description: '특정 직원의 제외 여부를 토글합니다.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'employeeId',
        description: '직원 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '직원 제외 여부 변경 성공',
        type: employee_response_dto_1.EmployeeResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: '접근 권한 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '직원을 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 직원 ID',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "toggleEmployeeExclusion", null);
__decorate([
    (0, common_1.Get)('departments/:departmentId/active-employees'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '부서별 활성 직원 목록 조회',
        description: '특정 부서의 퇴사하지 않은 활성 직원 목록을 조회합니다.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '부서별 활성 직원 목록 조회 성공',
        schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/EmployeeResponseDto' },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: '접근 권한 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '부서를 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 부서 ID',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('departmentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getActiveEmployeesByDepartment", null);
exports.OrganizationController = OrganizationController = __decorate([
    (0, swagger_1.ApiTags)('organization'),
    (0, common_1.Controller)({ path: 'organization', version: '1' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [organization_business_1.OrganizationBusinessService])
], OrganizationController);
//# sourceMappingURL=organization.controller.js.map