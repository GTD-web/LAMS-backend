import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LamsUserEntity } from '../entities/lams-user.entity';
import { IUserRepository, ILamsUserRepository } from '../interfaces/user-repository.interface';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';

/**
 * 사용자 리포지토리 구현체
 * - TypeORM을 사용한 사용자 데이터 접근 계층
 */
@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(LamsUserEntity)
        private readonly userRepository: Repository<LamsUserEntity>,
    ) {}

    /**
     * 사용자 생성
     */
    async create(userData: Partial<LamsUserEntity>): Promise<LamsUserEntity> {
        const user = this.userRepository.create(userData);
        return user;
    }

    /**
     * 사용자 저장
     */
    async save(user: LamsUserEntity): Promise<LamsUserEntity> {
        return await this.userRepository.save(user);
    }

    /**
     * 사용자 ID로 조회
     */
    async findByUserId(userId: string): Promise<LamsUserEntity | null> {
        return await this.userRepository.findOne({
            where: { userId },
        });
    }

    /**
     * 이메일로 조회
     */
    async findByEmail(email: string): Promise<LamsUserEntity | null> {
        return await this.userRepository.findOne({
            where: { email },
        });
    }

    /**
     * 사용자명으로 조회
     */
    async findByUsername(username: string): Promise<LamsUserEntity | null> {
        return await this.userRepository.findOne({
            where: { username },
        });
    }

    /**
     * 모든 사용자 조회 (페이지네이션)
     */
    async findAll(query: PaginationQueryDto): Promise<{
        users: LamsUserEntity[];
        total: number;
    }> {
        const [users, total] = await this.userRepository.findAndCount({
            skip: (query.page - 1) * query.limit,
            take: query.limit,
            order: { createdAt: 'DESC' },
        });

        return { users, total };
    }

    /**
     * 사용자 업데이트
     */
    async updateUser(userId: string, updateData: Partial<LamsUserEntity>): Promise<LamsUserEntity> {
        await this.userRepository.update(userId, updateData);
        return await this.findByUserId(userId);
    }

    /**
     * 사용자 삭제
     */
    async deleteUser(userId: string): Promise<boolean> {
        const result = await this.userRepository.delete(userId);
        return result.affected > 0;
    }

    /**
     * 사용자 존재 여부 확인
     */
    async exists(userId: string): Promise<boolean> {
        const count = await this.userRepository.count({
            where: { userId },
        });
        return count > 0;
    }

    /**
     * 이메일 중복 확인
     */
    async existsByEmail(email: string, excludeId?: string): Promise<boolean> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        queryBuilder.where('user.email = :email', { email });

        if (excludeId) {
            queryBuilder.andWhere('user.userId != :excludeId', { excludeId });
        }

        const count = await queryBuilder.getCount();
        return count > 0;
    }

    /**
     * 사용자명 중복 확인
     */
    async existsByUsername(username: string, excludeId?: string): Promise<boolean> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        queryBuilder.where('user.username = :username', { username });

        if (excludeId) {
            queryBuilder.andWhere('user.userId != :excludeId', { excludeId });
        }

        const count = await queryBuilder.getCount();
        return count > 0;
    }

    /**
     * 역할별 사용자 조회
     */
    async findByRole(role: string): Promise<LamsUserEntity[]> {
        return await this.userRepository
            .createQueryBuilder('user')
            .where('user.roles LIKE :role', { role: `%${role}%` })
            .getMany();
    }

    /**
     * 활성 사용자 조회
     */
    async findActiveUsers(): Promise<LamsUserEntity[]> {
        return await this.userRepository.find({
            where: { isActive: true },
        });
    }

    /**
     * 비활성 사용자 조회
     */
    async findInactiveUsers(): Promise<LamsUserEntity[]> {
        return await this.userRepository.find({
            where: { isActive: false },
        });
    }
}
