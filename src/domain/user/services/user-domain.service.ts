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
     * 사용자 비밀번호 변경
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
     * 사용자 인증 검증
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
     * 사용자명으로 사용자 조회
     */
    async findUserByEmail(email: string): Promise<LamsUserEntity | null> {
        return await this.userRepository.findOne({
            where: { email },
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
}
