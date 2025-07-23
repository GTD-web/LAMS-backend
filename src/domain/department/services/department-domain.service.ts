import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindManyOptions, ILike } from 'typeorm';
import { DepartmentInfoEntity } from '../entities/department-info.entity';
import { MMSDepartmentResponseDto } from '../../../interfaces/dto/organization/requests/mms-department-import.dto';
import { PaginationMetaDto, PaginatedResponseDto } from '../../../common/dtos/pagination/pagination-response.dto';
import { DepartmentResponseDto } from '../../../interfaces/dto/organization/responses/department-response.dto';
import { plainToInstance } from 'class-transformer';

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
     * 부서 ID로 조회(예외처리)
     */
    async getDepartmentById(departmentCode: string): Promise<DepartmentInfoEntity | null> {
        const department = await this.departmentRepository.findOne({
            where: { departmentCode },
        });

        if (!department) {
            throw new NotFoundException('부서를 찾을 수 없습니다.');
        }

        return department;
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
    ): Promise<PaginatedResponseDto<DepartmentResponseDto>> {
        const whereCondition = isExclude !== undefined ? { isExclude } : {};
        const findOptions: FindManyOptions<DepartmentInfoEntity> = {
            where: whereCondition,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
            relations: ['employees', 'employees.employee'],
        };
        const [departments, total] = await this.departmentRepository.findAndCount(findOptions);

        const meta = new PaginationMetaDto(page, limit, total);
        const departmentDtos = departments.map((department) => plainToInstance(DepartmentResponseDto, department));
        const paginatedResult = new PaginatedResponseDto(departmentDtos, meta);

        this.logger.log(`페이지네이션된 부서 목록 조회: ${departments.length}개 조회`);
        return paginatedResult;
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
    async createOrUpdateDepartment(
        departmentData: MMSDepartmentResponseDto,
        parentDepartment?: DepartmentInfoEntity,
    ): Promise<DepartmentInfoEntity> {
        let department = await this.findDepartmentByMMSDepartmentId(departmentData.id);

        if (department) {
            // 기존 부서 업데이트
            department.departmentName = departmentData.department_name;
            department.departmentCode = departmentData.department_code;
        } else {
            // 새 부서 생성
            department = this.departmentRepository.create({
                departmentId: departmentData.id,
                departmentName: departmentData.department_name,
                departmentCode: departmentData.department_code,
            });
        }

        if (parentDepartment) {
            department.parent = parentDepartment;
        }

        // 하위 부서가 있으면 재귀적으로 처리
        if (departmentData.child_departments && departmentData.child_departments.length > 0) {
            for (const childDepartment of departmentData.child_departments) {
                await this.createOrUpdateDepartment(childDepartment, department);
            }
        }

        const savedDepartment = await this.departmentRepository.save(department);
        this.logger.log(`MMS 부서 생성: ${savedDepartment.departmentName}`);
        return savedDepartment;
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
     * 부서 검색 (복합 조건)
     */
    async searchDepartments(searchCriteria: {
        departmentName?: string;
        departmentCode?: string;
        isExclude?: boolean;
        keyword?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ departments: DepartmentInfoEntity[]; total: number }> {
        const { departmentName, departmentCode, isExclude, keyword, limit = 10, offset = 0 } = searchCriteria;

        // 검색 조건 구성
        const whereConditions: FindOptionsWhere<DepartmentInfoEntity>[] = [];

        // 키워드 통합 검색이 있는 경우
        if (keyword) {
            const keywordConditions: FindOptionsWhere<DepartmentInfoEntity> = {
                departmentName: ILike(`%${keyword}%`),
            };
            if (isExclude !== undefined) {
                keywordConditions.isExclude = isExclude;
            }
            whereConditions.push(keywordConditions);

            // 부서 코드로도 검색
            const codeConditions: FindOptionsWhere<DepartmentInfoEntity> = {
                departmentCode: ILike(`%${keyword}%`),
            };
            if (isExclude !== undefined) {
                codeConditions.isExclude = isExclude;
            }
            whereConditions.push(codeConditions);
        } else {
            // 개별 필드 검색
            const individualConditions: FindOptionsWhere<DepartmentInfoEntity> = {};

            if (departmentName) {
                individualConditions.departmentName = ILike(`%${departmentName}%`);
            }
            if (departmentCode) {
                individualConditions.departmentCode = ILike(`%${departmentCode}%`);
            }
            if (isExclude !== undefined) {
                individualConditions.isExclude = isExclude;
            }

            if (Object.keys(individualConditions).length > 0) {
                whereConditions.push(individualConditions);
            }
        }

        // 검색 조건이 없으면 전체 조회
        const findOptions: FindManyOptions<DepartmentInfoEntity> = {
            where: whereConditions.length > 0 ? whereConditions : isExclude !== undefined ? { isExclude } : undefined,
            order: { departmentName: 'ASC' },
            skip: offset,
            take: limit,
            relations: ['employees', 'employees.employee'],
        };

        // 총 개수와 데이터 조회
        const [departments, total] = await this.departmentRepository.findAndCount(findOptions);

        this.logger.log(`부서 검색 완료: ${departments.length}개 조회 (총 ${total}개)`);
        return { departments, total };
    }
}
