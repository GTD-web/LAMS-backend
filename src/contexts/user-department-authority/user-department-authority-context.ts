import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { DepartmentInfoEntity } from '../../domain/department/entities/department-info.entity';
import { DepartmentDomainService } from '../../domain/department/services/department-domain.service';
import { AuthorityType } from '../../domain/user-department-authority/enum/authority-type.enum';
import { UserDepartmentAuthorityDomainService } from '../../domain/user-department-authority/services/user-department-authority-domain.service';
import { UserDomainService } from '../../domain/user/services/user-domain.service';
import { UserDepartmentAuthorityDto } from '../../domain/user-department-authority/dto/user-department-authority.dto';

@Injectable()
export class UserDepartmentAuthorityContext {
    constructor(
        private readonly userDepartmentAuthorityDomainService: UserDepartmentAuthorityDomainService,
        private readonly userDomainService: UserDomainService,
        private readonly departmentDomainService: DepartmentDomainService,
    ) {}

    async 사용자의_부서_권한을_추가한다(userId: string, departmentId: string, type: AuthorityType): Promise<boolean> {
        const user = await this.userDomainService.getUserById(userId);
        const department = await this.departmentDomainService.findDepartmentById(departmentId);

        return await this.userDepartmentAuthorityDomainService.grantAuthority(user, department, type);
    }

    async 사용자의_부서_권한을_삭제한다(userId: string, departmentId: string, type: AuthorityType): Promise<boolean> {
        return await this.userDepartmentAuthorityDomainService.removeAuthority(userId, departmentId, type);
    }

    async 사용자의_접근_가능한_부서_목록을_조회한다(userId: string): Promise<DepartmentInfoEntity[]> {
        return await this.userDepartmentAuthorityDomainService.getUserAccessibleDepartment(userId);
    }

    async 사용자의_검토_가능한_부서_목록을_조회한다(userId: string): Promise<DepartmentInfoEntity[]> {
        return await this.userDepartmentAuthorityDomainService.getUserReviewableDepartment(userId);
    }

    async 사용자의_부서_권한을_조회_부서목록을_반환한다(userId: string): Promise<UserDepartmentAuthorityDto> {
        return await this.userDepartmentAuthorityDomainService.findAllUserDepartmentAuthorities(userId);
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
