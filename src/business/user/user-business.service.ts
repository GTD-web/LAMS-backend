import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GetUser } from '@src/common/decorators/get-user.decorator';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { UserEntity, UserRole } from '@src/domain/user/entities/user.entity';
import { UserDomainService } from '@src/domain/user/user.service';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/requests/update-lams-user.dto';
import { UserResponseDto } from './dto/responses/user-response.dto';

/**
 * 사용자 비즈니스 서비스
 * - 사용자 관련 비즈니스 로직 처리
 * - 도메인 서비스와 인터페이스 계층 간의 중재 역할
 */
@Injectable()
export class UserBusinessService {
    constructor(private readonly userDomainService: UserDomainService) {}

    /**
     * 모든 사용자 조회 (페이지네이션)
     */
    async findAllUsers(query: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
        const result = await this.userDomainService.findAllUsers(query);
        const users = plainToInstance(UserResponseDto, result.users);
        return PaginatedResponseDto.create(users, query.page, query.limit, result.total);
    }

    /**
     * 사용자 프로필 조회
     */
    async getProfile(@GetUser() user: UserEntity): Promise<UserResponseDto> {
        return plainToInstance(UserResponseDto, user);
    }

    /**
     * 사용자 ID로 조회
     */
    async findUserById(userId: string): Promise<UserResponseDto> {
        const result = await this.userDomainService.findUserById(userId);
        if (!result) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }
        return plainToInstance(UserResponseDto, result);
    }

    /**
     * 사용자 생성
     */
    async createUser(username: string, email: string, password: string): Promise<UserEntity> {
        return this.userDomainService.createUser(username, email, password);
    }

    /**
     * 사용자 정보 업데이트
     */
    async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const result = await this.userDomainService.updateUser(userId, updateUserDto);
        return plainToInstance(UserResponseDto, result);
    }

    /**
     * 비밀번호 변경
     */
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<UserResponseDto> {
        if (!userId || !currentPassword || !newPassword || currentPassword === newPassword) {
            throw new BadRequestException('유효하지 않은 비밀번호 변경 정보입니다.');
        }

        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 현재 비밀번호 확인
        if (!user.validatePassword(currentPassword)) {
            throw new BadRequestException('현재 비밀번호가 올바르지 않습니다.');
        }

        const result = await this.userDomainService.changePassword(userId, newPassword);
        return plainToInstance(UserResponseDto, result);
    }

    /**
     * 사용자 삭제
     */
    async deleteUser(userId: string): Promise<boolean> {
        return this.userDomainService.deleteUser(userId);
    }

    /**
     * 사용자 역할 업데이트
     */
    async updateUserRole(userId: string, roles: UserRole[]): Promise<UserResponseDto> {
        if (!userId || !roles || roles.length === 0) {
            throw new BadRequestException('유효하지 않은 사용자 ID 또는 역할 정보입니다.');
        }

        const result = await this.userDomainService.updateUserRole(userId, roles);
        return plainToInstance(UserResponseDto, result);
    }
}
