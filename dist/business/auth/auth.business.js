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
const auth_payload_dto_1 = require("../../interfaces/dto/auth/responses/auth-payload.dto");
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
        try {
            const user = await this.사용자는_아이디와_패스워드를_검증한다(loginId, password);
            if (!user) {
                throw new common_1.UnauthorizedException('잘못된 사용자명 또는 비밀번호입니다.');
            }
            await this.사용자의_활성화_상태를_검증한다(user.userId);
            const token = await this.사용자의_토큰을_제공한다(user.userId);
            this.logger.log(`로그인 성공: ${loginId} (사용자 ID: ${user.userId})`);
            return {
                token,
                user: (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user),
            };
        }
        catch (error) {
            this.logger.error(`로그인 실패: ${loginId}`, error.stack);
            throw error;
        }
    }
    async getProfile(token, userId) {
        await this.userContextService.사용자는_토큰을_검증받는다(token);
        return this.userContextService.자신의_프로필을_조회한다(userId);
    }
    async 사용자는_아이디와_패스워드를_검증한다(loginId, password) {
        try {
            if (!loginId || !password || loginId.trim().length === 0 || password.trim().length === 0) {
                throw new common_1.BadRequestException('유효하지 않은 로그인 정보입니다.');
            }
            const user = await this.userContextService.findUserByEmail(loginId);
            if (!user) {
                this.logger.warn(`존재하지 않는 사용자 로그인 시도: ${loginId}`);
                return null;
            }
            const isPasswordValid = user.validatePassword(password);
            if (!isPasswordValid) {
                this.logger.warn(`잘못된 패스워드 로그인 시도: ${loginId}`);
                return null;
            }
            this.logger.log(`사용자 인증 성공: ${loginId}`);
            return user;
        }
        catch (error) {
            this.logger.error(`사용자 인증 검증 실패: ${loginId}`, error.stack);
            throw error;
        }
    }
    async 사용자의_활성화_상태를_검증한다(userId) {
        const user = await this.userContextService.findUserById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('사용자를 찾을 수 없습니다.');
        }
        if (!user.isActive) {
            this.logger.warn(`비활성화된 사용자 로그인 시도: ${user.email}`);
            throw new common_1.UnauthorizedException('비활성화된 사용자입니다.');
        }
        this.logger.log(`사용자 활성화 상태 검증 성공: ${user.email}`);
        return true;
    }
    async 사용자의_토큰을_제공한다(userId) {
        const user = await this.userContextService.findUserById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('사용자를 찾을 수 없습니다.');
        }
        const payload = new auth_payload_dto_1.AuthPayloadDto(user.userId, user.roles);
        const token = this.jwtService.sign({
            sub: payload.sub,
            roles: payload.roles,
        });
        this.logger.log(`토큰 생성 성공: ${user.email}`);
        return token;
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
    async 사용자의_프로필을_조회한다(userId) {
        return this.userContextService.자신의_프로필을_조회한다(userId);
    }
    async 비밀번호를_변경한다(userId, currentPassword, newPassword) {
        const updatedUser = await this.userContextService.changeUserPassword(userId, currentPassword, newPassword);
        this.logger.log(`비밀번호 변경 성공: ${updatedUser.email}`);
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, updatedUser);
    }
    async validateUser(email, password) {
        const user = await this.사용자는_아이디와_패스워드를_검증한다(email, password);
        if (!user) {
            return null;
        }
        await this.사용자의_활성화_상태를_검증한다(user.userId);
        return new auth_payload_dto_1.AuthPayloadDto(user.userId, user.roles);
    }
};
exports.AuthBusinessService = AuthBusinessService;
exports.AuthBusinessService = AuthBusinessService = AuthBusinessService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_context_service_1.UserContextService, jwt_1.JwtService])
], AuthBusinessService);
//# sourceMappingURL=auth.business.js.map