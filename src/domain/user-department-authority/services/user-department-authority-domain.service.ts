import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDepartmentAuthorityEntity } from '../entities/user-department-authority.entity';
import { AuthorityType, AuthorityAction } from '../enum/authority-type.enum';
import { UserEntity } from '@src/domain/user/entities/user.entity';
import { DepartmentInfoEntity } from '@src/domain/department/entities/department-info.entity';

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
     * 부서 권한 관리 (권한 추가/삭제)
     */
    async manageDepartmentAuthority(
        user: UserEntity,
        department: DepartmentInfoEntity,
        authorityType: AuthorityType,
        action: AuthorityAction,
    ): Promise<{ success: boolean }> {
        this.logger.log(
            `권한 관리 시작: 사용자=${user.username}, 부서=${department.departmentName}, 타입=${authorityType}, 액션=${action}`,
        );

        try {
            if (action === AuthorityAction.ADD) {
                await this.grantAuthority(user, department, authorityType);
                this.logger.log(
                    `권한 부여 성공: 사용자=${user.username}, 부서=${department.departmentName}, 타입=${authorityType}`,
                );
            } else if (action === AuthorityAction.REMOVE) {
                await this.removeAuthority(user.userId, department.departmentId, authorityType);
                this.logger.log(
                    `권한 삭제 성공: 사용자=${user.username}, 부서=${department.departmentName}, 타입=${authorityType}`,
                );
            }

            return { success: true };
        } catch (error) {
            this.logger.error(
                `권한 관리 실패: 사용자=${user.username}, 부서=${department.departmentName}, 타입=${authorityType}, 액션=${action}`,
                error.stack,
            );
            throw error;
        }
    }

    /**
     * 권한 부여
     */
    async grantAuthority(
        user: UserEntity,
        department: DepartmentInfoEntity,
        authorityType: AuthorityType,
    ): Promise<UserDepartmentAuthorityEntity> {
        this.logger.debug(
            `권한 부여 시도: 사용자=${user.username}, 부서=${department.departmentName}, 타입=${authorityType}`,
        );

        // 기존 권한이 있는지 확인
        const existingAuthority = await this.userDepartmentAuthorityRepository.findOne({
            where: {
                userId: user.userId,
                departmentId: department.departmentId,
                authorityType,
            },
        });

        if (existingAuthority) {
            this.logger.warn(
                `이미 존재하는 권한: 사용자=${user.username}, 부서=${department.departmentName}, 타입=${authorityType}`,
            );
            throw new BadRequestException('이미 권한이 있습니다.');
        }

        const newAuthority = this.userDepartmentAuthorityRepository.create({
            user: user,
            department: department,
            authorityType,
        });

        const savedAuthority = await this.userDepartmentAuthorityRepository.save(newAuthority);
        this.logger.debug(`권한 부여 완료: ID=${savedAuthority.authorityId}`);

        return savedAuthority;
    }

    /**
     * 권한 완전 삭제
     */
    async removeAuthority(userId: string, departmentId: string, authorityType: AuthorityType): Promise<boolean> {
        this.logger.debug(`권한 삭제 시도: 사용자ID=${userId}, 부서ID=${departmentId}, 타입=${authorityType}`);

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
    async findAllUserDepartmentAuthorities(userId: string): Promise<UserDepartmentAuthorityEntity[]> {
        return await this.userDepartmentAuthorityRepository.find({
            where: { userId },
            relations: ['department', 'user', 'grantedBy'],
            order: { createdAt: 'DESC' },
        });
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
     * 사용자의 접근 가능한 부서 ID 목록 조회
     */
    async getUserAccessibleDepartmentIds(userId: string): Promise<string[]> {
        this.logger.debug(`접근 가능한 부서 조회: 사용자ID=${userId}`);

        const authorities = await this.userDepartmentAuthorityRepository.find({
            where: { userId, authorityType: AuthorityType.ACCESS },
            select: ['departmentId'],
        });

        const departmentIds = authorities.map((auth) => auth.departmentId);
        this.logger.debug(`접근 가능한 부서 수: ${departmentIds.length}개`);

        return departmentIds;
    }

    /**
     * 사용자의 검토 가능한 부서 ID 목록 조회
     */
    async getUserReviewableDepartmentIds(userId: string): Promise<string[]> {
        this.logger.debug(`검토 가능한 부서 조회: 사용자ID=${userId}`);

        const authorities = await this.userDepartmentAuthorityRepository.find({
            where: { userId, authorityType: AuthorityType.REVIEW },
            select: ['departmentId'],
        });

        const departmentIds = authorities.map((auth) => auth.departmentId);
        this.logger.debug(`검토 가능한 부서 수: ${departmentIds.length}개`);

        return departmentIds;
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
        this.logger.debug(`부서 검토 권한자 확인: 부서ID=${departmentId}`);

        const count = await this.userDepartmentAuthorityRepository.count({
            where: { departmentId, authorityType: AuthorityType.REVIEW },
        });

        const hasReviewers = count > 0;
        this.logger.debug(`부서 검토 권한자 존재 여부: ${hasReviewers ? '있음' : '없음'} (${count}명)`);

        return hasReviewers;
    }
}
