import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserDomainService } from '@src/domain/user/services/user-domain.service';
import { DepartmentDomainService } from '@src/domain/organization/department/services/department-domain.service';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto, PaginationMetaDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { plainToInstance } from 'class-transformer';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';

/**
 * 사용자 컨텍스트 서비스
 * - 사용자 관련 관련 컨텍스트를 처리
 * - 사용자 목록, 부서 권한 관리 등의 컨텍스트 정보 제공
 */
@Injectable()
export class UserContextService {
    private readonly logger = new Logger(UserContextService.name);

    constructor(
        private readonly userDomainService: UserDomainService,
        private readonly departmentDomainService: DepartmentDomainService,
    ) {}

    /**
     * 페이지네이션된 사용자 목록을 조회한다
     */
    async 페이지네이션된_사용자_목록을_조회한다(
        paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedResponseDto<UserResponseDto>> {
        const { page = 1, limit = 10 } = paginationQuery;
        const result = await this.userDomainService.findPaginatedUsers(page, limit);

        const userDtos = result.users.map((user) => plainToInstance(UserResponseDto, user));
        const meta = new PaginationMetaDto(page, limit, result.total);
        const paginatedResult = new PaginatedResponseDto(userDtos, meta);

        this.logger.log(`사용자 목록 조회 성공: ${result.users.length}명 조회`);
        return paginatedResult;
    }

    /**
     * 사용자의 프로필을 조회한다
     */
    async 사용자의_프로필을_조회한다(userId: string): Promise<UserResponseDto> {
        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        const userDto = plainToInstance(UserResponseDto, user);
        this.logger.log(`사용자 프로필 조회 성공: ${user.email}`);
        return userDto;
    }

    /**
     * 부서의 검토 권한에 사용자를 추가한다 (권한 관리는 복잡한 비즈니스 로직이므로 try-catch 유지)
     */
    async 부서의_검토_권한에_사용자를_추가한다(departmentId: string, userId: string): Promise<void> {
        try {
            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            const department = await this.departmentDomainService.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            await this.departmentDomainService.addReviewAuthority(departmentId, userId);
            this.logger.log(`부서 검토 권한 추가 성공: ${user.email} -> ${department.departmentName}`);
        } catch (error) {
            this.logger.error(`부서 검토 권한 추가 실패: ${departmentId}, ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 부서의 검토 권한에서 사용자를 삭제한다 (권한 관리는 복잡한 비즈니스 로직이므로 try-catch 유지)
     */
    async 부서의_검토_권한에서_사용자를_삭제한다(departmentId: string, userId: string): Promise<void> {
        try {
            await this.departmentDomainService.removeReviewAuthority(departmentId, userId);
            this.logger.log(`부서 검토 권한 삭제 성공: ${userId} -> ${departmentId}`);
        } catch (error) {
            this.logger.error(`부서 검토 권한 삭제 실패: ${departmentId}, ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 부서의 접근 권한에 사용자를 추가한다 (권한 관리는 복잡한 비즈니스 로직이므로 try-catch 유지)
     */
    async 부서의_접근_권한에_사용자를_추가한다(departmentId: string, userId: string): Promise<void> {
        try {
            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            const department = await this.departmentDomainService.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            await this.departmentDomainService.addAccessAuthority(departmentId, userId);
            this.logger.log(`부서 접근 권한 추가 성공: ${user.email} -> ${department.departmentName}`);
        } catch (error) {
            this.logger.error(`부서 접근 권한 추가 실패: ${departmentId}, ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 부서의 접근 권한에서 사용자를 삭제한다 (권한 관리는 복잡한 비즈니스 로직이므로 try-catch 유지)
     */
    async 부서의_접근_권한에서_사용자를_삭제한다(departmentId: string, userId: string): Promise<void> {
        try {
            await this.departmentDomainService.removeAccessAuthority(departmentId, userId);
            this.logger.log(`부서 접근 권한 삭제 성공: ${userId} -> ${departmentId}`);
        } catch (error) {
            this.logger.error(`부서 접근 권한 삭제 실패: ${departmentId}, ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자의 부서 권한 목록을 조회한다 (권한 조회는 복잡한 비즈니스 로직이므로 try-catch 유지)
     */
    async 사용자의_부서_권한_목록을_조회한다(userId: string): Promise<{
        reviewDepartments: DepartmentInfoEntity[];
        accessDepartments: DepartmentInfoEntity[];
    }> {
        try {
            const reviewDepartments = await this.departmentDomainService.findDepartmentsByReviewAuthority(userId);
            const accessDepartments = await this.departmentDomainService.findDepartmentsByAccessAuthority(userId);

            this.logger.log(`사용자 부서 권한 조회 성공: ${userId}`);
            return {
                reviewDepartments,
                accessDepartments,
            };
        } catch (error) {
            this.logger.error(`사용자 부서 권한 조회 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자를 검색한다
     */
    async 사용자를_검색한다(searchCriteria: {
        userId?: string;
        email?: string;
        name?: string;
        loginId?: string;
        keyword?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ data: UserResponseDto[]; total: number }> {
        const result = await this.userDomainService.searchUsers(searchCriteria);

        const userDtos = result.users.map((user) => plainToInstance(UserResponseDto, user));

        this.logger.log(`사용자 검색 완료: ${result.users.length}명 조회 (총 ${result.total}명)`);
        return {
            data: userDtos,
            total: result.total,
        };
    }
}
