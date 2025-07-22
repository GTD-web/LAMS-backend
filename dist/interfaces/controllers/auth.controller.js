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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_business_1 = require("../../business/auth/auth.business");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const get_user_decorator_1 = require("../../common/decorators/get-user.decorator");
const login_response_dto_1 = require("../dto/auth/responses/login-response.dto");
const login_dto_1 = require("../dto/auth/request/login.dto");
const change_password_dto_1 = require("../dto/auth/request/change-password.dto");
const user_response_dto_1 = require("../dto/organization/responses/user-response.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const error_response_dto_1 = require("../../common/dtos/common/error-response.dto");
const user_entity_1 = require("../../domain/user/entities/user.entity");
let AuthController = class AuthController {
    constructor(authBusinessService) {
        this.authBusinessService = authBusinessService;
    }
    async login(loginDto) {
        return this.authBusinessService.login(loginDto.email, loginDto.password);
    }
    async verifyToken(token) {
        return {
            valid: this.authBusinessService.verifyToken(token),
        };
    }
    async changePassword(user, changePasswordDto) {
        return this.authBusinessService.changeUserPassword(user.userId, changePasswordDto.currentPassword, changePasswordDto.newPassword);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: '사용자 로그인',
        description: '사용자 아이디(이메일)와 패스워드를 검증하여 JWT 토큰을 발급합니다.',
    }),
    (0, swagger_1.ApiBody)({
        type: login_dto_1.LoginDto,
        description: '로그인 정보',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: '로그인 성공',
        type: login_response_dto_1.LoginResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 요청 데이터',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패 - 잘못된 사용자명 또는 비밀번호',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: '서버 내부 오류',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('verify'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: '토큰 검증',
        description: '현재 사용자의 JWT 토큰이 유효한지 검증합니다.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '토큰 검증 성공',
        schema: {
            type: 'object',
            properties: {
                valid: { type: 'boolean', example: true },
                user: { $ref: '#/components/schemas/UserResponseDto' },
                sessionInfo: {
                    type: 'object',
                    properties: {
                        sessionValid: { type: 'boolean', example: true },
                        roles: { type: 'array', items: { type: 'string' }, example: ['SYSTEM_ADMIN'] },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '토큰 검증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyToken", null);
__decorate([
    (0, common_1.Put)('change-password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: '비밀번호 변경',
        description: '현재 사용자의 비밀번호를 변경합니다.',
    }),
    (0, swagger_1.ApiBody)({
        type: change_password_dto_1.ChangePasswordDto,
        description: '비밀번호 변경 정보',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: '비밀번호 변경 성공',
        type: user_response_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: '잘못된 요청 데이터 또는 현재 비밀번호 불일치',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: '인증 실패',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: '서버 내부 오류',
        type: error_response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity,
        change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('admin/auth'),
    (0, swagger_1.ApiTags)('인증 (Authentication)'),
    __metadata("design:paramtypes", [auth_business_1.AuthBusinessService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map