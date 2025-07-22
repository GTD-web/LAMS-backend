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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_business_1 = require("../../business/user/user.business");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_enum_1 = require("../../domain/user/enum/user.enum");
const pagination_query_dto_1 = require("../../common/dtos/pagination/pagination-query.dto");
const user_response_dto_1 = require("../dto/organization/responses/user-response.dto");
const manage_department_authority_dto_1 = require("../dto/organization/requests/manage-department-authority.dto");
const error_response_dto_1 = require("../../common/dtos/common/error-response.dto");
const user_entity_1 = require("../../domain/user/entities/user.entity");
const pagination_response_dto_1 = require("../../common/dtos/pagination/pagination-response.dto");
let UsersController = class UsersController {
    constructor(userBusinessService) {
        this.userBusinessService = userBusinessService;
    }
    async getUserList(paginationQuery) {
        return this.userBusinessService.getUserList(paginationQuery);
    }
    async getUserById(id) {
        return this.userBusinessService.getUserProfile(id);
    }
    async manageDepartmentAuthority(departmentId, type, action, dto) {
        return this.userBusinessService.manageDepartmentAuthority(departmentId, dto.userId, type, action);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '사용자 목록 조회',
        description: '페이지네이션된 사용자 목록을 조회합니다.',
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
        description: '사용자 목록 조회 성공',
        type: pagination_response_dto_1.PaginatedResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: '접근 권한 없음 - 관리자 권한 필요',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserList", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '사용자 상세 조회',
        description: '사용자 ID로 특정 사용자의 상세 정보를 조회합니다.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: '사용자 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '사용자 상세 조회 성공',
        type: user_response_dto_1.UserResponseDto,
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
        description: '사용자를 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Post)('departments/:departmentId/authorities/:type/:action'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '부서 권한 관리',
        description: '사용자의 부서 권한을 추가하거나 삭제합니다.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    }),
    (0, swagger_1.ApiParam)({
        name: 'type',
        description: '권한 타입',
        enum: ['access', 'review'],
        example: 'access',
    }),
    (0, swagger_1.ApiParam)({
        name: 'action',
        description: '작업 타입',
        enum: ['add', 'delete'],
        example: 'add',
    }),
    (0, swagger_1.ApiBody)({
        type: manage_department_authority_dto_1.ManageDepartmentAuthorityDto,
        description: '권한 관리 데이터',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: '부서 권한 관리 성공',
        type: user_entity_1.UserEntity,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: '접근 권한 없음 - 관리자 권한 필요',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 요청 데이터',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '부서 또는 사용자를 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('departmentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Param)('action')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, manage_department_authority_dto_1.ManageDepartmentAuthorityDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "manageDepartmentAuthority", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('사용자 관리 (Users)'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [user_business_1.UserBusinessService])
], UsersController);
//# sourceMappingURL=users.controller.js.map