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
const error_response_dto_1 = require("../../common/dtos/common/error-response.dto");
const pagination_response_dto_1 = require("../../common/dtos/pagination/pagination-response.dto");
const authority_type_enum_1 = require("../../domain/user-department-authority/enum/authority-type.enum");
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
    async grantAccessAuthority(userId, departmentId) {
        const result = await this.userBusinessService.grantAuthority(userId, departmentId, authority_type_enum_1.AuthorityType.ACCESS);
        return {
            success: result,
            message: '접근 권한이 성공적으로 부여되었습니다.',
        };
    }
    async grantReviewAuthority(userId, departmentId) {
        const result = await this.userBusinessService.grantAuthority(userId, departmentId, authority_type_enum_1.AuthorityType.REVIEW);
        return {
            success: result,
            message: '검토 권한이 성공적으로 부여되었습니다.',
        };
    }
    async removeAccessAuthority(userId, departmentId) {
        const result = await this.userBusinessService.removeAuthority(userId, departmentId, authority_type_enum_1.AuthorityType.ACCESS);
        return {
            success: result,
            message: '접근 권한이 성공적으로 삭제되었습니다.',
        };
    }
    async removeReviewAuthority(userId, departmentId) {
        const result = await this.userBusinessService.removeAuthority(userId, departmentId, authority_type_enum_1.AuthorityType.REVIEW);
        return {
            success: result,
            message: '검토 권한이 성공적으로 삭제되었습니다.',
        };
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
    (0, common_1.Post)(':userId/departments/:departmentId/access-authority'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '부서 접근 권한 부여',
        description: '사용자에게 특정 부서의 접근 권한을 부여합니다.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        description: '사용자 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    }),
    (0, swagger_1.ApiParam)({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: '접근 권한 부여 성공',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '접근 권한이 성공적으로 부여되었습니다.' },
            },
        },
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
        description: '잘못된 요청 데이터 또는 이미 권한이 존재함',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '부서 또는 사용자를 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('departmentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "grantAccessAuthority", null);
__decorate([
    (0, common_1.Post)(':userId/departments/:departmentId/review-authority'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '부서 검토 권한 부여',
        description: '사용자에게 특정 부서의 검토 권한을 부여합니다.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        description: '사용자 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    }),
    (0, swagger_1.ApiParam)({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: '검토 권한 부여 성공',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '검토 권한이 성공적으로 부여되었습니다.' },
            },
        },
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
        description: '잘못된 요청 데이터 또는 이미 권한이 존재함',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: '부서 또는 사용자를 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('departmentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "grantReviewAuthority", null);
__decorate([
    (0, common_1.Delete)(':userId/departments/:departmentId/access-authority'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '부서 접근 권한 삭제',
        description: '사용자의 특정 부서 접근 권한을 삭제합니다.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        description: '사용자 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    }),
    (0, swagger_1.ApiParam)({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '접근 권한 삭제 성공',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '접근 권한이 성공적으로 삭제되었습니다.' },
            },
        },
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
        description: '부서, 사용자 또는 권한을 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('departmentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeAccessAuthority", null);
__decorate([
    (0, common_1.Delete)(':userId/departments/:departmentId/review-authority'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '부서 검토 권한 삭제',
        description: '사용자의 특정 부서 검토 권한을 삭제합니다.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        description: '사용자 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    }),
    (0, swagger_1.ApiParam)({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '검토 권한 삭제 성공',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '검토 권한이 성공적으로 삭제되었습니다.' },
            },
        },
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
        description: '부서, 사용자 또는 권한을 찾을 수 없음',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('departmentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeReviewAuthority", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('사용자 관리 (Users)'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [user_business_1.UserBusinessService])
], UsersController);
//# sourceMappingURL=users.controller.js.map