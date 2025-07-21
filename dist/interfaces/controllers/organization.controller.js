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
exports.OrganizationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const organization_business_1 = require("../../business/organization/organization.business");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_enum_1 = require("../../domain/user/enum/user.enum");
const error_response_dto_1 = require("../../common/dtos/common/error-response.dto");
let OrganizationController = class OrganizationController {
    constructor(organizationBusinessService) {
        this.organizationBusinessService = organizationBusinessService;
    }
    async syncOrganization() {
        return this.organizationBusinessService.syncOrganization();
    }
};
exports.OrganizationController = OrganizationController;
__decorate([
    (0, common_1.Post)('sync'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN, user_enum_1.UserRole.ATTENDANCE_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '조직 동기화',
        description: 'MMS 시스템과 조직 데이터를 동기화합니다. 부서와 직원 정보를 업데이트합니다.',
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "syncOrganization", null);
exports.OrganizationController = OrganizationController = __decorate([
    (0, swagger_1.ApiTags)('조직 관리 (Organization)'),
    (0, common_1.Controller)('organization'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [organization_business_1.OrganizationBusinessService])
], OrganizationController);
//# sourceMappingURL=organization.controller.js.map