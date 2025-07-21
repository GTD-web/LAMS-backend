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
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
let UserDomainService = UserDomainService_1 = class UserDomainService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(UserDomainService_1.name);
    }
    async changeUserPassword(userId, currentPassword, newPassword) {
        if (!userId || !currentPassword || !newPassword || currentPassword === newPassword) {
            throw new common_1.BadRequestException('유효하지 않은 비밀번호 변경 정보입니다.');
        }
        const user = await this.findUserById(userId);
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        if (!user.validatePassword(currentPassword)) {
            throw new common_1.BadRequestException('현재 비밀번호가 올바르지 않습니다.');
        }
        const hashedPassword = user.updateHashedPassword(newPassword);
        user.password = hashedPassword;
        const updatedUser = await this.userRepository.save(user);
        this.logger.log(`비밀번호 변경 완료: ${updatedUser.email}`);
        return updatedUser;
    }
    async validateUserCredentials(email, password) {
        if (!email || !password || email.trim().length === 0 || password.trim().length === 0) {
            throw new common_1.BadRequestException('유효하지 않은 로그인 정보입니다.');
        }
        const user = await this.userRepository.findOne({
            where: { email: email.toLowerCase().trim() },
        });
        if (!user || !user.validatePassword(password)) {
            this.logger.warn(`로그인 실패: ${email}`);
            return null;
        }
        this.logger.log(`로그인 성공: ${user.email}`);
        return user;
    }
    async findUserById(userId) {
        if (!userId || userId.trim().length === 0) {
            throw new common_1.BadRequestException('사용자 ID가 필요합니다.');
        }
        return await this.userRepository.findOne({
            where: { userId },
        });
    }
    async findUserByEmail(email) {
        if (!email || email.trim().length === 0) {
            throw new common_1.BadRequestException('이메일이 필요합니다.');
        }
        return await this.userRepository.findOne({
            where: { email: email.toLowerCase().trim() },
        });
    }
    async createUser(userData) {
        if (!userData.email || !userData.password) {
            throw new common_1.BadRequestException('이메일과 비밀번호가 필요합니다.');
        }
        const existingUser = await this.findUserByEmail(userData.email);
        if (existingUser) {
            throw new common_1.ConflictException('이미 존재하는 이메일입니다.');
        }
        const user = this.userRepository.create(userData);
        const savedUser = await this.userRepository.save(user);
        this.logger.log(`사용자 생성 완료: ${savedUser.email}`);
        return savedUser;
    }
    async updateUser(userId, updateData) {
        if (!userId || userId.trim().length === 0) {
            throw new common_1.BadRequestException('사용자 ID가 필요합니다.');
        }
        const user = await this.findUserById(userId);
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        Object.assign(user, updateData);
        const updatedUser = await this.userRepository.save(user);
        this.logger.log(`사용자 정보 수정 완료: ${updatedUser.email}`);
        return updatedUser;
    }
    async updateUserAuthority(user, department, type, action) {
        if (type === 'access') {
            if (action === 'add') {
                user.includeAccessableDepartment(department);
            }
            else {
                user.excludeAccessableDepartment(department);
            }
        }
        else {
            if (action === 'add') {
                user.includeReviewableDepartment(department);
            }
            else {
                user.excludeReviewableDepartment(department);
            }
        }
        const updatedUser = await this.userRepository.save(user);
        this.logger.log(`사용자 접근 권한 수정 완료: ${updatedUser.email}`);
        return updatedUser;
    }
    async deleteUser(userId) {
        if (!userId || userId.trim().length === 0) {
            throw new common_1.BadRequestException('사용자 ID가 필요합니다.');
        }
        const user = await this.findUserById(userId);
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        await this.userRepository.remove(user);
        this.logger.log(`사용자 삭제 완료: ${user.email}`);
    }
    async findPaginatedUsers(page, limit) {
        const skip = (page - 1) * limit;
        const [users, total] = await this.userRepository.findAndCount({
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        this.logger.log(`페이지네이션된 사용자 목록 조회: ${users.length}명 조회`);
        return { users, total };
    }
    async searchUsers(searchCriteria) {
        const { userId, email, name, loginId, keyword, limit = 10, offset = 0 } = searchCriteria;
        const whereConditions = [];
        if (keyword) {
            whereConditions.push({
                username: (0, typeorm_2.ILike)(`%${keyword}%`),
            });
            whereConditions.push({
                email: (0, typeorm_2.ILike)(`%${keyword}%`),
            });
        }
        else {
            const individualConditions = {};
            if (userId) {
                individualConditions.userId = userId;
            }
            if (email) {
                individualConditions.email = (0, typeorm_2.ILike)(`%${email}%`);
            }
            if (name) {
                individualConditions.username = (0, typeorm_2.ILike)(`%${name}%`);
            }
            if (loginId) {
                individualConditions.username = (0, typeorm_2.ILike)(`%${loginId}%`);
            }
            if (Object.keys(individualConditions).length > 0) {
                whereConditions.push(individualConditions);
            }
        }
        const findOptions = {
            where: whereConditions.length > 0 ? whereConditions : undefined,
            order: { createdAt: 'DESC' },
            skip: offset,
            take: limit,
        };
        const [users, total] = await this.userRepository.findAndCount(findOptions);
        this.logger.log(`사용자 검색 완료: ${users.length}명 조회 (총 ${total}명)`);
        return { users, total };
    }
    async searchUserById(userId) {
        if (!userId || userId.trim().length === 0) {
            throw new common_1.BadRequestException('사용자 ID가 필요합니다.');
        }
        const user = await this.userRepository.findOne({
            where: { userId },
        });
        this.logger.log(`사용자 ID 검색 완료: ${user ? '발견' : '없음'}`);
        return user;
    }
    async searchUsersByEmail(email) {
        if (!email || email.trim().length === 0) {
            throw new common_1.BadRequestException('이메일이 필요합니다.');
        }
        const users = await this.userRepository.find({
            where: { email: (0, typeorm_2.ILike)(`%${email}%`) },
            order: { createdAt: 'DESC' },
        });
        this.logger.log(`이메일 검색 완료: ${users.length}명 조회`);
        return users;
    }
    async searchUsersByName(name) {
        if (!name || name.trim().length === 0) {
            throw new common_1.BadRequestException('이름이 필요합니다.');
        }
        const users = await this.userRepository.find({
            where: { username: (0, typeorm_2.ILike)(`%${name}%`) },
            order: { createdAt: 'DESC' },
        });
        this.logger.log(`이름 검색 완료: ${users.length}명 조회`);
        return users;
    }
};
exports.UserDomainService = UserDomainService;
exports.UserDomainService = UserDomainService = UserDomainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserDomainService);
//# sourceMappingURL=user-domain.service.js.map