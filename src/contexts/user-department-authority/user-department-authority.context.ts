import { Injectable } from '@nestjs/common';
import { DepartmentDomainService } from '@src/domain/department/services/department-domain.service';
import { UserDepartmentAuthorityEntity } from '@src/domain/user-department-authority/entities/user-department-authority.entity';
import { AuthorityType } from '@src/domain/user-department-authority/enum/authority-type.enum';
import { UserDepartmentAuthorityDomainService } from '@src/domain/user-department-authority/services/user-department-authority-domain.service';
import { UserDomainService } from '@src/domain/user/services/user-domain.service';

@Injectable()
export class UserDepartmentAuthorityContext {
    constructor(
        private readonly userDepartmentAuthorityDomainService: UserDepartmentAuthorityDomainService,
        private readonly userDomainService: UserDomainService,
        private readonly departmentDomainService: DepartmentDomainService,
    ) {}

    async 사용자의_부서_권한을_추가한다(
        userId: string,
        departmentId: string,
        type: AuthorityType,
    ): Promise<UserDepartmentAuthorityEntity> {
        const user = await this.userDomainService.getUserById(userId);
        const department = await this.departmentDomainService.findDepartmentById(departmentId);

        return await this.userDepartmentAuthorityDomainService.grantAuthority(user, department, type);
    }

    async 사용자의_부서_권한을_삭제한다(userId: string, departmentId: string, type: AuthorityType): Promise<boolean> {
        return await this.userDepartmentAuthorityDomainService.removeAuthority(userId, departmentId, type);
    }
}
