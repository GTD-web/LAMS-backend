import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDomainService } from '@src/domain/user/services/user-domain.service';
import { DepartmentDomainService } from '@src/domain/organization/department/services/department-domain.service';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { UserRole } from '@src/domain/user/enum/user.enum';

/**
 * 사용자 컨텍스트 서비스
 * - 사용자 관리와 관련된 컨텍스트를 처리
 * - 사용자 조회, 권한 관리, 부서 권한 설정 등의 컨텍스트 정보 제공
 */
@Injectable()
export class UserContextService {
    private readonly logger = new Logger(UserContextService.name);

    constructor(
        private readonly userDomainService: UserDomainService,
        private readonly departmentDomainService: DepartmentDomainService,
        @InjectRepository(LamsUserEntity)
        private readonly userRepository: Repository<LamsUserEntity>,
        @InjectRepository(DepartmentInfoEntity)
        private readonly departmentRepository: Repository<DepartmentInfoEntity>,
    ) {}

    /**
     * 사용자 목록을 조회한다
     * @param options 조회 옵션
     * @returns 사용자 목록
     */
    async 사용자_목록을_조회한다(options?: {
        skip?: number;
        take?: number;
        isActive?: boolean;
        roles?: UserRole[];
    }): Promise<{
        users: LamsUserEntity[];
        total: number;
    }> {
        try {
            const whereConditions: any = {};

            if (options?.isActive !== undefined) {
                whereConditions.isActive = options.isActive;
            }

            if (options?.roles && options.roles.length > 0) {
                // TypeORM에서 배열 필드 검색
                whereConditions.roles = options.roles;
            }

            const [users, total] = await this.userRepository.findAndCount({
                where: whereConditions,
                skip: options?.skip,
                take: options?.take,
                order: { createdAt: 'DESC' },
            });

            this.logger.log(`사용자 목록 조회 성공: ${users.length}개 조회`);
            return { users, total };
        } catch (error) {
            this.logger.error('사용자 목록 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 사용자의 부서 권한을 조회한다
     * @param userId 사용자 ID
     * @returns 사용자의 부서 권한 정보
     */
    async 사용자의_부서_권한을_조회한다(userId: string): Promise<{
        accessDepartments: DepartmentInfoEntity[];
        reviewDepartments: DepartmentInfoEntity[];
    }> {
        try {
            const user = await this.userRepository.findOne({
                where: { userId },
                relations: ['accessableDepartments', 'reviewableDepartments'],
            });

            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            this.logger.log(`사용자 부서 권한 조회 성공: ${user.email}`);
            return {
                accessDepartments: user.accessableDepartments || [],
                reviewDepartments: user.reviewableDepartments || [],
            };
        } catch (error) {
            this.logger.error(`사용자 부서 권한 조회 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 부서의 검토접근 권한에 사용자를 추가삭제한다
     * @param departmentId 부서 ID
     * @param userId 사용자 ID
     * @param action 추가 또는 삭제
     * @param type 권한 타입 (access 또는 review)
     * @returns 업데이트된 부서 정보
     */
    async 부서의_검토접근_권한에_사용자를_추가삭제한다(
        departmentId: string,
        userId: string,
        action: 'add' | 'delete',
        type: 'access' | 'review',
    ): Promise<DepartmentInfoEntity> {
        try {
            const department = await this.departmentDomainService.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            let updatedDepartment: DepartmentInfoEntity;

            if (type === 'access') {
                if (action === 'add') {
                    if (!department.isAccessAuthority(user)) {
                        department.includeAccessAuthority(user);
                        updatedDepartment = await this.departmentRepository.save(department);
                        this.logger.log(`부서 접근 권한 추가: ${department.departmentName} -> ${user.email}`);
                    } else {
                        this.logger.log(`부서 접근 권한 이미 존재: ${department.departmentName} -> ${user.email}`);
                        updatedDepartment = department;
                    }
                } else {
                    if (department.isAccessAuthority(user)) {
                        department.excludeAccessAuthority(user);
                        updatedDepartment = await this.departmentRepository.save(department);
                        this.logger.log(`부서 접근 권한 삭제: ${department.departmentName} -> ${user.email}`);
                    } else {
                        this.logger.log(`부서 접근 권한 없음: ${department.departmentName} -> ${user.email}`);
                        updatedDepartment = department;
                    }
                }
            } else {
                if (action === 'add') {
                    if (!department.isReviewAuthority(user)) {
                        department.includeReviewAuthority(user);
                        updatedDepartment = await this.departmentRepository.save(department);
                        this.logger.log(`부서 검토 권한 추가: ${department.departmentName} -> ${user.email}`);
                    } else {
                        this.logger.log(`부서 검토 권한 이미 존재: ${department.departmentName} -> ${user.email}`);
                        updatedDepartment = department;
                    }
                } else {
                    if (department.isReviewAuthority(user)) {
                        department.excludeReviewAuthority(user);
                        updatedDepartment = await this.departmentRepository.save(department);
                        this.logger.log(`부서 검토 권한 삭제: ${department.departmentName} -> ${user.email}`);
                    } else {
                        this.logger.log(`부서 검토 권한 없음: ${department.departmentName} -> ${user.email}`);
                        updatedDepartment = department;
                    }
                }
            }

            return updatedDepartment;
        } catch (error) {
            this.logger.error(`부서 권한 ${action} 실패: ${departmentId} -> ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자의 검토접근 권한에 부서를 추가삭제한다
     * @param userId 사용자 ID
     * @param departmentId 부서 ID
     * @param action 추가 또는 삭제
     * @param type 권한 타입 (access 또는 review)
     * @returns 업데이트된 사용자 정보
     */
    async 사용자의_검토접근_권한에_부서를_추가삭제한다(
        userId: string,
        departmentId: string,
        action: 'add' | 'delete',
        type: 'access' | 'review',
    ): Promise<LamsUserEntity> {
        try {
            // 이 메서드는 부서의_검토접근_권한에_사용자를_추가삭제한다와 동일한 로직을 수행
            // 양방향 관계이므로 부서 쪽에서 처리하면 사용자 쪽도 자동으로 업데이트됨
            await this.부서의_검토접근_권한에_사용자를_추가삭제한다(departmentId, userId, action, type);

            const updatedUser = await this.userRepository.findOne({
                where: { userId },
                relations: ['accessableDepartments', 'reviewableDepartments'],
            });

            if (!updatedUser) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            this.logger.log(`사용자 권한 업데이트 완료: ${updatedUser.email}`);
            return updatedUser;
        } catch (error) {
            this.logger.error(`사용자 권한 ${action} 실패: ${userId} -> ${departmentId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자의 역할을 확인한다
     * @param userId 사용자 ID
     * @param requiredRoles 필요한 역할들
     * @returns 역할 확인 결과
     */
    async 사용자의_역할을_확인한다(userId: string, requiredRoles: UserRole[]): Promise<boolean> {
        try {
            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role));

            if (!hasRequiredRole) {
                this.logger.warn(`사용자 역할 부족: ${user.email}, 필요한 역할: ${requiredRoles.join(', ')}`);
                return false;
            }

            this.logger.log(`사용자 역할 확인 성공: ${user.email}`);
            return true;
        } catch (error) {
            this.logger.error(`사용자 역할 확인 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자가 특정 부서에 대한 권한을 가지고 있는지 확인한다
     * @param userId 사용자 ID
     * @param departmentId 부서 ID
     * @param permissionType 권한 타입
     * @returns 권한 확인 결과
     */
    async 사용자의_부서_권한을_확인한다(
        userId: string,
        departmentId: string,
        permissionType: 'access' | 'review',
    ): Promise<boolean> {
        try {
            const department = await this.departmentDomainService.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            const user = await this.userDomainService.findUserById(userId);
            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            let hasPermission = false;
            if (permissionType === 'access') {
                hasPermission = department.isAccessAuthority(user);
            } else {
                hasPermission = department.isReviewAuthority(user);
            }

            this.logger.log(
                `사용자 부서 권한 확인: ${user.email} -> ${department.departmentName} (${permissionType}): ${hasPermission}`,
            );
            return hasPermission;
        } catch (error) {
            this.logger.error(`사용자 부서 권한 확인 실패: ${userId} -> ${departmentId}`, error.stack);
            throw error;
        }
    }
}
