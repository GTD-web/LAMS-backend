import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm';
import { DepartmentInfoEntity } from '../entities/department-info.entity';

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
     * 부서 검색
     */
    async searchDepartments(searchTerm: string): Promise<DepartmentInfoEntity[]> {
        return await this.departmentRepository.find({
            where: [{ departmentName: Like(`%${searchTerm}%`) }, { departmentCode: Like(`%${searchTerm}%`) }],
            order: { departmentName: 'ASC' },
        });
    }
}
