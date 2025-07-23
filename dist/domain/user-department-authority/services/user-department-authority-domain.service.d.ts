import { Repository } from 'typeorm';
import { UserDepartmentAuthorityEntity } from '../entities/user-department-authority.entity';
import { AuthorityType } from '../enum/authority-type.enum';
import { UserEntity } from '@src/domain/user/entities/user.entity';
import { DepartmentInfoEntity } from '@src/domain/department/entities/department-info.entity';
export declare class UserDepartmentAuthorityDomainService {
    private readonly userDepartmentAuthorityRepository;
    private readonly logger;
    constructor(userDepartmentAuthorityRepository: Repository<UserDepartmentAuthorityEntity>);
    grantAuthority(user: UserEntity, department: DepartmentInfoEntity, authorityType: AuthorityType): Promise<boolean>;
    removeAuthority(userId: string, departmentId: string, authorityType: AuthorityType): Promise<boolean>;
    findAllUserDepartmentAuthorities(userId: string): Promise<UserDepartmentAuthorityEntity[]>;
    findAllDepartmentAuthorities(departmentId: string): Promise<UserDepartmentAuthorityEntity[]>;
    getUserAccessibleDepartment(userId: string): Promise<DepartmentInfoEntity[]>;
    getUserReviewableDepartment(userId: string): Promise<DepartmentInfoEntity[]>;
    hasUserDepartmentAuthority(userId: string, departmentId: string, authorityType: AuthorityType): Promise<boolean>;
    hasReviewableUserInDepartment(departmentId: string): Promise<boolean>;
}
