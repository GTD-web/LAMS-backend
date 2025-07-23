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
exports.UserBusinessService = void 0;
const user_context_service_1 = require("../../contexts/user/user-context.service");
const common_1 = require("@nestjs/common");
const user_department_authority_context_1 = require("../../contexts/user-department-authority/user-department-authority-context");
let UserBusinessService = class UserBusinessService {
    constructor(userContextService, userDepartmentAuthorityContext) {
        this.userContextService = userContextService;
        this.userDepartmentAuthorityContext = userDepartmentAuthorityContext;
    }
    async getUserList(paginationQuery) {
        return await this.userContextService.페이지네이션된_사용자_목록을_조회한다(paginationQuery);
    }
    async getUserProfile(userId) {
        if (!userId || userId.trim().length === 0) {
            throw new Error('사용자 ID가 필요합니다.');
        }
        return await this.userContextService.자신의_프로필을_조회한다(userId);
    }
    async grantAuthority(userId, departmentId, authorityType) {
        return await this.userDepartmentAuthorityContext.사용자의_부서_권한을_추가한다(userId, departmentId, authorityType);
    }
    async removeAuthority(userId, departmentId, authorityType) {
        return await this.userDepartmentAuthorityContext.사용자의_부서_권한을_삭제한다(userId, departmentId, authorityType);
    }
};
exports.UserBusinessService = UserBusinessService;
exports.UserBusinessService = UserBusinessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_context_service_1.UserContextService,
        user_department_authority_context_1.UserDepartmentAuthorityContext])
], UserBusinessService);
//# sourceMappingURL=user.business.js.map