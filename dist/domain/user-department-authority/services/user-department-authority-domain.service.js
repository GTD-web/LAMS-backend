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
var UserDepartmentAuthorityDomainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDepartmentAuthorityDomainService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_department_authority_entity_1 = require("../entities/user-department-authority.entity");
const authority_type_enum_1 = require("../enum/authority-type.enum");
let UserDepartmentAuthorityDomainService = UserDepartmentAuthorityDomainService_1 = class UserDepartmentAuthorityDomainService {
    constructor(userDepartmentAuthorityRepository) {
        this.userDepartmentAuthorityRepository = userDepartmentAuthorityRepository;
        this.logger = new common_1.Logger(UserDepartmentAuthorityDomainService_1.name);
    }
    async grantAuthority(user, department, authorityType) {
        const existingAuthority = await this.userDepartmentAuthorityRepository.findOne({
            where: {
                userId: user.userId,
                departmentId: department.departmentId,
                authorityType,
            },
        });
        if (existingAuthority) {
            throw new common_1.BadRequestException('이미 권한이 있습니다.');
        }
        const newAuthority = this.userDepartmentAuthorityRepository.create({
            user: user,
            department: department,
            authorityType,
        });
        const savedAuthority = await this.userDepartmentAuthorityRepository.save(newAuthority);
        this.logger.debug(`권한 부여 완료: ID=${savedAuthority.authorityId}`);
        return true;
    }
    async removeAuthority(userId, departmentId, authorityType) {
        const result = await this.userDepartmentAuthorityRepository.delete({
            userId,
            departmentId,
            authorityType,
        });
        if (result.affected === 0) {
            this.logger.warn(`삭제할 권한이 없음: 사용자ID=${userId}, 부서ID=${departmentId}, 타입=${authorityType}`);
            throw new common_1.NotFoundException('권한을 찾을 수 없습니다.');
        }
        this.logger.debug(`권한 삭제 완료: 삭제된 레코드 수=${result.affected}`);
        return result.affected > 0;
    }
    async findAllUserDepartmentAuthorities(userId) {
        return await this.userDepartmentAuthorityRepository.find({
            where: { userId },
            relations: ['department', 'user', 'grantedBy'],
            order: { createdAt: 'DESC' },
        });
    }
    async findAllDepartmentAuthorities(departmentId) {
        return await this.userDepartmentAuthorityRepository.find({
            where: { departmentId },
            relations: ['department', 'user', 'grantedBy'],
            order: { createdAt: 'DESC' },
        });
    }
    async getUserAccessibleDepartment(userId) {
        const authorities = await this.userDepartmentAuthorityRepository.find({
            where: { userId, authorityType: authority_type_enum_1.AuthorityType.ACCESS },
            select: ['departmentId'],
        });
        const departments = authorities.map((auth) => auth.department);
        this.logger.debug(`접근 가능한 부서 수: ${departments.length}개`);
        return departments;
    }
    async getUserReviewableDepartment(userId) {
        const authorities = await this.userDepartmentAuthorityRepository.find({
            where: { userId, authorityType: authority_type_enum_1.AuthorityType.REVIEW },
            select: ['departmentId'],
        });
        const departments = authorities.map((auth) => auth.department);
        this.logger.debug(`검토 가능한 부서 수: ${departments.length}개`);
        return departments;
    }
    async hasUserDepartmentAuthority(userId, departmentId, authorityType) {
        this.logger.debug(`권한 확인: 사용자ID=${userId}, 부서ID=${departmentId}, 타입=${authorityType}`);
        const count = await this.userDepartmentAuthorityRepository.count({
            where: { userId, departmentId, authorityType },
        });
        const hasAuthority = count > 0;
        this.logger.debug(`권한 확인 결과: ${hasAuthority ? '권한 있음' : '권한 없음'}`);
        return hasAuthority;
    }
    async hasReviewableUserInDepartment(departmentId) {
        const count = await this.userDepartmentAuthorityRepository.count({
            where: { departmentId, authorityType: authority_type_enum_1.AuthorityType.REVIEW },
        });
        const hasReviewers = count > 0;
        this.logger.debug(`부서 검토 권한자 존재 여부: ${hasReviewers ? '있음' : '없음'} (${count}명)`);
        return hasReviewers;
    }
};
exports.UserDepartmentAuthorityDomainService = UserDepartmentAuthorityDomainService;
exports.UserDepartmentAuthorityDomainService = UserDepartmentAuthorityDomainService = UserDepartmentAuthorityDomainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_department_authority_entity_1.UserDepartmentAuthorityEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserDepartmentAuthorityDomainService);
//# sourceMappingURL=user-department-authority-domain.service.js.map