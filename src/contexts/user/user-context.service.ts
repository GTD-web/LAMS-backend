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
 * ?¬ìš©??ì»¨í…?¤íŠ¸ ?œë¹„??
 * - ?¬ìš©??ê´€ë¦?ê´€??ì»¨í…?¤íŠ¸ë¥?ì²˜ë¦¬
 * - ?¬ìš©??ëª©ë¡, ë¶€??ê¶Œí•œ ê´€ë¦??±ì˜ ì»¨í…?¤íŠ¸ ?•ë³´ ?œê³µ
 */
@Injectable()
export class UserContextService {
    private readonly logger = new Logger(UserContextService.name);

    constructor(
        private readonly userDomainService: UserDomainService,
        private readonly departmentDomainService: DepartmentDomainService,
    ) {}

    /**
     * ?˜ì´ì§€?¤ì´?˜ëœ ?¬ìš©??ëª©ë¡??ì¡°íšŒ?œë‹¤
     */
    async ?˜ì´ì§€?¤ì´?˜ëœ_?¬ìš©??ëª©ë¡??ì¡°íšŒ?œë‹¤(
        paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedResponseDto<UserResponseDto>> {
        const { page = 1, limit = 10 } = paginationQuery;
        const result = await this.userDomainService.findPaginatedUsers(page, limit);

        const userDtos = result.users.map((user) => plainToInstance(UserResponseDto, user));
        const meta = new PaginationMetaDto(page, limit, result.total);
        const paginatedResult = new PaginatedResponseDto(userDtos, meta);

        this.logger.log(`?¬ìš©??ëª©ë¡ ì¡°íšŒ ?±ê³µ: ${result.users.length}ê°?ì¡°íšŒ`);
        return paginatedResult;
    }

    /**
     * ?¬ìš©?ì˜ ?„ë¡œ?„ì„ ì¡°íšŒ?œë‹¤
     */
    async ?¬ìš©?ì˜_?„ë¡œ?„ì„_ì¡°íšŒ?œë‹¤(userId: string): Promise<UserResponseDto> {
        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('?¬ìš©?ë? ì°¾ì„ ???†ìŠµ?ˆë‹¤.');
        }

        this.logger.log(`?¬ìš©???„ë¡œ??ì¡°íšŒ ?±ê³µ: ${user.email}`);
        return plainToInstance(UserResponseDto, user);
    }

    /**
     * ë¶€?œì˜ ê²€??ê¶Œí•œ???¬ìš©?ë? ì¶”ê??œë‹¤
     */
    async ë¶€?œì˜_ê²€??ê¶Œí•œ???¬ìš©?ë?_ì¶”ê??œë‹¤(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        const updatedDepartment = await this.departmentDomainService.addReviewAuthority(departmentId, userId);
        this.logger.log(`ë¶€??ê²€??ê¶Œí•œ ì¶”ê? ?±ê³µ: ${departmentId} -> ${userId}`);
        return updatedDepartment;
    }

    /**
     * ë¶€?œì˜ ê²€??ê¶Œí•œ?ì„œ ?¬ìš©?ë? ?? œ?œë‹¤
     */
    async ë¶€?œì˜_ê²€??ê¶Œí•œ?ì„œ_?¬ìš©?ë?_?? œ?œë‹¤(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        const updatedDepartment = await this.departmentDomainService.removeReviewAuthority(departmentId, userId);
        this.logger.log(`ë¶€??ê²€??ê¶Œí•œ ?? œ ?±ê³µ: ${departmentId} -> ${userId}`);
        return updatedDepartment;
    }

    /**
     * ë¶€?œì˜ ë¦¬ë·° ê¶Œí•œ???¬ìš©?ë? ì¶”ê??œë‹¤
     */
    async ë¶€?œì˜_ë¦¬ë·°_ê¶Œí•œ???¬ìš©?ë?_ì¶”ê??œë‹¤(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        const updatedDepartment = await this.departmentDomainService.addAccessAuthority(departmentId, userId);
        this.logger.log(`ë¶€??ë¦¬ë·° ê¶Œí•œ ì¶”ê? ?±ê³µ: ${departmentId} -> ${userId}`);
        return updatedDepartment;
    }

    /**
     * ë¶€?œì˜ ë¦¬ë·° ê¶Œí•œ?ì„œ ?¬ìš©?ë? ?? œ?œë‹¤
     */
    async ë¶€?œì˜_ë¦¬ë·°_ê¶Œí•œ?ì„œ_?¬ìš©?ë?_?? œ?œë‹¤(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        const updatedDepartment = await this.departmentDomainService.removeAccessAuthority(departmentId, userId);
        this.logger.log(`ë¶€??ë¦¬ë·° ê¶Œí•œ ?? œ ?±ê³µ: ${departmentId} -> ${userId}`);
        return updatedDepartment;
    }

    /**
     * ?¬ìš©?ì˜ ë¶€??ê¶Œí•œ ?•ë³´ë¥?ì¡°íšŒ?œë‹¤
     */
    async ?¬ìš©?ì˜_ë¶€??ê¶Œí•œ_?•ë³´ë¥?ì¡°íšŒ?œë‹¤(userId: string): Promise<{
        reviewDepartments: DepartmentInfoEntity[];
        accessDepartments: DepartmentInfoEntity[];
    }> {
        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('?¬ìš©?ë? ì°¾ì„ ???†ìŠµ?ˆë‹¤.');
        }

        // ?¬ìš©?ê? ê²€??ê¶Œí•œ??ê°€ì§?ë¶€?œë“¤ ì¡°íšŒ
        const reviewDepartments = await this.departmentDomainService.findDepartmentsByReviewAuthority(userId);

        // ?¬ìš©?ê? ?‘ê·¼ ê¶Œí•œ??ê°€ì§?ë¶€?œë“¤ ì¡°íšŒ
        const accessDepartments = await this.departmentDomainService.findDepartmentsByAccessAuthority(userId);

        this.logger.log(`?¬ìš©??ë¶€??ê¶Œí•œ ?•ë³´ ì¡°íšŒ ?±ê³µ: ${userId}`);
        return {
            reviewDepartments,
            accessDepartments,
        };
    }
}
