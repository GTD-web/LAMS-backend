import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
export declare class UserDomainService {
    private readonly userRepository;
    private readonly logger;
    constructor(userRepository: Repository<UserEntity>);
    changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<UserEntity>;
    validateUserCredentials(email: string, password: string): Promise<UserEntity | null>;
    findUserById(userId: string): Promise<UserEntity | null>;
    findUserByEmail(email: string): Promise<UserEntity | null>;
    createUser(userData: Partial<UserEntity>): Promise<UserEntity>;
    updateUser(userId: string, updateData: Partial<UserEntity>): Promise<UserEntity>;
    updateUserAuthority(user: UserEntity, department: DepartmentInfoEntity, type: 'access' | 'review', action: 'add' | 'remove'): Promise<UserEntity>;
    deleteUser(userId: string): Promise<void>;
    findPaginatedUsers(page: number, limit: number): Promise<{
        users: UserEntity[];
        total: number;
    }>;
    searchUsers(searchCriteria: {
        userId?: string;
        email?: string;
        name?: string;
        loginId?: string;
        keyword?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        users: UserEntity[];
        total: number;
    }>;
    searchUserById(userId: string): Promise<UserEntity | null>;
    searchUsersByEmail(email: string): Promise<UserEntity[]>;
    searchUsersByName(name: string): Promise<UserEntity[]>;
}
