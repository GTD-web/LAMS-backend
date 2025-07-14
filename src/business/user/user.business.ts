import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GetUser } from '@src/common/decorators/get-user.decorator';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { UserDomainService } from '@src/domain/user/services/user-domain.service';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';

/**
 * 사용자 비즈니스 서비스
 * - 사용자 관련 비즈니스 로직 처리
 * - 도메인 서비스와 인터페이스 계층 간의 중재 역할
 * - 검증 로직은 Domain Service에서 처리
 */
@Injectable()
export class UserBusinessService {
    constructor(private readonly userDomainService: UserDomainService) {}

    /**
     * 모든 사용자 조회 (페이지네이션) - 단순 조회: 로그 불필요
     */
    async findAllUsers(query: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
        const result = await this.userDomainService.findAllUsers(query);
        const users = plainToInstance(UserResponseDto, result.users);
        const response = PaginatedResponseDto.create(users, query.page, query.limit, result.total);
        return response;
    }

    /**
     * 사용자 프로필 조회 - 단순 조회: 로그 불필요
     */
    async getProfile(@GetUser() user: LamsUserEntity): Promise<UserResponseDto> {
        const response = plainToInstance(UserResponseDto, user);
        return response;
    }

    /**
     * 사용자 ID로 조회 - 단순 조회: 로그 불필요
     */
    async findUserById(userId: string): Promise<UserResponseDto> {
        const result = await this.userDomainService.findUserById(userId);
        if (!result) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }
        const response = plainToInstance(UserResponseDto, result);
        return response;
    }

    /**
     * 비밀번호 변경 - 검증 로직은 Domain Service에서 처리
     */
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<UserResponseDto> {
        const result = await this.userDomainService.changeUserPassword(userId, currentPassword, newPassword);
        const response = plainToInstance(UserResponseDto, result);
        return response;
    }

    /**
     * 사용자 삭제 - 검증 로직은 Domain Service에서 처리
     */
    async deleteUser(userId: string): Promise<boolean> {
        return await this.userDomainService.deleteLamsUser(userId);
    }

    /**
     * 사용자 역할 업데이트 - 검증 로직은 Domain Service에서 처리
     */
    async updateUserRole(userId: string, roles: UserRole[]): Promise<UserResponseDto> {
        const result = await this.userDomainService.updateUserRole(userId, roles);
        const response = plainToInstance(UserResponseDto, result);
        return response;
    }
}
