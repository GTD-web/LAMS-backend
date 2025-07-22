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
var UserDomainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDomainService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const pagination_response_dto_1 = require("../../../common/dtos/pagination/pagination-response.dto");
const user_response_dto_1 = require("../../../interfaces/dto/organization/responses/user-response.dto");
const class_transformer_1 = require("class-transformer");
let UserDomainService = UserDomainService_1 = class UserDomainService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(UserDomainService_1.name);
    }
    async changeUserPassword(userId, currentPassword, newPassword) {
        const user = await this.userRepository.findOne({
            where: { userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('ID에 해당하는 사용자를 찾을 수 없습니다.');
        }
        if (!this.validatePassword(user, currentPassword)) {
            throw new common_1.BadRequestException('현재 비밀번호가 올바르지 않습니다.');
        }
        const hashedPassword = this.updateHashedPassword(newPassword);
        user.password = hashedPassword;
        const updatedUser = await this.userRepository.save(user);
        this.logger.log(`비밀번호 변경 완료: ${updatedUser.email}`);
        return updatedUser;
    }
    async validateUserCredentials(email, password) {
        const user = await this.userRepository.findOne({
            where: { email: email.toLowerCase().trim() },
        });
        if (!user) {
            throw new common_1.NotFoundException('이메일에 해당하는 사용자를 찾을 수 없습니다.');
        }
        if (!this.validatePassword(user, password)) {
            throw new common_1.UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }
        this.logger.log(`로그인 성공: ${user.email}`);
        return user;
    }
    async findUserById(userId) {
        return await this.userRepository.findOne({
            where: { userId },
        });
    }
    async getUserById(userId) {
        const user = await this.userRepository.findOne({
            where: { userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('ID에 해당하는 사용자를 찾을 수 없습니다.');
        }
        return user;
    }
    async findUserAuthority(userId) {
        const user = await this.userRepository.findOne({
            where: { userId },
            relations: ['accessableDepartments', 'reviewableDepartments'],
        });
        return user;
    }
    async createUser(userData) {
        const existingUser = await this.userRepository.findOne({
            where: { email: userData.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('이미 존재하는 이메일입니다.');
        }
        const user = this.userRepository.create(userData);
        const savedUser = await this.userRepository.save(user);
        this.logger.log(`사용자 생성 완료: ${savedUser.email}`);
        return savedUser;
    }
    async updateUserAuthority(user, department, type, action) {
        if (type === 'access') {
            if (action === 'add') {
                this.includeAccessableDepartment(user, department);
            }
            else {
                this.excludeAccessableDepartment(user, department);
            }
        }
        else {
            if (action === 'add') {
                this.includeReviewableDepartment(user, department);
            }
            else {
                this.excludeReviewableDepartment(user, department);
            }
        }
        const updatedUser = await this.userRepository.save(user);
        this.logger.log(`사용자 접근 권한 수정 완료: ${updatedUser.email}`);
        return updatedUser;
    }
    async findPaginatedUsers(paginationQuery) {
        const { page, limit } = paginationQuery;
        const skip = (page - 1) * limit;
        const [users, total] = await this.userRepository.findAndCount({
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        const meta = new pagination_response_dto_1.PaginationMetaDto(page, limit, total);
        const userDtos = users.map((user) => (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user));
        const paginatedResult = new pagination_response_dto_1.PaginatedResponseDto(userDtos, meta);
        return paginatedResult;
    }
    includeAccessableDepartment(user, department) {
        if (!user.accessableDepartments) {
            user.accessableDepartments = [];
        }
        const isAccessableDepartment = user.accessableDepartments.some((dept) => dept.departmentId === department.departmentId);
        if (isAccessableDepartment) {
            throw new common_1.ConflictException('이미 존재하는 접근 가능 부서입니다.');
        }
        user.accessableDepartments.push(department);
        return user;
    }
    includeReviewableDepartment(user, department) {
        if (!user.reviewableDepartments) {
            user.reviewableDepartments = [];
        }
        const isReviewableDepartment = user.reviewableDepartments.some((dept) => dept.departmentId === department.departmentId);
        if (isReviewableDepartment) {
            throw new common_1.ConflictException('이미 존재하는 리뷰 가능 부서입니다.');
        }
        user.reviewableDepartments.push(department);
        return user;
    }
    excludeAccessableDepartment(user, department) {
        user.accessableDepartments = user.accessableDepartments.filter((dept) => dept.departmentId !== department.departmentId);
    }
    excludeReviewableDepartment(user, department) {
        user.reviewableDepartments = user.reviewableDepartments.filter((dept) => dept.departmentId !== department.departmentId);
    }
    validatePassword(user, password) {
        return bcrypt.compareSync(password, user.password);
    }
    updateHashedPassword(password) {
        return bcrypt.hashSync(password, 10);
    }
};
exports.UserDomainService = UserDomainService;
exports.UserDomainService = UserDomainService = UserDomainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserDomainService);
//# sourceMappingURL=user-domain.service.js.map