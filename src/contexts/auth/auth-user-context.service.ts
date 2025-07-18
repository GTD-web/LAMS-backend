import { ForbiddenException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDomainService } from '@src/domain/user/services/user-domain.service';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { AuthPayloadDto } from '@src/interfaces/dto/auth/responses/auth-payload.dto';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { DepartmentDomainService } from '@src/domain/organization/department/services/department-domain.service';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto, PaginationMetaDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * 인증 컨텍스트 서비스
 * - 사용자 인증과 관련된 컨텍스트를 처리
 * - 토큰 검증, 사용자 상태 확인 등의 컨텍스트 정보 제공
 */
@Injectable()
export class AuthContextService {
    private readonly logger = new Logger(AuthContextService.name);

    constructor(
        private readonly userDomainService: UserDomainService,
        private readonly departmentDomainService: DepartmentDomainService,
        private readonly jwtService: JwtService,
        @InjectRepository(LamsUserEntity)
        private readonly userRepository: Repository<LamsUserEntity>,
        @InjectRepository(DepartmentInfoEntity)
        private readonly departmentRepository: Repository<DepartmentInfoEntity>,
    ) {}

    /**
     * 사용자는 토큰을 검증받는다
     * @param token JWT 토큰
     * @returns 검증된 사용자 정보
     */
    async 사용자는_토큰을_검증받는다(token: string): Promise<LamsUserEntity> {
        try {
            if (!token || token.trim().length === 0) {
                throw new UnauthorizedException('토큰이 제공되지 않았습니다.');
            }

            // Bearer 토큰에서 실제 토큰 추출
            const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;

            let payload: any;
            try {
                payload = this.jwtService.verify(cleanToken);
            } catch (error) {
                this.logger.warn(`토큰 검증 실패: ${error.message}`);
                throw new UnauthorizedException('유효하지 않은 토큰입니다.');
            }

            const user = await this.userDomainService.findUserById(payload.sub);
            if (!user) {
                this.logger.warn(`토큰의 사용자를 찾을 수 없음: ${payload.sub}`);
                throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
            }

            if (!user.isActive) {
                this.logger.warn(`비활성화된 사용자의 토큰 사용: ${user.email}`);
                throw new UnauthorizedException('비활성화된 사용자입니다.');
            }

            this.logger.log(`토큰 검증 성공: ${user.email}`);
            return user;
        } catch (error) {
            this.logger.error(`토큰 검증 실패: ${token}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자의 현재 세션 정보를 조회한다
     * @param userId 사용자 ID
     * @returns 사용자 세션 정보
     */
    async 사용자의_현재_세션_정보를_조회한다(userId: string): Promise<{
        user: LamsUserEntity;
        sessionValid: boolean;
        roles: UserRole[];
    }> {
        try {
            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
            }

            const sessionValid = user.isActive;
            const roles = user.roles as UserRole[];

            this.logger.log(`세션 정보 조회 성공: ${user.email}`);
            return {
                user,
                sessionValid,
                roles,
            };
        } catch (error) {
            this.logger.error(`세션 정보 조회 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자의 권한을 확인한다
     * @param userId 사용자 ID
     * @param requiredRoles 필요한 역할들
     * @returns 권한 확인 결과
     */
    async 사용자의_권한을_확인한다(userId: string, requiredRoles: UserRole[]): Promise<boolean> {
        try {
            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
            }

            if (!user.isActive) {
                throw new UnauthorizedException('비활성화된 사용자입니다.');
            }

            const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role));
            if (!hasRequiredRole) {
                this.logger.warn(`권한 부족: ${user.email}, 필요한 역할: ${requiredRoles.join(', ')}`);
                return false;
            }

            this.logger.log(`권한 확인 성공: ${user.email}`);
            return true;
        } catch (error) {
            this.logger.error(`권한 확인 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 토큰에서 사용자 정보를 추출한다
     * @param token JWT 토큰
     * @returns 사용자 페이로드 정보
     */
    extractUserFromToken(token: string): AuthPayloadDto | null {
        try {
            if (!token || token.trim().length === 0) {
                return null;
            }

            const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
            const payload = this.jwtService.verify(cleanToken);

            return new AuthPayloadDto(payload.sub, payload.roles);
        } catch (error) {
            this.logger.warn(`토큰에서 사용자 정보 추출 실패: ${error.message}`);
            return null;
        }
    }

    /**
     * 토큰이 만료되었는지 확인한다
     * @param token JWT 토큰
     * @returns 만료 여부
     */
    isTokenExpired(token: string): boolean {
        try {
            const payload = this.extractUserFromToken(token);
            if (!payload || !payload.exp) {
                return true;
            }

            return payload.isExpired();
        } catch (error) {
            this.logger.warn(`토큰 만료 확인 실패: ${error.message}`);
            return true;
        }
    }

    /**
     * 자신의 프로필을 조회한다
     * @param userId 사용자 ID
     * @returns 사용자 프로필 정보
     */
    async 자신의_프로필을_조회한다(userId: string): Promise<UserResponseDto> {
        try {
            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            this.logger.log(`프로필 조회 성공: ${user.email}`);
            return plainToInstance(UserResponseDto, user);
        } catch (error) {
            this.logger.error(`프로필 조회 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 페이지네이션된 사용자 목록을 조회한다
     * @param paginationQuery 페이지네이션 쿼리
     * @returns 페이지네이션된 사용자 목록
     */
    async 페이지네이션된_사용자_목록을_조회한다(
        paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedResponseDto<UserResponseDto>> {
        try {
            const { page = 1, limit = 10 } = paginationQuery;
            const skip = (page - 1) * limit;

            const [users, total] = await this.userRepository.findAndCount({
                skip,
                take: limit,
                order: { createdAt: 'DESC' },
            });

            const userDtos = users.map((user) => plainToInstance(UserResponseDto, user));
            const meta = new PaginationMetaDto(page, limit, total);
            const result = new PaginatedResponseDto(userDtos, meta);

            this.logger.log(`사용자 목록 조회 성공: ${users.length}개 조회`);
            return result;
        } catch (error) {
            this.logger.error('사용자 목록 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서의 검토 권한에 사용자를 추가한다
     * @param departmentId 부서 ID
     * @param userId 사용자 ID
     * @returns 업데이트된 부서 정보
     */
    async 부서의_검토_권한에_사용자를_추가한다(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        try {
            const department = await this.departmentDomainService.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            if (!department.isReviewAuthority(user)) {
                department.includeReviewAuthority(user);
                const updatedDepartment = await this.departmentRepository.save(department);
                this.logger.log(`부서 검토 권한 추가: ${department.departmentName} -> ${user.email}`);
                return updatedDepartment;
            }

            this.logger.log(`부서 검토 권한 이미 존재: ${department.departmentName} -> ${user.email}`);
            return department;
        } catch (error) {
            this.logger.error(`부서 검토 권한 추가 실패: ${departmentId} -> ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 부서의 검토 권한에 사용자를 삭제한다
     * @param departmentId 부서 ID
     * @param userId 사용자 ID
     * @returns 업데이트된 부서 정보
     */
    async 부서의_검토_권한에_사용자를_삭제한다(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        try {
            const department = await this.departmentDomainService.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            if (department.isReviewAuthority(user)) {
                department.excludeReviewAuthority(user);
                const updatedDepartment = await this.departmentRepository.save(department);
                this.logger.log(`부서 검토 권한 삭제: ${department.departmentName} -> ${user.email}`);
                return updatedDepartment;
            }

            this.logger.log(`부서 검토 권한 없음: ${department.departmentName} -> ${user.email}`);
            return department;
        } catch (error) {
            this.logger.error(`부서 검토 권한 삭제 실패: ${departmentId} -> ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 부서의 리뷰 권한에 사용자를 추가한다
     * @param departmentId 부서 ID
     * @param userId 사용자 ID
     * @returns 업데이트된 부서 정보
     */
    async 부서의_리뷰_권한에_사용자를_추가한다(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        try {
            const department = await this.departmentDomainService.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            if (!department.isAccessAuthority(user)) {
                department.includeAccessAuthority(user);
                const updatedDepartment = await this.departmentRepository.save(department);
                this.logger.log(`부서 리뷰 권한 추가: ${department.departmentName} -> ${user.email}`);
                return updatedDepartment;
            }

            this.logger.log(`부서 리뷰 권한 이미 존재: ${department.departmentName} -> ${user.email}`);
            return department;
        } catch (error) {
            this.logger.error(`부서 리뷰 권한 추가 실패: ${departmentId} -> ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 부서의 리뷰 권한에 사용자를 삭제한다
     * @param departmentId 부서 ID
     * @param userId 사용자 ID
     * @returns 업데이트된 부서 정보
     */
    async 부서의_리뷰_권한에_사용자를_삭제한다(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        try {
            const department = await this.departmentDomainService.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            if (department.isAccessAuthority(user)) {
                department.excludeAccessAuthority(user);
                const updatedDepartment = await this.departmentRepository.save(department);
                this.logger.log(`부서 리뷰 권한 삭제: ${department.departmentName} -> ${user.email}`);
                return updatedDepartment;
            }

            this.logger.log(`부서 리뷰 권한 없음: ${department.departmentName} -> ${user.email}`);
            return department;
        } catch (error) {
            this.logger.error(`부서 리뷰 권한 삭제 실패: ${departmentId} -> ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자 권한 검증
     * @param requestUserId 요청 사용자 ID
     * @param targetUserId 대상 사용자 ID (본인 확인용)
     * @param requiredRoles 필요한 역할
     * @returns 권한 검증 결과
     */
    async validateUserPermission(
        requestUserId: string,
        targetUserId?: string,
        requiredRoles?: UserRole[],
    ): Promise<boolean> {
        try {
            const user = await this.userDomainService.findUserById(requestUserId);
            if (!user) {
                throw new ForbiddenException('사용자를 찾을 수 없습니다.');
            }

            // 본인 확인
            if (targetUserId && requestUserId === targetUserId) {
                return true;
            }

            // 관리자 권한 확인
            if (requiredRoles && requiredRoles.length > 0) {
                const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role));
                if (!hasRequiredRole) {
                    throw new ForbiddenException('해당 작업을 수행할 권한이 없습니다.');
                }
            }

            return true;
        } catch (error) {
            this.logger.error(`사용자 권한 검증 실패: ${requestUserId}`, error.stack);
            throw error;
        }
    }
}
