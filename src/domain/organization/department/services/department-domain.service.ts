import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm';
import { DepartmentInfoEntity } from '../entities/department-info.entity';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
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
    ) {}

    /**
     * 부서 제외 토글 (검증 로직 포함)
     */
    async toggleDepartmentExclude(departmentId: string): Promise<DepartmentInfoEntity> {
        try {
            const department = await this.findDepartmentById(departmentId);
            if (!department) {
                throw new NotFoundException('부서를 찾을 수 없습니다.');
            }

            department.isExclude = !department.isExclude;
            const updatedDepartment = await this.departmentRepository.save(department);

            const status = updatedDepartment.isExclude ? '제외' : '포함';
            this.logger.log(`부서 ${status} 처리 완료: ${updatedDepartment.departmentName}`);
            return updatedDepartment;
        } catch (error) {
            this.logger.error(`부서 제외 토글 실패: ${departmentId}`, error.stack);
            throw error;
        }
    }

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
     * 부서 이름으로 조회
     */
    async findDepartmentByName(departmentName: string): Promise<DepartmentInfoEntity | null> {
        return await this.departmentRepository.findOne({
            where: { departmentName },
        });
    }

    /**
     * MMS 부서 ID로 조회
     */
    async findDepartmentByMMSDepartmentId(mmsDepartmentId: string): Promise<DepartmentInfoEntity | null> {
        try {
            return await this.departmentRepository.findOne({
                where: { mmsDepartmentId },
            });
        } catch (error) {
            this.logger.error(`MMS 부서 ID 조회 실패: ${mmsDepartmentId}`, error.stack);
            throw error;
        }
    }

    /**
     * 모든 부서 조회 (페이지네이션 없이)
     */
    async findAllDepartmentsWithoutPagination(): Promise<DepartmentInfoEntity[]> {
        try {
            return await this.departmentRepository.find({
                order: { departmentName: 'ASC' },
            });
        } catch (error) {
            this.logger.error('모든 부서 조회 실패', error.stack);
            throw error;
        }
    }

    /**
     * 부서 목록 조회 (페이지네이션)
     */
    async findAllDepartmentsPaginated(
        query: PaginationQueryDto,
        isExclude?: boolean,
    ): Promise<{ departments: DepartmentInfoEntity[]; total: number }> {
        const whereCondition = isExclude !== undefined ? { isExclude } : {};

        const [departments, total] = await this.departmentRepository.findAndCount({
            where: whereCondition,
            skip: (query.page - 1) * query.limit,
            take: query.limit,
            order: { departmentName: 'ASC' },
        });

        return { departments, total };
    }

    /**
     * 부서 생성 또는 업데이트 (MMS 동기화용)
     */
    async createOrUpdateDepartment(departmentData: Partial<DepartmentInfoEntity>): Promise<DepartmentInfoEntity> {
        try {
            if (departmentData.mmsDepartmentId) {
                const existingDepartment = await this.findDepartmentByMMSDepartmentId(departmentData.mmsDepartmentId);
                if (existingDepartment) {
                    // 기존 부서 업데이트
                    Object.assign(existingDepartment, departmentData);
                    const updatedDepartment = await this.departmentRepository.save(existingDepartment);
                    this.logger.log(`부서 업데이트 완료 (MMS): ${updatedDepartment.departmentName}`);
                    return updatedDepartment;
                }
            }

            // 새 부서 생성
            const department = this.departmentRepository.create(departmentData);
            const savedDepartment = await this.departmentRepository.save(department);
            this.logger.log(`부서 생성 완료 (MMS): ${savedDepartment.departmentName}`);
            return savedDepartment;
        } catch (error) {
            this.logger.error('부서 생성/업데이트 실패 (MMS)', error.stack);
            throw error;
        }
    }

    /**
     * 부서 저장
     */
    async saveDepartment(department: DepartmentInfoEntity): Promise<DepartmentInfoEntity> {
        try {
            const savedDepartment = await this.departmentRepository.save(department);
            this.logger.log(`부서 저장 완료: ${savedDepartment.departmentName}`);
            return savedDepartment;
        } catch (error) {
            this.logger.error('부서 저장 실패', error.stack);
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
     * 하위 부서 조회
     */
    async findChildDepartments(departmentId: string): Promise<DepartmentInfoEntity[]> {
        try {
            return await this.departmentRepository.find({
                where: { parentDepartmentId: departmentId },
                order: { departmentName: 'ASC' },
            });
        } catch (error) {
            this.logger.error(`하위 부서 조회 실패: ${departmentId}`, error.stack);
            throw error;
        }
    }

    /**
     * 상위 부서 조회
     */
    async findParentDepartment(departmentId: string): Promise<DepartmentInfoEntity | null> {
        try {
            const department = await this.findDepartmentById(departmentId);
            if (!department || !department.parentDepartmentId) {
                return null;
            }

            return await this.findDepartmentById(department.parentDepartmentId);
        } catch (error) {
            this.logger.error(`상위 부서 조회 실패: ${departmentId}`, error.stack);
            throw error;
        }
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

    /**
     * 부서 존재 여부 확인
     */
    async existsDepartment(departmentId: string): Promise<boolean> {
        try {
            const count = await this.departmentRepository.count({
                where: { departmentId },
            });
            return count > 0;
        } catch (error) {
            this.logger.error(`부서 존재 확인 실패: ${departmentId}`, error.stack);
            throw error;
        }
    }

    /**
     * 부서 코드 중복 확인
     */
    async existsDepartmentByCode(departmentCode: string, excludeId?: string): Promise<boolean> {
        const whereCondition: any = { departmentCode };
        if (excludeId) {
            whereCondition.departmentId = Not(excludeId);
        }

        const count = await this.departmentRepository.count({ where: whereCondition });
        return count > 0;
    }

    /**
     * 부서 이름 중복 확인
     */
    async existsDepartmentByName(departmentName: string, excludeId?: string): Promise<boolean> {
        const whereCondition: any = { departmentName };
        if (excludeId) {
            whereCondition.departmentId = Not(excludeId);
        }

        const count = await this.departmentRepository.count({ where: whereCondition });
        return count > 0;
    }

    async deleteDepartment(departmentId: string): Promise<void> {
        await this.departmentRepository.delete(departmentId);
    }
}
