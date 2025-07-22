import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDepartmentAuthorityEntity } from '../entities/user-department-authority.entity';
import { DepartmentInfoEntity } from '@src/domain/department/entities/department-info.entity';
import { UserEntity } from '@src/domain/user/entities/user.entity';

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
     * 사용자의 부서별 권한 조회
     */
    async findUserDepartmentAuthorities(userId: string): Promise<UserDepartmentAuthorityEntity[]> {
        return await this.userDepartmentAuthorityRepository.find({
            where: { userId, isActive: true },
            relations: ['department', 'user', 'grantedBy'],
        });
    }

    /**
     * 부서의 권한 사용자 목록 조회
     */
    async findDepartmentAuthorities(
        departmentId: string,
        authorityType?: 'access' | 'review',
    ): Promise<UserDepartmentAuthorityEntity[]> {
        const where: any = { departmentId, isActive: true };
        if (authorityType) {
            where.authorityType = authorityType;
        }

        return await this.userDepartmentAuthorityRepository.find({
            where,
            relations: ['department', 'user', 'grantedBy'],
        });
    }

    /**
     * 특정 사용자의 특정 부서 권한 조회
     */
    async findUserDepartmentAuthority(
        userId: string,
        departmentId: string,
        authorityType: 'access' | 'review',
    ): Promise<UserDepartmentAuthorityEntity | null> {
        return await this.userDepartmentAuthorityRepository.findOne({
            where: { userId, departmentId, authorityType },
            relations: ['department', 'user', 'grantedBy'],
        });
    }

    /**
     * 권한 부여
     */
    async grantAuthority(
        userId: string,
        departmentId: string,
        authorityType: 'access' | 'review',
        grantedByUserId?: string,
    ): Promise<UserDepartmentAuthorityEntity> {
        // 기존 권한이 있는지 확인
        let existingAuthority = await this.findUserDepartmentAuthority(userId, departmentId, authorityType);

        if (existingAuthority) {
            // 기존 권한이 있으면 활성화
            existingAuthority.activate();
            if (grantedByUserId) {
                existingAuthority.grantedByUserId = grantedByUserId;
            }
            return await this.userDepartmentAuthorityRepository.save(existingAuthority);
        } else {
            // 새로운 권한 생성
            const newAuthority = this.userDepartmentAuthorityRepository.create({
                userId,
                departmentId,
                authorityType,
                grantedByUserId,
                isActive: true,
            });
            return await this.userDepartmentAuthorityRepository.save(newAuthority);
        }
    }

    /**
     * 권한 회수
     */
    async revokeAuthority(
        userId: string,
        departmentId: string,
        authorityType: 'access' | 'review',
    ): Promise<UserDepartmentAuthorityEntity | null> {
        const authority = await this.findUserDepartmentAuthority(userId, departmentId, authorityType);

        if (authority) {
            authority.deactivate();
            return await this.userDepartmentAuthorityRepository.save(authority);
        }

        return null;
    }

    /**
     * 권한 완전 삭제
     */
    async removeAuthority(userId: string, departmentId: string, authorityType: 'access' | 'review'): Promise<boolean> {
        const result = await this.userDepartmentAuthorityRepository.delete({
            userId,
            departmentId,
            authorityType,
        });

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
        const authorities = await this.userDepartmentAuthorityRepository.find({
            where: { userId, authorityType: 'access', isActive: true },
            select: ['departmentId'],
        });

        return authorities.map((auth) => auth.departmentId);
    }

    /**
     * 사용자의 검토 가능한 부서 ID 목록 조회
     */
    async getUserReviewableDepartmentIds(userId: string): Promise<string[]> {
        const authorities = await this.userDepartmentAuthorityRepository.find({
            where: { userId, authorityType: 'review', isActive: true },
            select: ['departmentId'],
        });

        return authorities.map((auth) => auth.departmentId);
    }

    /**
     * 사용자가 특정 부서에 특정 권한을 가지고 있는지 확인
     */
    async hasUserDepartmentAuthority(
        userId: string,
        departmentId: string,
        authorityType: 'access' | 'review',
    ): Promise<boolean> {
        const count = await this.userDepartmentAuthorityRepository.count({
            where: { userId, departmentId, authorityType, isActive: true },
        });

        return count > 0;
    }

    /**
     * 권한 일괄 부여
     */
    async grantMultipleAuthorities(
        authorities: Array<{
            userId: string;
            departmentId: string;
            authorityType: 'access' | 'review';
            grantedByUserId?: string;
        }>,
    ): Promise<UserDepartmentAuthorityEntity[]> {
        const results: UserDepartmentAuthorityEntity[] = [];

        for (const auth of authorities) {
            const result = await this.grantAuthority(
                auth.userId,
                auth.departmentId,
                auth.authorityType,
                auth.grantedByUserId,
            );
            results.push(result);
        }

        return results;
    }

    /**
     * 권한 일괄 회수
     */
    async revokeMultipleAuthorities(
        authorities: Array<{
            userId: string;
            departmentId: string;
            authorityType: 'access' | 'review';
        }>,
    ): Promise<UserDepartmentAuthorityEntity[]> {
        const results: UserDepartmentAuthorityEntity[] = [];

        for (const auth of authorities) {
            const result = await this.revokeAuthority(auth.userId, auth.departmentId, auth.authorityType);
            if (result) {
                results.push(result);
            }
        }

        return results;
    }
}
