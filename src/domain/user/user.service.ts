import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { LamsUserEntity } from './entities/lams-user.entity';
import { IUserDomainRepository } from './interfaces/user-repository.interface';
import { UserRole } from './entities/user.entity';
import { LamsUserRole } from './entities/lams-user.entity';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { SignUpDto } from '@src/interfaces/http/dtos/user/requests/create-lams-user.dto';
import { UpdateUserDto } from '@src/interfaces/http/dtos/user/requests/update-lams-user.dto';

/**
 * 사용자 도메인 서비스
 * - 사용자 관련 핵심 비즈니스 로직을 처리
 * - 도메인 규칙과 불변성을 보장
 */
@Injectable()
export class UserDomainService {
    constructor(
        @Inject('IUserDomainRepository')
        private readonly userRepository: IUserDomainRepository,
    ) {}

    /**
     * 사용자 생성
     * @param username 사용자명
     * @param email 이메일
     * @param password 비밀번호
     * @returns 생성된 사용자 엔티티
     */
    async createUser(createUserDto: SignUpDto): Promise<UserEntity> {
        const { username, email, password } = createUserDto;
        if (!username || !email || !password) {
            throw new BadRequestException('유효하지 않은 사용자 생성 정보입니다.');
        }

        // 중복 사용자 확인
        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser) {
            throw new ConflictException('이미 존재하는 사용자명입니다.');
        }

        const existingEmail = await this.userRepository.findByEmail(email);
        if (existingEmail) {
            throw new ConflictException('이미 존재하는 이메일입니다.');
        }

        // 사용자 엔티티 생성
        const user = new UserEntity();
        user.username = username;
        user.email = email;
        user.password = password;

        return await this.userRepository.create(user);
    }

    /**
     * LAMS 사용자 생성
     * @param username 사용자명
     * @param email 이메일
     * @param password 비밀번호
     * @returns 생성된 LAMS 사용자 엔티티
     */
    async createLamsUser(dto: SignUpDto): Promise<LamsUserEntity> {
        const { username, email, password } = dto;
        if (!username || !email || !password) {
            throw new BadRequestException('유효하지 않은 LAMS 사용자 생성 정보입니다.');
        }

        // 중복 사용자 확인
        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser) {
            throw new ConflictException('이미 존재하는 사용자명입니다.');
        }

        const existingEmail = await this.userRepository.findByEmail(email);
        if (existingEmail) {
            throw new ConflictException('이미 존재하는 이메일입니다.');
        }

        // LAMS 사용자 엔티티 생성
        const lamsUser = new LamsUserEntity();
        lamsUser.username = username;
        lamsUser.email = email;
        lamsUser.password = password;

        return await this.userRepository.createLamsUser(lamsUser);
    }

    /**
     * 사용자 업데이트
     * @param username 사용자명
     * @param password 비밀번호
     * @returns 업데이트된 사용자 엔티티
     */
    async updateUser(userId: string, dto: UpdateUserDto): Promise<UserEntity> {
        const { username, password } = dto;
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
        if (password) updateData.password = password;

        return await this.userRepository.update(userId, updateData);
    }

    /**
     * 사용자 비밀번호 변경
     * @param userId 사용자 ID
     * @param currentPassword 현재 비밀번호
     * @param newPassword 새 비밀번호
     * @returns 업데이트된 사용자 엔티티
     */
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<UserEntity> {
        if (!userId || !currentPassword || !newPassword || currentPassword === newPassword) {
            throw new BadRequestException('유효하지 않은 비밀번호 변경 정보입니다.');
        }

        const user = await this.userRepository.findByUserId(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 현재 비밀번호 확인
        if (!user.validatePassword(currentPassword)) {
            throw new BadRequestException('현재 비밀번호가 올바르지 않습니다.');
        }

        // 새 비밀번호로 업데이트
        user.updatePassword(newPassword);
        return await this.userRepository.update(userId, { password: user.password });
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

        return await this.userRepository.findByUserId(userId);
    }

    /**
     * 사용자명으로 조회
     * @param username 사용자명
     * @returns 사용자 엔티티 또는 null
     */
    async findUserByUsername(username: string): Promise<UserEntity | null> {
        if (!username) {
            throw new BadRequestException('유효하지 않은 사용자명입니다.');
        }

        return await this.userRepository.findByUsername(username);
    }

    /**
     * 이메일로 조회
     * @param email 이메일
     * @returns 사용자 엔티티 또는 null
     */
    async findUserByEmail(email: string): Promise<UserEntity | null> {
        if (!email) {
            throw new BadRequestException('유효하지 않은 이메일입니다.');
        }

        return await this.userRepository.findByEmail(email);
    }

    /**
     * 전체 사용자 조회
     * @returns 사용자 엔티티 배열
     */
    async findAllUsers(query: PaginationQueryDto): Promise<{ users: UserEntity[]; total: number }> {
        return await this.userRepository.findAndCount(query);
    }

    /**
     * LAMS 사용자 조회
     * @param userId 사용자 ID
     * @returns LAMS 사용자 엔티티 또는 null
     */
    async findLamsUserById(userId: string): Promise<LamsUserEntity | null> {
        if (!userId) {
            throw new BadRequestException('유효하지 않은 사용자 ID입니다.');
        }

        return await this.userRepository.findLamsUserById(userId);
    }

    /**
     * 사용자 삭제
     * @param userId 사용자 ID
     * @returns 삭제 성공 여부
     */
    async deleteUser(userId: string): Promise<boolean> {
        if (!userId) {
            throw new BadRequestException('유효하지 않은 사용자 ID입니다.');
        }

        const user = await this.userRepository.findByUserId(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        return await this.userRepository.delete(userId);
    }

    /**
     * 사용자 역할 업데이트
     * @param userId 사용자 ID
     * @param roles 새로운 역할 배열
     * @returns 업데이트된 사용자 엔티티
     */
    async updateUserRole(userId: string, roles: UserRole[]): Promise<UserEntity> {
        if (!userId || !roles || roles.length === 0) {
            throw new BadRequestException('유효하지 않은 사용자 ID 또는 역할 정보입니다.');
        }

        const user = await this.userRepository.findByUserId(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // UserRole enum을 string 배열로 변환
        const roleStrings = roles.map((role) => role.toString());
        return await this.userRepository.update(userId, { roles: roleStrings });
    }

    /**
     * 사용자 역할 조회
     * @param userId 사용자 ID
     * @returns 사용자 역할 정보
     */
    async getUserRole(userId: string): Promise<{ userId: string; username: string; roles: string[] }> {
        if (!userId) {
            throw new BadRequestException('유효하지 않은 사용자 ID입니다.');
        }

        const user = await this.userRepository.findByUserId(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        return {
            userId: user.userId,
            username: user.username,
            roles: user.roles,
        };
    }
}
