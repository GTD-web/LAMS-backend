import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { UserDepartmentAuthorityEntity } from '../entities/user-department-authority.entity';
import { AuthorityType } from '../enum/authority-type.enum';
import { UserEntity } from '../../../domain/user/entities/user.entity';
import { DepartmentInfoEntity } from '../../../domain/department/entities/department-info.entity';
import { UserDepartmentAuthorityDto } from '../dto/user-department-authority.dto';

/**
 * 사용자-부서 권한 도메인 서비스
 */
@Injectable()
export class UserDepartmentAuthorityDomainService {
    private readonly logger = new Logger(UserDepartmentAuthorityDomainService.name);

    constructor(
        @InjectRepository(UserDepartmentAuthorityEntity)
        private readonly userDepartmentAuthorityRepository: Repository<UserDepartmentAuthorityEntity>,
    ) {}

    /**
     * 권한 부여
     */
    async grantAuthority(
        user: UserEntity,
        department: DepartmentInfoEntity,
        authorityType: AuthorityType,
    ): Promise<boolean> {
        // 기존 권한이 있는지 확인
        const existingAuthority = await this.userDepartmentAuthorityRepository.findOne({
            where: {
                userId: user.userId,
                departmentId: department.departmentId,
                authorityType,
            },
        });

        if (existingAuthority) {
            throw new BadRequestException('이미 권한이 있습니다.');
        }

        const newAuthority = this.userDepartmentAuthorityRepository.create({
            user: user,
            department: department,
            authorityType,
        });

        const savedAuthority = await this.userDepartmentAuthorityRepository.save(newAuthority);
        this.logger.debug(`권한 부여 완료: ID=${savedAuthority.authorityId}`);

        return true;
    }

    /**
     * 권한 완전 삭제
     */
    async removeAuthority(userId: string, departmentId: string, authorityType: AuthorityType): Promise<boolean> {
        const result = await this.userDepartmentAuthorityRepository.delete({
            userId,
            departmentId,
            authorityType,
        });

        if (result.affected === 0) {
            this.logger.warn(`삭제할 권한이 없음: 사용자ID=${userId}, 부서ID=${departmentId}, 타입=${authorityType}`);
            throw new NotFoundException('권한을 찾을 수 없습니다.');
        }

        this.logger.debug(`권한 삭제 완료: 삭제된 레코드 수=${result.affected}`);
        return result.affected > 0;
    }

    /**
     * 사용자의 모든 부서 권한 조회 (활성/비활성 포함)
     */
    async findAllUserDepartmentAuthorities(userId: string): Promise<UserDepartmentAuthorityDto> {
        const authorities = await this.userDepartmentAuthorityRepository.find({
            where: { userId },
            relations: ['department'],
            order: { createdAt: 'DESC' },
        });

        const accessableDepartments = authorities
            .filter((authority) => authority.authorityType === AuthorityType.ACCESS)
            .map((authority) => authority.department);

        const reviewableDepartments = authorities
            .filter((authority) => authority.authorityType === AuthorityType.REVIEW)
            .map((authority) => authority.department);

        return new UserDepartmentAuthorityDto(accessableDepartments, reviewableDepartments);
    }

    /**
     * 부서의 모든 권한 사용자 조회 (활성/비활성 포함)
     */
    async findAllDepartmentAuthorities(departmentId: string): Promise<UserDepartmentAuthorityEntity[]> {
        return await this.userDepartmentAuthorityRepository.find({
            where: { departmentId },
            relations: ['department', 'user', 'grantedBy'],
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * 사용자의 접근 가능한 부서 목록 조회
     */
    async getUserAccessibleDepartment(userId: string): Promise<DepartmentInfoEntity[]> {
        const authorities = await this.userDepartmentAuthorityRepository.find({
            where: { userId, authorityType: AuthorityType.ACCESS },
            select: ['departmentId'],
        });

        const departments = authorities.map((auth) => auth.department);
        this.logger.debug(`접근 가능한 부서 수: ${departments.length}개`);

        return departments;
    }

    /**
     * 사용자의 검토 가능한 부서 목록 조회
     */
    async getUserReviewableDepartment(userId: string): Promise<DepartmentInfoEntity[]> {
        const authorities = await this.userDepartmentAuthorityRepository.find({
            where: { userId, authorityType: AuthorityType.REVIEW },
            select: ['departmentId'],
        });

        const departments = authorities.map((auth) => auth.department);
        this.logger.debug(`검토 가능한 부서 수: ${departments.length}개`);

        return departments;
    }

    /**
     * 사용자가 특정 부서에 특정 권한을 가지고 있는지 확인
     */
    async hasUserDepartmentAuthority(
        userId: string,
        departmentId: string,
        authorityType: AuthorityType,
    ): Promise<boolean> {
        this.logger.debug(`권한 확인: 사용자ID=${userId}, 부서ID=${departmentId}, 타입=${authorityType}`);

        const count = await this.userDepartmentAuthorityRepository.count({
            where: { userId, departmentId, authorityType },
        });

        const hasAuthority = count > 0;
        this.logger.debug(`권한 확인 결과: ${hasAuthority ? '권한 있음' : '권한 없음'}`);

        return hasAuthority;
    }

    /**
     * 부서의 검토 권한을 가진 사용자가 있는지 return
     */
    async hasReviewableUserInDepartment(departmentId: string): Promise<boolean> {
        const count = await this.userDepartmentAuthorityRepository.count({
            where: { departmentId, authorityType: AuthorityType.REVIEW },
        });

        const hasReviewers = count > 0;
        this.logger.debug(`부서 검토 권한자 존재 여부: ${hasReviewers ? '있음' : '없음'} (${count}명)`);

        return hasReviewers;
    }

    async removeUserDepartmentAuthorities(departmentId: string, queryRunner?: QueryRunner): Promise<void> {
        const repository = queryRunner
            ? queryRunner.manager.getRepository(UserDepartmentAuthorityEntity)
            : this.userDepartmentAuthorityRepository;
        await repository.delete({ departmentId });
    }
}
