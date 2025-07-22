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
var UserContextService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContextService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_domain_service_1 = require("../../domain/user/services/user-domain.service");
const user_response_dto_1 = require("../../interfaces/dto/organization/responses/user-response.dto");
const pagination_response_dto_1 = require("../../common/dtos/pagination/pagination-response.dto");
const class_transformer_1 = require("class-transformer");
const auth_payload_dto_1 = require("../../interfaces/dto/auth/responses/auth-payload.dto");
let UserContextService = UserContextService_1 = class UserContextService {
    constructor(userDomainService, jwtService) {
        this.userDomainService = userDomainService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(UserContextService_1.name);
    }
    async 사용자는_토큰을_검증받는다(token) {
        if (!token || token.trim().length === 0) {
            throw new common_1.UnauthorizedException('토큰이 제공되지 않았습니다.');
        }
        const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
        let payload;
        try {
            payload = this.jwtService.verify(cleanToken);
        }
        catch (error) {
            this.logger.warn(`토큰 검증 실패: ${error.message}`);
            throw new common_1.UnauthorizedException('유효하지 않은 토큰입니다.');
        }
        const user = await this.userDomainService.findUserById(payload.sub);
        if (!user) {
            this.logger.warn(`토큰의 사용자를 찾을 수 없음: ${payload.sub}`);
            throw new common_1.UnauthorizedException('사용자를 찾을 수 없습니다.');
        }
        if (!user.isActive) {
            this.logger.warn(`비활성화된 사용자의 토큰 사용: ${user.email}`);
            throw new common_1.UnauthorizedException('비활성화된 사용자입니다.');
        }
        this.logger.log(`토큰 검증 성공: ${user.email}`);
        return user;
    }
    async 사용자의_현재_세션_정보를_조회한다(userId) {
        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('사용자를 찾을 수 없습니다.');
        }
        const sessionValid = user.isActive;
        const roles = user.roles;
        this.logger.log(`세션 정보 조회 성공: ${user.email}`);
        return {
            user,
            sessionValid,
            roles,
        };
    }
    async 사용자의_권한을_확인한다(userId, requiredRoles) {
        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('사용자를 찾을 수 없습니다.');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('비활성화된 사용자입니다.');
        }
        const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role));
        if (!hasRequiredRole) {
            this.logger.warn(`권한 부족: ${user.email}, 필요한 역할: ${requiredRoles.join(', ')}`);
            return false;
        }
        this.logger.log(`권한 확인 성공: ${user.email}`);
        return true;
    }
    extractUserFromToken(token) {
        try {
            if (!token || token.trim().length === 0) {
                return null;
            }
            const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
            const payload = this.jwtService.verify(cleanToken);
            return new auth_payload_dto_1.AuthPayloadDto(payload.sub, payload.roles);
        }
        catch (error) {
            this.logger.warn(`토큰에서 사용자 정보 추출 실패: ${error.message}`);
            return null;
        }
    }
    isTokenExpired(token) {
        try {
            const payload = this.extractUserFromToken(token);
            if (!payload || !payload.exp) {
                return true;
            }
            return payload.isExpired();
        }
        catch (error) {
            this.logger.warn(`토큰 만료 확인 실패: ${error.message}`);
            return true;
        }
    }
    async validateUserPermission(requestUserId, targetUserId, requiredRoles) {
        const user = await this.userDomainService.findUserById(requestUserId);
        if (!user) {
            throw new common_1.ForbiddenException('사용자를 찾을 수 없습니다.');
        }
        if (targetUserId && requestUserId === targetUserId) {
            return true;
        }
        if (requiredRoles && requiredRoles.length > 0) {
            const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role));
            if (!hasRequiredRole) {
                throw new common_1.ForbiddenException('해당 작업을 수행할 권한이 없습니다.');
            }
        }
        return true;
    }
    async 자신의_프로필을_조회한다(userId) {
        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        this.logger.log(`프로필 조회 성공: ${user.email}`);
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user);
    }
    async 사용자의_프로필을_조회한다(userId) {
        return this.자신의_프로필을_조회한다(userId);
    }
    async 페이지네이션된_사용자_목록을_조회한다(paginationQuery) {
        const { page = 1, limit = 10 } = paginationQuery;
        const result = await this.userDomainService.findPaginatedUsers(page, limit);
        const userDtos = result.users.map((user) => (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user));
        const meta = new pagination_response_dto_1.PaginationMetaDto(page, limit, result.total);
        const paginatedResult = new pagination_response_dto_1.PaginatedResponseDto(userDtos, meta);
        this.logger.log(`사용자 목록 조회 성공: ${result.users.length}명 조회`);
        return paginatedResult;
    }
    async findUserById(userId) {
        return this.userDomainService.findUserById(userId);
    }
    async findUserByEmail(email) {
        return this.userDomainService.findUserByEmail(email);
    }
    async changeUserPassword(userId, currentPassword, newPassword) {
        return this.userDomainService.changeUserPassword(userId, currentPassword, newPassword);
    }
    async 사용자의_부서_권한을_변경한다(userId, department, type, action) {
        const user = await this.userDomainService.findUserById(userId);
        return this.userDomainService.updateUserAuthority(user, department, type, action);
    }
};
exports.UserContextService = UserContextService;
exports.UserContextService = UserContextService = UserContextService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_domain_service_1.UserDomainService, jwt_1.JwtService])
], UserContextService);
//# sourceMappingURL=user-context.service.js.map