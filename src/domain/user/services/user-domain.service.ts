import { Injectable, Inject, Logger } from '@nestjs/common';
import { LamsUserEntity } from '../entities/lams-user.entity';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { IUserRepository } from '../interfaces/user-repository.interface';

/**
 * 사용자 도메인 서비스
 * - 사용자 관련 핵심 비즈니스 로직을 처리
 * - 도메인 규칙과 불변성을 보장
 */
@Injectable()
export class UserDomainService {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) {}

    /**
     * 사용자 생성
     */
    async createUser(username: string, email: string, password: string): Promise<LamsUserEntity> {
        try {
            const user = await this.userRepository.create({
                username,
                email,
                password,
            });
            return await this.userRepository.save(user);
        } catch (error) {
            throw error;
        }
    }

    /**
     * 사용자 업데이트
     */
    async updateUser(userId: string, updateData: Partial<LamsUserEntity>): Promise<LamsUserEntity> {
        try {
            return this.userRepository.updateUser(userId, updateData);
        } catch (error) {
            throw error;
        }
    }

    /**
     * 사용자 비밀번호 변경
     */
    async changePassword(userId: string, hashedNewPassword: string): Promise<LamsUserEntity> {
        try {
            const updatedUser = await this.userRepository.updateUser(userId, { password: hashedNewPassword });
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 사용자 ID로 조회
     */
    async findUserById(userId: string): Promise<LamsUserEntity | null> {
        try {
            return await this.userRepository.findByUserId(userId);
        } catch (error) {
            throw error;
        }
    }

    /**
     * 이메일로 조회
     */
    async findUserByEmail(email: string): Promise<LamsUserEntity | null> {
        try {
            return await this.userRepository.findByEmail(email);
        } catch (error) {
            throw error;
        }
    }

    /**
     * 전체 사용자 조회
     */
    async findAllUsers(query: PaginationQueryDto): Promise<{ users: LamsUserEntity[]; total: number }> {
        try {
            return await this.userRepository.findAll(query);
        } catch (error) {
            throw error;
        }
    }

    /**
     * 사용자 삭제
     */
    async deleteUser(userId: string): Promise<boolean> {
        try {
            const result = await this.userRepository.deleteUser(userId);

            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 사용자 역할 업데이트
     */
    async updateUserRole(userId: string, roleStrings: string[]): Promise<LamsUserEntity> {
        try {
            const updatedUser = await this.userRepository.updateUser(userId, { roles: roleStrings });
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }
}
