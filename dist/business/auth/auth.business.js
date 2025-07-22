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
var AuthBusinessService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthBusinessService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const class_transformer_1 = require("class-transformer");
const user_response_dto_1 = require("../../interfaces/dto/organization/responses/user-response.dto");
const user_context_service_1 = require("../../contexts/user/user-context.service");
let AuthBusinessService = AuthBusinessService_1 = class AuthBusinessService {
    constructor(userContextService, jwtService) {
        this.userContextService = userContextService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthBusinessService_1.name);
    }
    async login(loginId, password) {
        const user = await this.userContextService.아이디와_패스워드를_검증하고_활성화_상태를_검증한다(loginId, password);
        const token = await this.userContextService.사용자의_토큰을_제공한다(user);
        return {
            token,
            user: (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user),
        };
    }
    async getProfile(token, userId) {
        return this.userContextService.자신의_프로필을_조회한다(userId);
    }
    verifyToken(token) {
        try {
            if (!token || token.trim().length === 0) {
                return false;
            }
            const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
            const decoded = this.jwtService.verify(cleanToken);
            return !!decoded;
        }
        catch (error) {
            this.logger.warn(`토큰 검증 실패: ${token}`, error.message);
            return false;
        }
    }
    async changeUserPassword(userId, currentPassword, newPassword) {
        const updatedUser = await this.userContextService.사용자_비밀번호를_변경한다(userId, currentPassword, newPassword);
        this.logger.log(`비밀번호 변경 성공: ${updatedUser.email}`);
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, updatedUser);
    }
};
exports.AuthBusinessService = AuthBusinessService;
exports.AuthBusinessService = AuthBusinessService = AuthBusinessService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_context_service_1.UserContextService, jwt_1.JwtService])
], AuthBusinessService);
//# sourceMappingURL=auth.business.js.map