import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { LamsUserEntity } from '../entities/lams-user.entity';

/**
 * 사용자 도메인 서비스
 * - 사용자 관련 핵심 비즈니스 로직을 처리
 * - 도메인 규칙의 불변성을 보장
 * - 검증 로직 및 데이터 접근 통합 처리
 */
@Injectable()
export class UserDomainService {
    private readonly logger = new Logger(UserDomainService.name);

    constructor(
        @InjectRepository(LamsUserEntity)
        private readonly userRepository: Repository<LamsUserEntity>,
    ) {}

    /**
     * 사용자 비밀번호 변경
     */
    async changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<LamsUserEntity> {
        if (!userId || !currentPassword || !newPassword || currentPassword === newPassword) {
            throw new BadRequestException('유효하지 않은 비밀번호 변경 정보입니다.');
        }

        const user = await this.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 현재 비밀번호 확인
        if (!user.validatePassword(currentPassword)) {
            throw new BadRequestException('현재 비밀번호가 올바르지 않습니다.');
        }

        const hashedPassword = user.updateHashedPassword(newPassword);
        user.password = hashedPassword;

        const updatedUser = await this.userRepository.save(user);
        this.logger.log(`비밀번호 변경 완료: ${updatedUser.email}`);
        return updatedUser;
    }

    /**
     * 사용자 인증 검증
     */
    async validateUserCredentials(email: string, password: string): Promise<LamsUserEntity | null> {
        if (!email || !password || email.trim().length === 0 || password.trim().length === 0) {
            throw new BadRequestException('유효하지 않은 로그인 정보입니다.');
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

    /**
     * 사용자 ID로 조회
     */
    async findUserById(userId: string): Promise<LamsUserEntity | null> {
        if (!userId || userId.trim().length === 0) {
            throw new BadRequestException('사용자 ID가 필요합니다.');
        }

        return await this.userRepository.findOne({
            where: { userId },
        });
    }

    /**
     * 이메일로 사용자 조회
     */
    async findUserByEmail(email: string): Promise<LamsUserEntity | null> {
        if (!email || email.trim().length === 0) {
            throw new BadRequestException('이메일이 필요합니다.');
        }

        return await this.userRepository.findOne({
            where: { email: email.toLowerCase().trim() },
        });
    }

    /**
     * 사용자 생성
     */
    async createUser(userData: Partial<LamsUserEntity>): Promise<LamsUserEntity> {
        if (!userData.email || !userData.password) {
            throw new BadRequestException('이메일과 비밀번호가 필요합니다.');
        }

        const existingUser = await this.findUserByEmail(userData.email);
        if (existingUser) {
            throw new ConflictException('이미 존재하는 이메일입니다.');
        }

        const user = this.userRepository.create(userData);
        const savedUser = await this.userRepository.save(user);

        this.logger.log(`사용자 생성 완료: ${savedUser.email}`);
        return savedUser;
    }

    /**
     * 사용자 정보 수정
     */
    async updateUser(userId: string, updateData: Partial<LamsUserEntity>): Promise<LamsUserEntity> {
        if (!userId || userId.trim().length === 0) {
            throw new BadRequestException('사용자 ID가 필요합니다.');
        }

        const user = await this.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        Object.assign(user, updateData);
        const updatedUser = await this.userRepository.save(user);

        this.logger.log(`사용자 정보 수정 완료: ${updatedUser.email}`);
        return updatedUser;
    }

    /**
     * 사용자 삭제
     */
    async deleteUser(userId: string): Promise<void> {
        if (!userId || userId.trim().length === 0) {
            throw new BadRequestException('사용자 ID가 필요합니다.');
        }

        const user = await this.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        await this.userRepository.remove(user);
        this.logger.log(`사용자 삭제 완료: ${user.email}`);
    }

    /**
     * 페이지네이션된 사용자 목록 조회
     */
    async findPaginatedUsers(page: number, limit: number): Promise<{ users: LamsUserEntity[]; total: number }> {
        const skip = (page - 1) * limit;

        const [users, total] = await this.userRepository.findAndCount({
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        this.logger.log(`페이지네이션된 사용자 목록 조회: ${users.length}명 조회`);
        return { users, total };
    }

    /**
     * 사용자 검색
     */
    async searchUsers(searchCriteria: {
        userId?: string;
        email?: string;
        name?: string;
        loginId?: string;
        keyword?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ users: LamsUserEntity[]; total: number }> {
        const { userId, email, name, loginId, keyword, limit = 10, offset = 0 } = searchCriteria;

        const queryBuilder = this.userRepository.createQueryBuilder('user');

        // 특정 필드 검색
        if (userId) {
            queryBuilder.andWhere('user.userId = :userId', { userId });
        }

        if (email) {
            queryBuilder.andWhere('LOWER(user.email) LIKE LOWER(:email)', { email: `%${email}%` });
        }

        if (name) {
            queryBuilder.andWhere('user.name LIKE :name', { name: `%${name}%` });
        }

        if (loginId) {
            queryBuilder.andWhere('user.loginId LIKE :loginId', { loginId: `%${loginId}%` });
        }

        // 키워드 통합 검색
        if (keyword) {
            queryBuilder.andWhere(
                '(user.name LIKE :keyword OR LOWER(user.email) LIKE LOWER(:keyword) OR user.loginId LIKE :keyword)',
                { keyword: `%${keyword}%` },
            );
        }

        // 총 개수 조회
        const total = await queryBuilder.getCount();

        // 페이지네이션 적용
        const users = await queryBuilder.skip(offset).take(limit).orderBy('user.createdAt', 'DESC').getMany();

        this.logger.log(`사용자 검색 완료: ${users.length}명 조회 (총 ${total}명)`);
        return { users, total };
    }

    /**
     * 사용자 ID로 단일 검색
     */
    async searchUserById(userId: string): Promise<LamsUserEntity | null> {
        if (!userId || userId.trim().length === 0) {
            throw new BadRequestException('사용자 ID가 필요합니다.');
        }

        const user = await this.userRepository.findOne({
            where: { userId },
        });

        if (user) {
            this.logger.log(`사용자 ID 검색 성공: ${user.email}`);
        } else {
            this.logger.log(`사용자 ID 검색 결과 없음: ${userId}`);
        }

        return user;
    }

    /**
     * 이메일로 사용자 검색
     */
    async searchUsersByEmail(email: string): Promise<LamsUserEntity[]> {
        if (!email || email.trim().length === 0) {
            throw new BadRequestException('이메일이 필요합니다.');
        }

        const users = await this.userRepository.find({
            where: { email: email.toLowerCase().trim() },
        });

        this.logger.log(`이메일 검색 완료: ${users.length}명 조회`);
        return users;
    }

    /**
     * 이름으로 사용자 검색
     */
    async searchUsersByName(name: string): Promise<LamsUserEntity[]> {
        if (!name || name.trim().length === 0) {
            throw new BadRequestException('이름이 필요합니다.');
        }

        const users = await this.userRepository
            .createQueryBuilder('user')
            .where('user.name LIKE :name', { name: `%${name}%` })
            .orderBy('user.createdAt', 'DESC')
            .getMany();

        this.logger.log(`이름 검색 완료: ${users.length}명 조회`);
        return users;
    }
}
