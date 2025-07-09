import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { LamsUserEntity } from './entities/lams-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { BaseRepository } from '@src/common/repositories/base.repository';

/**
 * 사용자 도메인 리포지토리 구현체
 * - 사용자 엔티티에 대한 데이터 접근 로직을 구현
 */
@Injectable()
export class UserDomainRepository extends BaseRepository<LamsUserEntity> {
    constructor(
        @InjectRepository(LamsUserEntity)
        repository: Repository<LamsUserEntity>,
    ) {
        super(repository);
    }

    /**
     * 사용자 ID로 사용자 조회
     * @param userId 사용자 ID
     * @returns 사용자 엔티티 또는 null
     */
    async findByUserId(userId: string): Promise<UserEntity | null> {
        return await this.repository.findOne({
            where: { userId },
        });
    }

    /**
     * 사용자명으로 사용자 조회
     * @param username 사용자명
     * @returns 사용자 엔티티 또는 null
     */
    async findByUsername(username: string): Promise<UserEntity | null> {
        return await this.repository.findOne({
            where: { username },
        });
    }

    /**
     * 이메일로 사용자 조회
     * @param email 이메일
     * @returns 사용자 엔티티 또는 null
     */
    async findByEmail(email: string): Promise<UserEntity | null> {
        return await this.repository.findOne({
            where: { email },
        });
    }

    /**
     * 사용자 업데이트
     * @param userId 사용자 ID
     * @param user 업데이트할 사용자 정보
     * @returns 업데이트된 사용자 엔티티
     */
    async updateUser(userId: string, user: Partial<UserEntity>): Promise<UserEntity> {
        await this.repository.update(userId, user);
        return await this.findByUserId(userId);
    }

    /**
     * 사용자 삭제
     * @param userId 사용자 ID
     * @returns 삭제 성공 여부
     */
    async deleteUser(userId: string): Promise<boolean> {
        const result = await this.repository.delete(userId);
        return result.affected > 0;
    }

    /**
     * 모든 사용자 조회
     * @param query 페이지 쿼리
     * @returns 사용자 엔티티 배열과 총 개수
     */
    async findAndCount(query: PaginationQueryDto): Promise<{ users: UserEntity[]; total: number }> {
        const { page, limit } = query;
        const offset = (page - 1) * limit;

        const [users, total] = await this.repository.findAndCount({
            skip: offset,
            take: limit,
        });

        return {
            users,
            total,
        };
    }
}
