import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { DepartmentInfoEntity } from '../../domain/department/entities/department-info.entity';
import { DepartmentDomainService } from '../../domain/department/services/department-domain.service';
import { AuthorityType } from '../../domain/user-department-authority/enum/authority-type.enum';
import { UserDepartmentAuthorityDomainService } from '../../domain/user-department-authority/services/user-department-authority-domain.service';
import { UserDomainService } from '../../domain/user/services/user-domain.service';

@Injectable()
export class UserDepartmentAuthorityContext {
    constructor(
        private readonly userDepartmentAuthorityDomainService: UserDepartmentAuthorityDomainService,
        private readonly departmentDomainService: DepartmentDomainService,
    ) {}

    async 사용자의_부서_권한을_추가한다(userId: string, departmentId: string, type: AuthorityType): Promise<boolean> {
        // 단순 ID만 사용하여 권한 부여
        return await this.userDepartmentAuthorityDomainService.grantAuthority(userId, departmentId, type);
    }

    async 사용자의_부서_권한을_삭제한다(userId: string, departmentId: string, type: AuthorityType): Promise<boolean> {
        return await this.userDepartmentAuthorityDomainService.removeAuthority(userId, departmentId, type);
    }

    async 사용자의_접근_가능한_부서_목록을_조회한다(userId: string): Promise<DepartmentInfoEntity[]> {
        // Domain에서 ID 목록을 가져온 후 Context에서 부서 정보 조합
        const departmentIds = await this.userDepartmentAuthorityDomainService.getUserAccessibleDepartmentIds(userId);
        return await this.departmentDomainService.findDepartmentsByIds(departmentIds);
    }

    async 사용자의_검토_가능한_부서_목록을_조회한다(userId: string): Promise<DepartmentInfoEntity[]> {
        // Domain에서 ID 목록을 가져온 후 Context에서 부서 정보 조합
        const departmentIds = await this.userDepartmentAuthorityDomainService.getUserReviewableDepartmentIds(userId);
        return await this.departmentDomainService.findDepartmentsByIds(departmentIds);
    }

    async 사용자의_부서_권한을_조회_부서목록을_반환한다(userId: string): Promise<{
        accessableDepartments: DepartmentInfoEntity[];
        reviewableDepartments: DepartmentInfoEntity[];
    }> {
        // Domain에서 ID 목록을 가져온 후 Context에서 부서 정보 조합
        const { accessableDepartmentIds, reviewableDepartmentIds } =
            await this.userDepartmentAuthorityDomainService.findAllUserDepartmentAuthorities(userId);

        const accessableDepartments = await this.departmentDomainService.findDepartmentsByIds(accessableDepartmentIds);
        const reviewableDepartments = await this.departmentDomainService.findDepartmentsByIds(reviewableDepartmentIds);

        return { accessableDepartments, reviewableDepartments };
    }

    async 해당_부서의_권한을_가진_데이터를_삭제한다(
        departments: DepartmentInfoEntity[],
        queryRunner?: QueryRunner,
    ): Promise<void> {
        for (const department of departments) {
            await this.userDepartmentAuthorityDomainService.removeUserDepartmentAuthorities(
                department.departmentId,
                queryRunner,
            );
        }
    }
}
