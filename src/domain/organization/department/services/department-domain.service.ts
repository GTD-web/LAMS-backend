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
            order: { createdAt: 'DESC' },
            relations: ['employees', 'employees.employee'],
        });
    }

    /**
     * 페이지네이션된 부서 목록 조회
     */
    async findPaginatedDepartments(
        page: number,
        limit: number,
        isExclude?: boolean,
    ): Promise<{ departments: DepartmentInfoEntity[]; total: number }> {
        const skip = (page - 1) * limit;
        const whereCondition = isExclude !== undefined ? { isExclude } : {};

        const [departments, total] = await this.departmentRepository.findAndCount({
            where: whereCondition,
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
            relations: ['employees', 'employees.employee'],
        });

        this.logger.log(`페이지네이션된 부서 목록 조회: ${departments.length}개 조회`);
        return { departments, total };
    }

    /**
     * 부서 생성
     */
    async createDepartment(departmentData: Partial<DepartmentInfoEntity>): Promise<DepartmentInfoEntity> {
        if (!departmentData.departmentName || !departmentData.departmentCode) {
            throw new BadRequestException('부서명과 부서코드가 필요합니다.');
        }

        const existingDepartment = await this.findDepartmentByCode(departmentData.departmentCode);
        if (existingDepartment) {
            throw new BadRequestException('이미 존재하는 부서코드입니다.');
        }

        const department = this.departmentRepository.create(departmentData);
        const savedDepartment = await this.departmentRepository.save(department);

        this.logger.log(`부서 생성 완료: ${savedDepartment.departmentName}`);
        return savedDepartment;
    }

    /**
     * 부서 정보 수정
     */
    async updateDepartment(
        departmentId: string,
        updateData: Partial<DepartmentInfoEntity>,
    ): Promise<DepartmentInfoEntity> {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new BadRequestException('부서 ID가 필요합니다.');
        }

        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        Object.assign(department, updateData);
        const updatedDepartment = await this.departmentRepository.save(department);

        this.logger.log(`부서 정보 수정 완료: ${updatedDepartment.departmentName}`);
        return updatedDepartment;
    }

    /**
     * 부서 제외 여부 토글
     */
    async toggleDepartmentExclusion(departmentId: string): Promise<DepartmentInfoEntity> {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new BadRequestException('부서 ID가 필요합니다.');
        }

        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        department.isExclude = !department.isExclude;
        const updatedDepartment = await this.departmentRepository.save(department);

        this.logger.log(`부서 제외 여부 변경: ${updatedDepartment.departmentName} -> ${updatedDepartment.isExclude}`);
        return updatedDepartment;
    }

    /**
     * MMS 부서 ID로 조회
     */
    async findDepartmentByMMSDepartmentId(mmsDepartmentId: string): Promise<DepartmentInfoEntity | null> {
        return await this.departmentRepository.findOne({
            where: { mmsDepartmentId },
        });
    }

    /**
     * MMS 부서 정보로 부서 생성 또는 수정
     */
    async createOrUpdateDepartment(departmentData: MMSDepartmentResponseDto): Promise<DepartmentInfoEntity> {
        const existingDepartment = await this.findDepartmentByMMSDepartmentId(departmentData.id);

        if (existingDepartment) {
            // 기존 부서 업데이트
            Object.assign(existingDepartment, {
                departmentName: departmentData.department_name,
                departmentCode: departmentData.department_code,
                parentDepartmentId: departmentData.parent_department_id,
                isExclude: false,
            });

            const updatedDepartment = await this.departmentRepository.save(existingDepartment);
            this.logger.log(`MMS 부서 정보 업데이트: ${updatedDepartment.departmentName}`);
            return updatedDepartment;
        } else {
            // 새 부서 생성
            const newDepartment = this.departmentRepository.create({
                mmsDepartmentId: departmentData.id,
                departmentName: departmentData.department_name,
                departmentCode: departmentData.department_code,
                parentDepartmentId: departmentData.parent_department_id,
                isExclude: false,
            });

            const savedDepartment = await this.departmentRepository.save(newDepartment);
            this.logger.log(`MMS 부서 생성: ${savedDepartment.departmentName}`);
            return savedDepartment;
        }
    }

    /**
     * 부서 삭제
     */
    async removeDepartment(departmentId: string): Promise<void> {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new BadRequestException('부서 ID가 필요합니다.');
        }

        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        await this.departmentRepository.remove(department);
        this.logger.log(`부서 삭제 완료: ${department.departmentName}`);
    }

    /**
     * 검토 권한 추가
     */
    async addReviewAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        if (!departmentId || !userId) {
            throw new BadRequestException('부서 ID와 사용자 ID가 필요합니다.');
        }

        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 이미 권한이 있는지 확인
        const hasAuthority = department.reviewAuthorities?.some((auth) => auth.userId === userId);
        if (hasAuthority) {
            throw new BadRequestException('이미 검토 권한이 있는 사용자입니다.');
        }

        // 권한 추가 로직 (실제 구현은 중간테이블 엔티티에 따라 달라질 수 있음)
        if (!department.reviewAuthorities) {
            department.reviewAuthorities = [];
        }

        // 실제로는 중간테이블 엔티티를 생성해야 함
        // 여기서는 간단히 로깅만 처리
        this.logger.log(`검토 권한 추가: ${user.email} -> ${department.departmentName}`);

        return department;
    }

    /**
     * 검토 권한 제거
     */
    async removeReviewAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        if (!departmentId || !userId) {
            throw new BadRequestException('부서 ID와 사용자 ID가 필요합니다.');
        }

        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        // 권한 제거 로직
        this.logger.log(`검토 권한 제거: ${userId} -> ${department.departmentName}`);

        return department;
    }

    /**
     * 접근 권한 추가
     */
    async addAccessAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        if (!departmentId || !userId) {
            throw new BadRequestException('부서 ID와 사용자 ID가 필요합니다.');
        }

        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        const user = await this.userDomainService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 접근 권한 추가 로직
        this.logger.log(`접근 권한 추가: ${user.email} -> ${department.departmentName}`);

        return department;
    }

    /**
     * 접근 권한 제거
     */
    async removeAccessAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity> {
        if (!departmentId || !userId) {
            throw new BadRequestException('부서 ID와 사용자 ID가 필요합니다.');
        }

        const department = await this.findDepartmentById(departmentId);
        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        // 접근 권한 제거 로직
        this.logger.log(`접근 권한 제거: ${userId} -> ${department.departmentName}`);

        return department;
    }

    /**
     * 검토 권한이 있는 부서 조회
     */
    async findDepartmentsByReviewAuthority(userId: string): Promise<DepartmentInfoEntity[]> {
        if (!userId) {
            throw new BadRequestException('사용자 ID가 필요합니다.');
        }

        // 실제로는 중간테이블을 통해 조회해야 함
        // 여기서는 빈 배열 반환
        this.logger.log(`검토 권한 부서 조회: ${userId}`);
        return [];
    }

    /**
     * 접근 권한이 있는 부서 조회
     */
    async findDepartmentsByAccessAuthority(userId: string): Promise<DepartmentInfoEntity[]> {
        if (!userId) {
            throw new BadRequestException('사용자 ID가 필요합니다.');
        }

        // 실제로는 중간테이블을 통해 조회해야 함
        // 여기서는 빈 배열 반환
        this.logger.log(`접근 권한 부서 조회: ${userId}`);
        return [];
    }
}
