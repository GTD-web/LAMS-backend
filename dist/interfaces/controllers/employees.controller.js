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
exports.EmployeesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_enum_1 = require("../../domain/user/enum/user.enum");
const organization_business_1 = require("../../business/organization/organization.business");
let EmployeesController = class EmployeesController {
    constructor(organizationBusinessService) {
        this.organizationBusinessService = organizationBusinessService;
    }
    async toggleEmployeeExclusion(employeeId) {
        return await this.organizationBusinessService.toggleEmployeeExclusion(employeeId);
    }
};
exports.EmployeesController = EmployeesController;
__decorate([
    (0, common_1.Put)(':employeeId/toggle-exclusion'),
    (0, roles_decorator_1.Roles)(user_enum_1.UserRole.SYSTEM_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: '직원 제외 상태 토글',
        description: '직원의 계산 제외 여부를 토글합니다.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'employeeId',
        description: '직원 ID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '직원 제외 상태가 성공적으로 변경되었습니다.',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '직원 제외 여부가 성공적으로 변경되었습니다.' },
                data: { $ref: '#/components/schemas/EmployeeResponseDto' },
                timestamp: { type: 'string', format: 'date-time' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "toggleEmployeeExclusion", null);
exports.EmployeesController = EmployeesController = __decorate([
    (0, swagger_1.ApiTags)('employees'),
    (0, common_1.Controller)('employees'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [organization_business_1.OrganizationBusinessService])
], EmployeesController);
//# sourceMappingURL=employees.controller.js.map