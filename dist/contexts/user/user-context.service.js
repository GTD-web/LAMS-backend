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
exports.UserContextService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_domain_service_1 = require("../../domain/user/services/user-domain.service");
const user_response_dto_1 = require("../../interfaces/dto/organization/responses/user-response.dto");
const class_transformer_1 = require("class-transformer");
let UserContextService = class UserContextService {
    constructor(userDomainService, jwtService) {
        this.userDomainService = userDomainService;
        this.jwtService = jwtService;
    }
    async 아이디와_패스워드를_검증하고_활성화_상태를_검증한다(loginId, password) {
        const user = await this.userDomainService.validateUserCredentials(loginId, password);
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('비활성화된 사용자입니다.');
        }
        return user;
    }
    async 사용자의_토큰을_제공한다(user) {
        return this.jwtService.sign({ sub: user.userId, roles: user.roles });
    }
    async 자신의_프로필을_조회한다(userId) {
        const user = await this.userDomainService.getUserById(userId);
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user);
    }
    async 페이지네이션된_사용자_목록을_조회한다(paginationQuery) {
        return await this.userDomainService.findPaginatedUsers(paginationQuery);
    }
    async 사용자_비밀번호를_변경한다(userId, currentPassword, newPassword) {
        return this.userDomainService.changeUserPassword(userId, currentPassword, newPassword);
    }
    async 사용자의_부서_권한을_변경한다(userId, department, type, action) {
        const user = await this.userDomainService.findUserById(userId);
        return this.userDomainService.updateUserAuthority(user, department, type, action);
    }
    async 사용자의_부서_권한을_조회한다(userId) {
        const user = await this.userDomainService.findUserById(userId);
        return user;
    }
    async findUserById(userId) {
        return await this.userDomainService.findUserById(userId);
    }
};
exports.UserContextService = UserContextService;
exports.UserContextService = UserContextService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_domain_service_1.UserDomainService, jwt_1.JwtService])
], UserContextService);
//# sourceMappingURL=user-context.service.js.map