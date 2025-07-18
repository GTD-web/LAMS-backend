import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm';
import { DepartmentInfoEntity } from '../entities/department-info.entity';
import { UserDomainService } from '../../../user/services/user-domain.service';
import { MMSDepartmentResponseDto } from '@src/interfaces/dto/organization/requests/mms-department-import.dto';

/**
 * 부서 도메인 서비스
 * - 부서 관련 핵심 도메인 로직 처리
 * - 부서 정보 조회, 권한 관리, 제외 처리 등
 * - 검증 로직 및 데이터 접근 통합 처리
 */
@Injectable()
export class DepartmentDomainService {
    private readonly logger = new Logger(DepartmentDomainService.name);

    constructor(
        @InjectRepository(DepartmentInfoEntity)
        private readonly departmentRepository: Repository<DepartmentInfoEntity>,
        private readonly userDomainService: UserDomainService,
    ) {}

    /**
     * 부서 ID로 조회
     */
    async findDepartmentById(departmentId: string): Promise<DepartmentInfoEntity | null> {
        return await this.departmentRepository.findOne({
            where: { departmentId },
            relations: ['employees', 'employees.employee', 'accessAuthorities', 'reviewAuthorities'],
        });
    }

    /**
     * 부서 코드로 조회
     */
    async findDepartmentByCode(departmentCode: string): Promise<DepartmentInfoEntity | null> {
        return await this.departmentRepository.findOne({
            where: { departmentCode },
        });
    }

    /**
     * 부서 목록 조회
     */
    async findAllDepartments(isExclude?: boolean): Promise<DepartmentInfoEntity[]> {
        const whereCondition = isExclude !== undefined ? { isExclude } : {};

        return await this.departmentRepository.find({
            where: whereCondition,
            order: { departmentName: 'ASC' },
        });
    }

    /**
     * 부서 제외 상태 토글
     */
    async toggleDepartmentExclude(departmentId: string): Promise<DepartmentInfoEntity> {
        try {
            const department = await this.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            department.isExclude = !department.isExclude;
            const updatedDepartment = await this.departmentRepository.save(department);
            this.logger.log(
                `부서 제외 상태 토글 완료: ${updatedDepartment.departmentName} (${updatedDepartment.isExclude})`,
            );
            return updatedDepartment;
        } catch (error) {
            this.logger.error(`부서 제외 상태 토글 실패: ${departmentId}`, error.stack);
            throw error;
        }
    }

    /**
     * 부서 계층 구조 조회
     */
    async findHierarchy(departmentId?: string): Promise<DepartmentInfoEntity[]> {
        try {
            if (departmentId) {
                return await this.departmentRepository.find({
                    where: { parentDepartmentId: departmentId },
                    order: { departmentName: 'ASC' },
                });
            } else {
                return await this.departmentRepository.find({
                    order: { departmentName: 'ASC' },
                });
            }
        } catch (error) {
            this.logger.error('부서 계층 구조 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 생성
     */
    async saveDepartment(department: DepartmentInfoEntity): Promise<DepartmentInfoEntity> {
        return await this.departmentRepository.save(department);
    }

    /**
     * 부서 생성 또는 업데이트
     */
    async createOrUpdateDepartment(department: MMSDepartmentResponseDto): Promise<DepartmentInfoEntity> {
        let departmentInfo = await this.departmentRepository.findOne({
            where: { departmentId: department.id },
        });
        if (departmentInfo) {
            departmentInfo.departmentName = department.department_name;
            departmentInfo.departmentCode = department.department_code;
            departmentInfo = await this.departmentRepository.save(departmentInfo);
        } else {
            const newDepartment = new DepartmentInfoEntity();
            newDepartment.mmsDepartmentId = department.id;
            newDepartment.departmentName = department.department_name;
            newDepartment.departmentCode = department.department_code;
            departmentInfo = await this.departmentRepository.save(newDepartment);
        }

        return departmentInfo;
    }

    /**
     * 부서 검색
     */
    async searchDepartments(searchTerm: string): Promise<DepartmentInfoEntity[]> {
        return await this.departmentRepository.find({
            where: [{ departmentName: Like(`%${searchTerm}%`) }, { departmentCode: Like(`%${searchTerm}%`) }],
            order: { departmentName: 'ASC' },
        });
    }

    async removeDepartment(departmentId: string): Promise<void> {
        await this.departmentRepository.delete(departmentId);
    }

    /**
     * 부서의 검토 권한에 사용자를 추가합니다
     */
    async addReviewAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        try {
            const department = await this.departmentRepository.findOne({
                where: { departmentId },
                relations: ['reviewAuthorities'],
            });

            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            const user = await this.userDomainService.findUserById(userId);

            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            if (!department.isReviewAuthority(user)) {
                department.includeReviewAuthority(user);
                const updatedDepartment = await this.departmentRepository.save(department);
                this.logger.log(`부서 검토 권한 추가: ${department.departmentName} -> ${user.email}`);
                return updatedDepartment;
            }

            this.logger.log(`부서 검토 권한 이미 존재: ${department.departmentName} -> ${user.email}`);
            return department;
        } catch (error) {
            this.logger.error(`부서 검토 권한 추가 실패: ${departmentId} -> ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 부서의 검토 권한에서 사용자를 제거합니다
     */
    async removeReviewAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        try {
            const department = await this.departmentRepository.findOne({
                where: { departmentId },
                relations: ['reviewAuthorities'],
            });

            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            const user = await this.userDomainService.findUserById(userId);

            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            if (department.isReviewAuthority(user)) {
                department.excludeReviewAuthority(user);
                const updatedDepartment = await this.departmentRepository.save(department);
                this.logger.log(`부서 검토 권한 삭제: ${department.departmentName} -> ${user.email}`);
                return updatedDepartment;
            }

            this.logger.log(`부서 검토 권한 없음: ${department.departmentName} -> ${user.email}`);
            return department;
        } catch (error) {
            this.logger.error(`부서 검토 권한 삭제 실패: ${departmentId} -> ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 부서의 접근 권한에 사용자를 추가합니다
     */
    async addAccessAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        try {
            const department = await this.departmentRepository.findOne({
                where: { departmentId },
                relations: ['accessAuthorities'],
            });

            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            const user = await this.userDomainService.findUserById(userId);

            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            if (!department.isAccessAuthority(user)) {
                department.includeAccessAuthority(user);
                const updatedDepartment = await this.departmentRepository.save(department);
                this.logger.log(`부서 접근 권한 추가: ${department.departmentName} -> ${user.email}`);
                return updatedDepartment;
            }

            this.logger.log(`부서 접근 권한 이미 존재: ${department.departmentName} -> ${user.email}`);
            return department;
        } catch (error) {
            this.logger.error(`부서 접근 권한 추가 실패: ${departmentId} -> ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 부서의 접근 권한에서 사용자를 제거합니다
     */
    async removeAccessAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        try {
            const department = await this.departmentRepository.findOne({
                where: { departmentId },
                relations: ['accessAuthorities'],
            });

            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            const user = await this.userDomainService.findUserById(userId);

            if (!user) {
                throw new NotFoundException('사용자를 찾을 수 없습니다.');
            }

            if (department.isAccessAuthority(user)) {
                department.excludeAccessAuthority(user);
                const updatedDepartment = await this.departmentRepository.save(department);
                this.logger.log(`부서 접근 권한 삭제: ${department.departmentName} -> ${user.email}`);
                return updatedDepartment;
            }

            this.logger.log(`부서 접근 권한 없음: ${department.departmentName} -> ${user.email}`);
            return department;
        } catch (error) {
            this.logger.error(`부서 접근 권한 삭제 실패: ${departmentId} -> ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자가 검토 권한을 가진 부서들을 조회합니다
     */
    async findDepartmentsByReviewAuthority(userId: string): Promise<DepartmentInfoEntity[]> {
        try {
            const departments = await this.departmentRepository.find({
                relations: ['reviewAuthorities'],
            });

            const reviewDepartments = departments.filter(
                (dept) => dept.reviewAuthorities && dept.reviewAuthorities.some((user) => user.userId === userId),
            );

            this.logger.log(`사용자 검토 권한 부서 조회: ${userId} -> ${reviewDepartments.length}개`);
            return reviewDepartments;
        } catch (error) {
            this.logger.error(`사용자 검토 권한 부서 조회 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사용자가 접근 권한을 가진 부서들을 조회합니다
     */
    async findDepartmentsByAccessAuthority(userId: string): Promise<DepartmentInfoEntity[]> {
        try {
            const departments = await this.departmentRepository.find({
                relations: ['accessAuthorities'],
            });

            const accessDepartments = departments.filter(
                (dept) => dept.accessAuthorities && dept.accessAuthorities.some((user) => user.userId === userId),
            );

            this.logger.log(`사용자 접근 권한 부서 조회: ${userId} -> ${accessDepartments.length}개`);
            return accessDepartments;
        } catch (error) {
            this.logger.error(`사용자 접근 권한 부서 조회 실패: ${userId}`, error.stack);
            throw error;
        }
    }

    /**
     * MMS 부서 ID로 부서 조회
     */
    async findDepartmentByMMSDepartmentId(mmsDepartmentId: string): Promise<DepartmentInfoEntity | null> {
        return await this.departmentRepository.findOne({
            where: { mmsDepartmentId },
        });
    }
}
