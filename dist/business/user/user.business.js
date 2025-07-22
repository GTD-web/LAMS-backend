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
var UserBusinessService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBusinessService = void 0;
const common_1 = require("@nestjs/common");
const user_context_service_1 = require("../../contexts/user/user-context.service");
const organization_context_service_1 = require("../../contexts/organization/organization-context.service");
let UserBusinessService = UserBusinessService_1 = class UserBusinessService {
    constructor(userContextService, organizationContextService) {
        this.userContextService = userContextService;
        this.organizationContextService = organizationContextService;
        this.logger = new common_1.Logger(UserBusinessService_1.name);
    }
    async getUserList(paginationQuery) {
        if (!paginationQuery.page || !paginationQuery.limit) {
            throw new Error('페이지 정보가 필요합니다.');
        }
        return await this.userContextService.페이지네이션된_사용자_목록을_조회한다(paginationQuery);
    }
    async getUserProfile(userId) {
        if (!userId || userId.trim().length === 0) {
            throw new Error('사용자 ID가 필요합니다.');
        }
        return await this.userContextService.자신의_프로필을_조회한다(userId);
    }
    async manageDepartmentAuthority(departmentId, userId, type, action) {
        try {
            if (!departmentId || !userId) {
                throw new Error('부서 ID와 사용자 ID가 필요합니다.');
            }
            const department = await this.organizationContextService.findDepartmentById(departmentId);
            return await this.userContextService.사용자의_부서_권한을_변경한다(userId, department, type, action);
        }
        catch (error) {
            this.logger.error(`부서 권한 관리 실패: ${departmentId}, ${userId}, ${type}, ${action}`, error.stack);
            throw new Error('부서 권한 관리 중 오류가 발생했습니다.');
        }
    }
};
exports.UserBusinessService = UserBusinessService;
exports.UserBusinessService = UserBusinessService = UserBusinessService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_context_service_1.UserContextService,
        organization_context_service_1.OrganizationContextService])
], UserBusinessService);
//# sourceMappingURL=user.business.js.map