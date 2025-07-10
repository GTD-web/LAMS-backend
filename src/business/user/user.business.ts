import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GetUser } from '@src/common/decorators/get-user.decorator';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/requests/update-lams-user.dto';
import { UserResponseDto } from './dto/responses/user-response.dto';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { UserDomainService } from '@src/domain/user/services/user-domain.service';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';

/**
 * 사용자 비즈니스 서비스
 * - 사용자 관련 비즈니스 로직 처리
 * - 도메인 서비스와 인터페이스 계층 간의 중재 역할
 */
@Injectable()
export class UserBusinessService {
    private readonly logger = new Logger(UserBusinessService.name);

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
     * 사용자 생성 - 비즈니스 크리티컬: 로그 필요
     */
    async createUser(username: string, email: string, password: string): Promise<UserResponseDto> {
        // 이메일 중복 확인
        const existingUser = await this.userDomainService.findUserByEmail(email);
        if (existingUser) {
            throw new ConflictException('이미 존재하는 이메일입니다.');
        }

        const user = await this.userDomainService.createUser(username, email, password);
        const response = {
            userId: user.userId,
            username: user.username,
            email: user.email,
            roles: user.roles,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        } as UserResponseDto;

        this.logger.log(`사용자 생성 완료: ${user.email}`);
        return response;
    }

    /**
     * 사용자 정보 업데이트 - 비즈니스 크리티컬: 로그 필요
     */
    async updateUser(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        const updateData: Partial<LamsUserEntity> = {};
        if (dto.username) updateData.username = dto.username;
        if (dto.password) {
            const isValidate = user.validatePassword(dto.password);

            if (!isValidate) {
                updateData.password = user.updateHashedPassword(dto.password);
            }
        }

        const result = await this.userDomainService.updateUser(userId, updateData);
        const response = plainToInstance(UserResponseDto, result);
        this.logger.log(`사용자 정보 업데이트 완료: ${result.email}`);
        return response;
    }

    /**
     * 비밀번호 변경 - 비즈니스 크리티컬: 로그 필요
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

        const hashedPassword = user.updateHashedPassword(newPassword);

        const result = await this.userDomainService.changePassword(userId, hashedPassword);
        const response = plainToInstance(UserResponseDto, result);
        this.logger.log(`비밀번호 변경 완료: ${result.email}`);
        return response;
    }

    /**
     * 사용자 삭제 - 비즈니스 크리티컬: 로그 필요
     */
    async deleteUser(userId: string): Promise<boolean> {
        const user = await this.userDomainService.findUserById(userId);

        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        const result = await this.userDomainService.deleteUser(userId);
        this.logger.log(`사용자 삭제 완료: ${userId}`);
        return result;
    }

    /**
     * 사용자 역할 업데이트 - 비즈니스 크리티컬: 로그 필요
     */
    async updateUserRole(userId: string, roles: UserRole[]): Promise<UserResponseDto> {
        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        const roleStrings = roles.map((role) => role.toString());

        const result = await this.userDomainService.updateUserRole(userId, roleStrings);
        const response = plainToInstance(UserResponseDto, result);
        this.logger.log(`사용자 역할 업데이트 완료: ${result.email}, 새 역할: ${roles.join(', ')}`);
        return response;
    }
}
