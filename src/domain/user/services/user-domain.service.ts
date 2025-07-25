import {
    Injectable,
    Logger,
    BadRequestException,
    NotFoundException,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { PaginatedResponseDto, PaginationMetaDto } from '../../../common/dtos/pagination/pagination-response.dto';
import { PaginationQueryDto } from '../../../common/dtos/pagination/pagination-query.dto';
import { UserResponseDto } from '../../../business/user/dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

/**
 * 사용자 도메인 서비스
 * - 사용자 관련 핵심 비즈니스 로직을 처리
 * - 도메인 규칙의 불변성을 보장
 * - 검증 로직 및 데이터 접근 통합 처리
 */
@Injectable()
export class UserDomainService {
    private readonly logger = new Logger(UserDomainService.name);

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    /**
     * 사용자 비밀번호 변경
     */
    async changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: { userId },
        });

        if (!user) {
            throw new NotFoundException('ID에 해당하는 사용자를 찾을 수 없습니다.');
        }

        // 현재 비밀번호 확인
        if (!this.validatePassword(user, currentPassword)) {
            throw new BadRequestException('현재 비밀번호가 올바르지 않습니다.');
        }

        const hashedPassword = this.updateHashedPassword(newPassword);
        user.password = hashedPassword;

        const updatedUser = await this.userRepository.save(user);
        this.logger.log(`비밀번호 변경 완료: ${updatedUser.email}`);
        return updatedUser;
    }

    /**
     * 사용자 인증 검증
     */
    async validateUserCredentials(email: string, password: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });

        if (!user) {
            throw new NotFoundException('이메일에 해당하는 사용자를 찾을 수 없습니다.');
        }

        if (!this.validatePassword(user, password)) {
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }

        return user;
    }

    /**
     * 사용자 ID로 조회
     */
    async findUserById(userId: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({
            where: { userId },
        });
    }

    /**
     * 사용자 ID로 조회
     */
    async getUserById(userId: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: { userId },
        });

        if (!user) {
            throw new NotFoundException('ID에 해당하는 사용자를 찾을 수 없습니다.');
        }

        return user;
    }

    /**
     * 사용자 생성
     */
    async createUser(userData: Partial<UserEntity>): Promise<UserEntity> {
        const existingUser = await this.userRepository.findOne({
            where: { email: userData.email },
        });

        if (existingUser) {
            throw new ConflictException('이미 존재하는 이메일입니다.');
        }

        const user = this.userRepository.create(userData);
        const savedUser = await this.userRepository.save(user);

        return savedUser;
    }

    /**
     * 페이지네이션된 사용자 목록 조회
     */
    async findPaginatedUsers(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
        const { page, limit } = paginationQuery;
        const skip = (page - 1) * limit;

        const [users, total] = await this.userRepository.findAndCount({
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        const meta = new PaginationMetaDto(page, limit, total);
        const userDtos = users.map((user) => plainToInstance(UserResponseDto, user));
        const paginatedResult = new PaginatedResponseDto(userDtos, meta);

        return paginatedResult;
    }

    // ==================== 사용자 Entity 메서드 ====================

    private validatePassword(user: UserEntity, password: string) {
        return bcrypt.compareSync(password, user.password);
    }

    private updateHashedPassword(password: string) {
        return bcrypt.hashSync(password, 10);
    }
}
