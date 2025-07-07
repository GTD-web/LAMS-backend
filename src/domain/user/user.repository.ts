import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { LamsUserEntity } from './entities/lams-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserDomainRepository } from './interfaces/user-repository.interface';
import { PaginationQueryDto } from '@src/libs/dtos/pagination/pagination-query.dto';

/**
 * 사용자 도메인 리포지토리 구현체
 * - 사용자 엔티티에 대한 데이터 접근 로직을 구현
 */
@Injectable()
export class UserDomainRepository implements IUserDomainRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(LamsUserEntity)
        private readonly lamsUserRepository: Repository<LamsUserEntity>,
    ) {}

    /**
     * 사용자 ID로 사용자 조회
     * @param userId 사용자 ID
     * @returns 사용자 엔티티 또는 null
     */
    async findByUserId(userId: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({
            where: { userId },
        });
    }

    /**
     * LAMS 사용자 조회 (관계 포함)
     * @param userId 사용자 ID
     * @returns LAMS 사용자 엔티티 또는 null
     */
    async findLamsUserById(userId: string): Promise<LamsUserEntity | null> {
        return await this.lamsUserRepository.findOne({
            where: { userId },
            relations: ['accessableDepartments', 'reviewableDepartments'],
        });
    }

    /**
     * 사용자명으로 사용자 조회
     * @param username 사용자명
     * @returns 사용자 엔티티 또는 null
     */
    async findByUsername(username: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({
            where: { username },
        });
    }

    /**
     * 이메일로 사용자 조회
     * @param email 이메일
     * @returns 사용자 엔티티 또는 null
     */
    async findByEmail(email: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({
            where: { email },
        });
    }

    /**
     * 모든 사용자 조회
     * @param query 페이지 쿼리
     * @returns 사용자 엔티티 배열과 총 개수
     */
    async findAndCount(query: PaginationQueryDto): Promise<{ users: UserEntity[]; total: number }> {
        const { page, limit } = query;
        const offset = (page - 1) * limit;

        const [users, total] = await this.userRepository.findAndCount({
            skip: offset,
            take: limit,
        });

        return {
            users,
            total,
        };
    }

    /**
     * 사용자 생성
     * @param user 사용자 엔티티
     * @returns 생성된 사용자 엔티티
     */
    async create(user: UserEntity): Promise<UserEntity> {
        return await this.userRepository.save(user);
    }

    /**
     * LAMS 사용자 생성
     * @param user LAMS 사용자 엔티티
     * @returns 생성된 LAMS 사용자 엔티티
     */
    async createLamsUser(user: LamsUserEntity): Promise<LamsUserEntity> {
        return await this.lamsUserRepository.save(user);
    }

    /**
     * 사용자 업데이트
     * @param userId 사용자 ID
     * @param user 업데이트할 사용자 정보
     * @returns 업데이트된 사용자 엔티티
     */
    async update(userId: string, user: Partial<UserEntity>): Promise<UserEntity> {
        await this.userRepository.update(userId, user);
        return await this.findByUserId(userId);
    }

    /**
     * 사용자 삭제
     * @param userId 사용자 ID
     * @returns 삭제 성공 여부
     */
    async delete(userId: string): Promise<boolean> {
        const result = await this.userRepository.delete(userId);
        return result.affected > 0;
    }
}
