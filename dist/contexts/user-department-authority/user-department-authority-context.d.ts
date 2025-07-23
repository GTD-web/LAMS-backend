import { DepartmentInfoEntity } from '@src/domain/department/entities/department-info.entity';
import { DepartmentDomainService } from '@src/domain/department/services/department-domain.service';
import { AuthorityType } from '@src/domain/user-department-authority/enum/authority-type.enum';
import { UserDepartmentAuthorityDomainService } from '@src/domain/user-department-authority/services/user-department-authority-domain.service';
import { UserDomainService } from '@src/domain/user/services/user-domain.service';
export declare class UserDepartmentAuthorityContext {
    private readonly userDepartmentAuthorityDomainService;
    private readonly userDomainService;
    private readonly departmentDomainService;
    constructor(userDepartmentAuthorityDomainService: UserDepartmentAuthorityDomainService, userDomainService: UserDomainService, departmentDomainService: DepartmentDomainService);
    사용자의_부서_권한을_추가한다(userId: string, departmentId: string, type: AuthorityType): Promise<boolean>;
    사용자의_부서_권한을_삭제한다(userId: string, departmentId: string, type: AuthorityType): Promise<boolean>;
    사용자의_접근_가능한_부서_목록을_조회한다(userId: string): Promise<DepartmentInfoEntity[]>;
    사용자의_검토_가능한_부서_목록을_조회한다(userId: string): Promise<DepartmentInfoEntity[]>;
}
