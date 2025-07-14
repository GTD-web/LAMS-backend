import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm';
import { LamsUserEntity } from '../entities/lams-user.entity';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { UserRole } from '../enum/user.enum';

/**
 * 사용자 도메인 서비스
 * - 사용자 관련 핵심 비즈니스 로직을 처리
 * - 도메인 규칙과 불변성을 보장
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
     * 사용자 생성 (검증 로직 포함)
     */
    async createLamsUser(username: string, email: string, password: string): Promise<LamsUserEntity> {
        try {
            // 이메일 중복 확인
            const existingUser = await this.findUserByEmail(email);
            if (existingUser) {
                throw new ConflictException('이미 존재하는 이메일입니다.');
            }

            // 사용자명 중복 확인
            const existingUsername = await this.findUserByUsername(username);
            if (existingUsername) {
                throw new ConflictException('이미 존재하는 사용자명입니다.');
            }

            const user = this.userRepository.create({
                username,
                email,
                password,
                roles: [UserRole.SYSTEM_USER],
                isActive: true,
            });

            const savedUser = await this.userRepository.save(user);
            this.logger.log(`사용자 생성 완료: ${savedUser.email}`);
            return savedUser;
        } catch (error) {
            this.logger.error(`사용자 생성 실패: ${email}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자 업데이트 (검증 로직 포함)
     */
    async updateLamsUser(userId: string, updateData: Partial<LamsUserEntity>): Promise<LamsUserEntity> {
        try {
            const user = await this.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            // 이메일 중복 확인 (자신 제외)
            if (updateData.email && updateData.email !== user.email) {
                const existingUser = await this.findUserByEmail(updateData.email);
                if (existingUser && existingUser.userId !== userId) {
                    throw new ConflictException('이미 존재하는 이메일입니다.');
                }
            }

            // 사용자명 중복 확인 (자신 제외)
            if (updateData.username && updateData.username !== user.username) {
                const existingUsername = await this.findUserByUsername(updateData.username);
                if (existingUsername && existingUsername.userId !== userId) {
                    throw new ConflictException('이미 존재하는 사용자명입니다.');
                }
            }

            Object.assign(user, updateData);
            const updatedUser = await this.userRepository.save(user);
            this.logger.log(`사용자 정보 업데이트 완료: ${updatedUser.email}`);
            return updatedUser;
        } catch (error) {
            this.logger.error(`사용자 업데이트 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자 비밀번호 변경 (검증 로직 포함)
     */
    async changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<LamsUserEntity> {
        try {
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
        } catch (error) {
            this.logger.error(`비밀번호 변경 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자 삭제 (검증 로직 포함)
     */
    async deleteLamsUser(userId: string): Promise<boolean> {
        try {
            const user = await this.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            await this.userRepository.delete(userId);
            this.logger.log(`사용자 삭제 완료: ${userId}`);
            return true;
        } catch (error) {
            this.logger.error(`사용자 삭제 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자 역할 업데이트 (검증 로직 포함)
     */
    async updateUserRole(userId: string, roles: UserRole[]): Promise<LamsUserEntity> {
        try {
            const user = await this.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            const roleStrings = roles.map((role) => role.toString());
            user.roles = roleStrings;

            const updatedUser = await this.userRepository.save(user);
            this.logger.log(`사용자 역할 업데이트 완료: ${updatedUser.email}, 새 역할: ${roles.join(', ')}`);
            return updatedUser;
        } catch (error) {
            this.logger.error(`사용자 역할 업데이트 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자 인증 검증 (검증 로직 포함)
     */
    async validateUserCredentials(email: string, password: string): Promise<LamsUserEntity | null> {
        try {
            if (!email || !password || email.trim().length === 0 || password.trim().length === 0) {
                throw new BadRequestException('유효하지 않은 로그인 정보입니다.');
            }

            const user = await this.findUserByEmail(email);
            if (!user) {
                return null;
            }

            if (!user.isActive) {
                throw new BadRequestException('비활성화된 사용자입니다.');
            }

            const isPasswordValid = user.validatePassword(password);
            if (!isPasswordValid) {
                return null;
            }

            return user;
        } catch (error) {
            this.logger.error(`사용자 인증 검증 실패: ${email}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자 ID로 조회
     */
    async findUserById(userId: string): Promise<LamsUserEntity | null> {
        return await this.userRepository.findOne({
            where: { userId },
        });
    }

    /**
     * 이메일로 사용자 조회
     */
    async findUserByEmail(email: string): Promise<LamsUserEntity | null> {
        return await this.userRepository.findOne({
            where: { email },
        });
    }

    /**
     * 사용자명으로 사용자 조회
     */
    async findUserByUsername(username: string): Promise<LamsUserEntity | null> {
        return await this.userRepository.findOne({
            where: { username },
        });
    }

    /**
     * 전체 사용자 조회 (페이지네이션)
     */
    async findAllUsers(query: PaginationQueryDto): Promise<{ users: LamsUserEntity[]; total: number }> {
        const [users, total] = await this.userRepository.findAndCount({
            skip: (query.page - 1) * query.limit,
            take: query.limit,
            order: { createdAt: 'DESC' },
        });

        return { users, total };
    }

    /**
     * 역할별 사용자 조회
     */
    async findUsersByRole(role: string): Promise<LamsUserEntity[]> {
        return await this.userRepository.find({
            where: { roles: Like(`%${role}%`) },
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * 활성 사용자 조회
     */
    async findActiveUsers(): Promise<LamsUserEntity[]> {
        return await this.userRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * 비활성 사용자 조회
     */
    async findInactiveUsers(): Promise<LamsUserEntity[]> {
        return await this.userRepository.find({
            where: { isActive: false },
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * 사용자 존재 여부 확인
     */
    async existsUser(userId: string): Promise<boolean> {
        try {
            const count = await this.userRepository.count({
                where: { userId },
            });
            return count > 0;
        } catch (error) {
            this.logger.error(`사용자 존재 확인 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 이메일 중복 확인
     */
    async existsByEmail(email: string, excludeId?: string): Promise<boolean> {
        const whereCondition: any = { email };
        if (excludeId) {
            whereCondition.userId = Not(excludeId);
        }

        const count = await this.userRepository.count({ where: whereCondition });
        return count > 0;
    }

    /**
     * 사용자명 중복 확인
     */
    async existsByUsername(username: string, excludeId?: string): Promise<boolean> {
        const whereCondition: any = { username };
        if (excludeId) {
            whereCondition.userId = Not(excludeId);
        }

        const count = await this.userRepository.count({ where: whereCondition });
        return count > 0;
    }
}
