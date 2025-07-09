import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { UserEntity, UserRole } from './entities/user.entity';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { UserDomainRepository } from './user.repository';
import { BaseService } from '@src/common/services/base.service';
import { LamsUserEntity } from './entities/lams-user.entity';
import { UpdateUserDto } from '@src/business/user/dto/requests/update-lams-user.dto';

/**
 * 사용자 도메인 서비스
 * - 사용자 관련 핵심 비즈니스 로직을 처리
 * - 도메인 규칙과 불변성을 보장
 */
@Injectable()
export class UserDomainService extends BaseService<LamsUserEntity> {
    constructor(private readonly userRepository: UserDomainRepository) {
        super(userRepository);
    }

    /**
     * 사용자 생성
     * @param username 사용자명
     * @param email 이메일
     * @param password 비밀번호
     * @returns 생성된 사용자 엔티티
     */
    async createUser(username: string, email: string, password: string): Promise<UserEntity> {
        try {
            const user = await this.userRepository.create({ username: username, email: email, password: password });
            console.log(user);
            return this.userRepository.save(user);
        } catch (error) {
            throw new BadRequestException('이미 존재하는 이메일입니다.', error.message);
        }
    }

    /**
     * 사용자 업데이트
     * @param userId 사용자 ID
     * @param dto 업데이트 정보
     * @returns 업데이트된 사용자 엔티티
     */
    async updateUser(userId: string, dto: UpdateUserDto): Promise<UserEntity> {
        const { username } = dto;
        if (!userId) {
            throw new BadRequestException('유효하지 않은 사용자 ID입니다.');
        }

        const user = await this.userRepository.findByUserId(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 사용자명 중복 확인
        if (username && username !== user.username) {
            const existingUser = await this.userRepository.findByUsername(username);
            if (existingUser) {
                throw new ConflictException('이미 존재하는 사용자명입니다.');
            }
        }

        const updateData: Partial<UserEntity> = {};
        if (username) updateData.username = username;

        return await this.userRepository.updateUser(userId, updateData);
    }

    /**
     * 사용자 비밀번호 변경
     * @param userId 사용자 ID
     * @param newPassword 새 비밀번호
     * @returns 업데이트된 사용자 엔티티
     */
    async changePassword(userId: string, newPassword: string): Promise<UserEntity> {
        const user = await this.userRepository.findByUserId(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        user.updatePassword(newPassword);
        return await this.userRepository.updateUser(userId, { password: user.password });
    }

    /**
     * 사용자 ID로 조회
     * @param userId 사용자 ID
     * @returns 사용자 엔티티 또는 null
     */
    async findUserById(userId: string): Promise<UserEntity | null> {
        if (!userId) {
            throw new BadRequestException('유효하지 않은 사용자 ID입니다.');
        }

        return this.userRepository.findOne({ where: { userId: userId } });
    }

    /**
     * 이메일로 조회
     * @param email 이메일
     * @returns 사용자 엔티티 또는 null
     */
    async findUserByEmail(email: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({ where: { email: email } });
    }

    /**
     * 전체 사용자 조회
     * @returns 사용자 엔티티 배열
     */
    async findAllUsers(query: PaginationQueryDto): Promise<{ users: UserEntity[]; total: number }> {
        const result = await this.userRepository.findAndCount(query);
        return this.userRepository.findAndCount(query);
    }

    /**
     * 사용자 삭제
     * @param userId 사용자 ID
     * @returns 삭제 성공 여부
     */
    async deleteUser(userId: string): Promise<boolean> {
        const user = await this.userRepository.findByUserId(userId);

        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        return await this.userRepository.deleteUser(userId);
    }

    /**
     * 사용자 역할 업데이트
     * @param userId 사용자 ID
     * @param roles 새로운 역할 배열
     * @returns 업데이트된 사용자 엔티티
     */
    async updateUserRole(userId: string, roles: UserRole[]): Promise<UserEntity> {
        const user = await this.userRepository.findByUserId(userId);

        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // UserRole enum을 string 배열로 변환
        const roleStrings = roles.map((role) => role.toString());
        return await this.userRepository.updateUser(userId, { roles: roleStrings });
    }
}
