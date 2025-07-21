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
exports.DepartmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const organization_business_1 = require("../../business/organization/organization.business");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_enum_1 = require("../../domain/user/enum/user.enum");
const department_response_dto_1 = require("../dto/organization/responses/department-response.dto");
const pagination_query_dto_1 = require("../../common/dtos/pagination/pagination-query.dto");
const pagination_response_dto_1 = require("../../common/dtos/pagination/pagination-response.dto");
const error_response_dto_1 = require("../../common/dtos/common/error-response.dto");
let DepartmentsController = class DepartmentsController {
    constructor(organizationBusinessService) {
        this.organizationBusinessService = organizationBusinessService;
    }
    async getDepartments(paginationQuery) {
        return this.organizationBusinessService.getDepartmentList(paginationQuery);
    }
    async toggleDepartmentExclusion(departmentId) {
        return this.organizationBusinessService.toggleDepartmentExclusion(departmentId);
    }
};
exports.DepartmentsController = DepartmentsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '부서 목록 조회',
        description: '페이지네이션된 부서 목록을 조회합니다. 관리자만 접근 가능합니다.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: '페이지 번호 (기본값: 1)',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: '페이지당 항목 수 (기본값: 10)',
        example: 10,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '부서 목록이 성공적으로 조회되었습니다.',
        type: (pagination_response_dto_1.PaginatedResponseDto),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: '접근 권한 없음 - 관리자 권한 필요',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: '서버 내부 오류',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], DepartmentsController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Put)(':departmentId/toggle-exclude'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '부서 제외 여부 변경',
        description: '특정 부서의 제외 여부를 토글합니다. 관리자만 접근 가능합니다.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'departmentId',
        description: '부서 ID (UUID)',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '부서 제외 여부가 성공적으로 변경되었습니다.',
        type: department_response_dto_1.DepartmentResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: '접근 권한 없음 - 관리자 권한 필요',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '부서를 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: '서버 내부 오류',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('departmentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DepartmentsController.prototype, "toggleDepartmentExclusion", null);
exports.DepartmentsController = DepartmentsController = __decorate([
    (0, swagger_1.ApiTags)('부서 관리 (Departments)'),
    (0, common_1.Controller)('departments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [organization_business_1.OrganizationBusinessService])
], DepartmentsController);
//# sourceMappingURL=departments.controller.js.map