import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { LamsUserEntity } from '../entities/lams-user.entity';

/**
 * ?¬ìš©???„ë©”???œë¹„??
 * - ?¬ìš©??ê´€???µì‹¬ ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§??ì²˜ë¦¬
 * - ?„ë©”??ê·œì¹™ê³?ë¶ˆë??±ì„ ë³´ì¥
 * - ê²€ì¦?ë¡œì§ ë°??°ì´???‘ê·¼ ?µí•© ì²˜ë¦¬
 */
@Injectable()
export class UserDomainService {
    private readonly logger = new Logger(UserDomainService.name);

    constructor(
        @InjectRepository(LamsUserEntity)
        private readonly userRepository: Repository<LamsUserEntity>,
    ) {}

    /**
     * ?¬ìš©??ë¹„ë?ë²ˆí˜¸ ë³€ê²?
     */
    async changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<LamsUserEntity> {
        try {
            if (!userId || !currentPassword || !newPassword || currentPassword === newPassword) {
                throw new BadRequestException('? íš¨?˜ì? ?Šì? ë¹„ë?ë²ˆí˜¸ ë³€ê²??•ë³´?…ë‹ˆ??');
            }

            const user = await this.findUserById(userId);
            if (!user) {
                throw new NotFoundException('?¬ìš©?ë? ì°¾ì„ ???†ìŠµ?ˆë‹¤.');
            }

            // ?„ì¬ ë¹„ë?ë²ˆí˜¸ ?•ì¸
            if (!user.validatePassword(currentPassword)) {
                throw new BadRequestException('?„ì¬ ë¹„ë?ë²ˆí˜¸ê°€ ?¬ë°”ë¥´ì? ?ŠìŠµ?ˆë‹¤.');
            }

            const hashedPassword = user.updateHashedPassword(newPassword);
            user.password = hashedPassword;

            const updatedUser = await this.userRepository.save(user);
            this.logger.log(`ë¹„ë?ë²ˆí˜¸ ë³€ê²??„ë£Œ: ${updatedUser.email}`);
            return updatedUser;
        } catch (error) {
            this.logger.error(`ë¹„ë?ë²ˆí˜¸ ë³€ê²??¤íŒ¨: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * ?¬ìš©???¸ì¦ ê²€ì¦?
     */
    async validateUserCredentials(email: string, password: string): Promise<LamsUserEntity | null> {
        try {
            if (!email || !password || email.trim().length === 0 || password.trim().length === 0) {
                throw new BadRequestException('? íš¨?˜ì? ?Šì? ë¡œê·¸???•ë³´?…ë‹ˆ??');
            }

            const user = await this.findUserByEmail(email);
            if (!user) {
                return null;
            }

            if (!user.isActive) {
                throw new BadRequestException('ë¹„í™œ?±í™”???¬ìš©?ì…?ˆë‹¤.');
            }

            const isPasswordValid = user.validatePassword(password);
            if (!isPasswordValid) {
                return null;
            }

            return user;
        } catch (error) {
            this.logger.error(`?¬ìš©???¸ì¦ ê²€ì¦??¤íŒ¨: ${email}`, error.stack);
            throw error;
        }
    }

    /**
     * ?¬ìš©??IDë¡?ì¡°íšŒ
     */
    async findUserById(userId: string): Promise<LamsUserEntity | null> {
        return await this.userRepository.findOne({
            where: { userId },
        });
    }

    /**
     * ?¬ìš©?ëª…?¼ë¡œ ?¬ìš©??ì¡°íšŒ
     */
    async findUserByEmail(email: string): Promise<LamsUserEntity | null> {
        return await this.userRepository.findOne({
            where: { email },
        });
    }

    /**
     * ?„ì²´ ?¬ìš©??ì¡°íšŒ
     */
    async findAllUsers(): Promise<LamsUserEntity[]> {
        return await this.userRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * ?„ì²´ ?¬ìš©??ì¡°íšŒ(?˜ì´ì§€?¤ì´??
     */
    async findAndCount(options: FindManyOptions<LamsUserEntity>): Promise<[LamsUserEntity[], number]> {
        return await this.userRepository.findAndCount(options);
    }

    /**
     * ?˜ì´ì§€?¤ì´?˜ëœ ?¬ìš©??ëª©ë¡??ì¡°íšŒ?©ë‹ˆ??
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

            this.logger.log(`?˜ì´ì§€?¤ì´?˜ëœ ?¬ìš©??ëª©ë¡ ì¡°íšŒ: ${users.length}ê°?ì¡°íšŒ`);
            return { users, total };
        } catch (error) {
            this.logger.error('?˜ì´ì§€?¤ì´?˜ëœ ?¬ìš©??ëª©ë¡ ì¡°íšŒ ?¤íŒ¨', error.stack);
            throw error;
        }
    }
}
