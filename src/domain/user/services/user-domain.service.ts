import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { LamsUserEntity } from '../entities/lams-user.entity';

/**
 * ?�용???�메???�비??
 * - ?�용??관???�심 비즈?�스 로직??처리
 * - ?�메??규칙�?불�??�을 보장
 * - 검�?로직 �??�이???�근 ?�합 처리
 */
@Injectable()
export class UserDomainService {
    private readonly logger = new Logger(UserDomainService.name);

    constructor(
        @InjectRepository(LamsUserEntity)
        private readonly userRepository: Repository<LamsUserEntity>,
    ) {}

    /**
     * ?�용??비�?번호 변�?
     */
    async changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<LamsUserEntity> {
        try {
            if (!userId || !currentPassword || !newPassword || currentPassword === newPassword) {
                throw new BadRequestException('?�효?��? ?��? 비�?번호 변�??�보?�니??');
            }

            const user = await this.findUserById(userId);
            if (!user) {
                throw new NotFoundException('?�용?��? 찾을 ???�습?�다.');
            }

            // ?�재 비�?번호 ?�인
            if (!user.validatePassword(currentPassword)) {
                throw new BadRequestException('?�재 비�?번호가 ?�바르�? ?�습?�다.');
            }

            const hashedPassword = user.updateHashedPassword(newPassword);
            user.password = hashedPassword;

            const updatedUser = await this.userRepository.save(user);
            this.logger.log(`비�?번호 변�??�료: ${updatedUser.email}`);
            return updatedUser;
        } catch (error) {
            this.logger.error(`비�?번호 변�??�패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * ?�용???�증 검�?
     */
    async validateUserCredentials(email: string, password: string): Promise<LamsUserEntity | null> {
        try {
            if (!email || !password || email.trim().length === 0 || password.trim().length === 0) {
                throw new BadRequestException('?�효?��? ?��? 로그???�보?�니??');
            }

            const user = await this.findUserByEmail(email);
            if (!user) {
                return null;
            }

            if (!user.isActive) {
                throw new BadRequestException('비활?�화???�용?�입?�다.');
            }

            const isPasswordValid = user.validatePassword(password);
            if (!isPasswordValid) {
                return null;
            }

            return user;
        } catch (error) {
            this.logger.error(`?�용???�증 검�??�패: ${email}`, error.stack);
            throw error;
        }
    }

    /**
     * ?�용??ID�?조회
     */
    async findUserById(userId: string): Promise<LamsUserEntity | null> {
        return await this.userRepository.findOne({
            where: { userId },
        });
    }

    /**
     * ?�용?�명?�로 ?�용??조회
     */
    async findUserByEmail(email: string): Promise<LamsUserEntity | null> {
        return await this.userRepository.findOne({
            where: { email },
        });
    }

    /**
     * ?�체 ?�용??조회
     */
    async findAllUsers(): Promise<LamsUserEntity[]> {
        return await this.userRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * ?�체 ?�용??조회(?�이지?�이??
     */
    async findAndCount(options: FindManyOptions<LamsUserEntity>): Promise<[LamsUserEntity[], number]> {
        return await this.userRepository.findAndCount(options);
    }

    /**
     * ?�이지?�이?�된 ?�용??목록??조회?�니??
     */
    async findPaginatedUsers(
        page: number,
        limit: number,
    ): Promise<{
        users: LamsUserEntity[];
        total: number;
    }> {
        try {
            const skip = (page - 1) * limit;

            const [users, total] = await this.userRepository.findAndCount({
                skip,
                take: limit,
                order: { createdAt: 'DESC' },
            });

            this.logger.log(`?�이지?�이?�된 ?�용??목록 조회: ${users.length}�?조회`);
            return { users, total };
        } catch (error) {
            this.logger.error('?�이지?�이?�된 ?�용??목록 조회 ?�패', error.stack);
            throw error;
        }
    }
}
