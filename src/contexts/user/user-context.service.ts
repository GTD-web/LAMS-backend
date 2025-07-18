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
 * ?�용??컨텍?�트 ?�비??
 * - ?�용??관�?관??컨텍?�트�?처리
 * - ?�용??목록, 부??권한 관�??�의 컨텍?�트 ?�보 ?�공
 */
@Injectable()
export class UserContextService {
    private readonly logger = new Logger(UserContextService.name);

    constructor(
        private readonly userDomainService: UserDomainService,
        private readonly departmentDomainService: DepartmentDomainService,
    ) {}

    /**
     * ?�이지?�이?�된 ?�용??목록??조회?�다
     */
    async ?�이지?�이?�된_?�용??목록??조회?�다(
        paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedResponseDto<UserResponseDto>> {
        const { page = 1, limit = 10 } = paginationQuery;
        const result = await this.userDomainService.findPaginatedUsers(page, limit);

        const userDtos = result.users.map((user) => plainToInstance(UserResponseDto, user));
        const meta = new PaginationMetaDto(page, limit, result.total);
        const paginatedResult = new PaginatedResponseDto(userDtos, meta);

        this.logger.log(`?�용??목록 조회 ?�공: ${result.users.length}�?조회`);
        return paginatedResult;
    }

    /**
     * ?�용?�의 ?�로?�을 조회?�다
     */
    async ?�용?�의_?�로?�을_조회?�다(userId: string): Promise<UserResponseDto> {
        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('?�용?��? 찾을 ???�습?�다.');
        }

        this.logger.log(`?�용???�로??조회 ?�공: ${user.email}`);
        return plainToInstance(UserResponseDto, user);
    }

    /**
     * 부?�의 검??권한???�용?��? 추�??�다
     */
    async 부?�의_검??권한???�용?��?_추�??�다(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        const updatedDepartment = await this.departmentDomainService.addReviewAuthority(departmentId, userId);
        this.logger.log(`부??검??권한 추�? ?�공: ${departmentId} -> ${userId}`);
        return updatedDepartment;
    }

    /**
     * 부?�의 검??권한?�서 ?�용?��? ??��?�다
     */
    async 부?�의_검??권한?�서_?�용?��?_??��?�다(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        const updatedDepartment = await this.departmentDomainService.removeReviewAuthority(departmentId, userId);
        this.logger.log(`부??검??권한 ??�� ?�공: ${departmentId} -> ${userId}`);
        return updatedDepartment;
    }

    /**
     * 부?�의 리뷰 권한???�용?��? 추�??�다
     */
    async 부?�의_리뷰_권한???�용?��?_추�??�다(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        const updatedDepartment = await this.departmentDomainService.addAccessAuthority(departmentId, userId);
        this.logger.log(`부??리뷰 권한 추�? ?�공: ${departmentId} -> ${userId}`);
        return updatedDepartment;
    }

    /**
     * 부?�의 리뷰 권한?�서 ?�용?��? ??��?�다
     */
    async 부?�의_리뷰_권한?�서_?�용?��?_??��?�다(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        const updatedDepartment = await this.departmentDomainService.removeAccessAuthority(departmentId, userId);
        this.logger.log(`부??리뷰 권한 ??�� ?�공: ${departmentId} -> ${userId}`);
        return updatedDepartment;
    }

    /**
     * ?�용?�의 부??권한 ?�보�?조회?�다
     */
    async ?�용?�의_부??권한_?�보�?조회?�다(userId: string): Promise<{
        reviewDepartments: DepartmentInfoEntity[];
        accessDepartments: DepartmentInfoEntity[];
    }> {
        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('?�용?��? 찾을 ???�습?�다.');
        }

        // ?�용?��? 검??권한??가�?부?�들 조회
        const reviewDepartments = await this.departmentDomainService.findDepartmentsByReviewAuthority(userId);

        // ?�용?��? ?�근 권한??가�?부?�들 조회
        const accessDepartments = await this.departmentDomainService.findDepartmentsByAccessAuthority(userId);

        this.logger.log(`?�용??부??권한 ?�보 조회 ?�공: ${userId}`);
        return {
            reviewDepartments,
            accessDepartments,
        };
    }
}
