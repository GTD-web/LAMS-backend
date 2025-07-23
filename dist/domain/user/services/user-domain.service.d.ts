import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
export declare class UserDomainService {
    private readonly userRepository;
    private readonly logger;
    constructor(userRepository: Repository<UserEntity>);
    changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<UserEntity>;
    validateUserCredentials(email: string, password: string): Promise<UserEntity | null>;
    findUserById(userId: string): Promise<UserEntity | null>;
    getUserById(userId: string): Promise<UserEntity>;
    findUserAuthority(userId: string): Promise<UserEntity>;
    createUser(userData: Partial<UserEntity>): Promise<UserEntity>;
    findPaginatedUsers(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>>;
    private validatePassword;
    private updateHashedPassword;
}
