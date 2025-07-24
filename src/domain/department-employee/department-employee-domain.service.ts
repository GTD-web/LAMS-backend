import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, FindOneOptions, FindOptionsWhere, In, Not, IsNull } from 'typeorm';
import { DepartmentEmployeeEntity } from './entities/department-employee.entity';
import { DepartmentInfoEntity } from '../department/entities/department-info.entity';
import { EmployeeInfoEntity } from '../employee/entities/employee-info.entity';
import { EmployeeResponseDto } from 'src/interfaces/dto/organization/responses/employee-response.dto';
import { plainToInstance } from 'class-transformer';
import { PaginatedResponseDto, PaginationMetaDto } from 'src/common/dtos/pagination/pagination-response.dto';
import { EmployeeSearchOptions } from './interfaces/employee-search-options.interface';
import { PaginationQueryDto } from 'src/common/dtos/pagination/pagination-query.dto';

/**
 * 부서-직원 관계 도메인 서비스
 * - 부서와 직원 간의 관계 관리
 * - 중간테이블 데이터 처리
 * - 관계 생성, 삭제, 조회 등의 핵심 로직
 */
@Injectable()
export class DepartmentEmployeeDomainService {
    private readonly logger = new Logger(DepartmentEmployeeDomainService.name);

    constructor(
        @InjectRepository(DepartmentEmployeeEntity)
        private readonly departmentEmployeeRepository: Repository<DepartmentEmployeeEntity>,
    ) {}

    /**
     * 부서-직원 관계 생성
     */
    async saveDepartmentEmployee(
        department: DepartmentInfoEntity,
        employee: EmployeeInfoEntity,
        queryRunner?: QueryRunner,
    ): Promise<DepartmentEmployeeEntity> {
        const repository = queryRunner
            ? queryRunner.manager.getRepository(DepartmentEmployeeEntity)
            : this.departmentEmployeeRepository;

        const departmentEmployee = repository.create({
            department,
            employee,
        });

        const savedRelation = await repository.save(departmentEmployee);
        return savedRelation;
    }

    /**
     * 직원 ID로 부서-직원 관계 삭제
     */
    async deleteDepartmentEmployeeByEmployeeId(employeeId: string, queryRunner?: QueryRunner): Promise<void> {
        const repository = queryRunner
            ? queryRunner.manager.getRepository(DepartmentEmployeeEntity)
            : this.departmentEmployeeRepository;
        await repository.delete({ employee: { employeeId } });
    }

    /**
     * 부서 ID로 부서-직원 관계 삭제
     */
    async deleteDepartmentEmployeeByDepartmentId(departmentId: string, queryRunner?: QueryRunner): Promise<void> {
        const repository = queryRunner
            ? queryRunner.manager.getRepository(DepartmentEmployeeEntity)
            : this.departmentEmployeeRepository;
        await repository.delete({ department: { departmentId } });
    }

    /**
     * 부서별 직원 관계 조회
     */
    async findDepartmentEmployeesByDepartmentId(departmentId: string): Promise<DepartmentEmployeeEntity[]> {
        const relations = await this.departmentEmployeeRepository.find({
            where: { department: { departmentId } },
            relations: ['department', 'employee'],
        });
        this.logger.log(`부서별 직원 관계 조회: ${departmentId} -> ${relations.length}개`);
        return relations;
    }

    /**
     * 직원별 부서 관계 조회
     */
    async findDepartmentEmployeesByEmployeeId(
        employeeId: string,
        queryRunner?: QueryRunner,
    ): Promise<DepartmentEmployeeEntity[]> {
        const repository = queryRunner
            ? queryRunner.manager.getRepository(DepartmentEmployeeEntity)
            : this.departmentEmployeeRepository;
        const relations = await repository.find({
            where: { employee: { employeeId } },
            relations: ['department', 'employee'],
        });
        return relations;
    }

    /**
     * 부서-직원 관계 존재 여부 확인
     */
    async existsDepartmentEmployee(departmentId: string, employeeId: string): Promise<boolean> {
        const count = await this.departmentEmployeeRepository.count({
            where: {
                department: { departmentId },
                employee: { employeeId },
            },
        });
        return count > 0;
    }

    /**
     * 여러 부서 ID로 직원 목록 조회 (중복 제거 포함, 필터링 적용)
     */
    async findAllEmployeesByDepartmentIds(
        departmentIds: string[],
        options?: EmployeeSearchOptions,
    ): Promise<EmployeeInfoEntity[]> {
        if (!departmentIds || departmentIds.length === 0) {
            return [];
        }

        // 중복 부서 ID 제거
        const uniqueDepartmentIds = [...new Set(departmentIds)];

        const allEmployees: EmployeeInfoEntity[] = [];

        // 각 부서별로 직원을 조회
        for (const departmentId of uniqueDepartmentIds) {
            const departmentEmployees = await this.findDepartmentEmployeesByDepartmentId(departmentId);
            const employees = departmentEmployees.map((departmentEmployee) => departmentEmployee.employee);
            allEmployees.push(...employees);
        }

        const findOption: FindOptionsWhere<DepartmentEmployeeEntity> = {
            department: { departmentId: In(uniqueDepartmentIds) },
        };

        if (options?.status === 'resigned') {
            findOption.employee = { quitedAt: Not(IsNull()) };
        } else if (options?.status === 'active') {
            findOption.employee = { quitedAt: IsNull() };
        }

        if (options?.excludeFromCalculation) {
            findOption.employee = { isExcludedFromCalculation: true };
        }

        const departmentEmployees = await this.departmentEmployeeRepository.find({
            where: findOption,
            relations: ['employee', 'department'],
        });

        const employees = departmentEmployees.map((departmentEmployee) => departmentEmployee.employee);

        // 중복 직원 제거 (한 직원이 여러 부서에 속할 수 있음)
        let uniqueEmployees = employees.filter(
            (employee, index, self) => index === self.findIndex((e) => e.employeeId === employee.employeeId),
        );

        return uniqueEmployees;
    }

    /**
     * 여러 부서 ID로 페이지네이션된 직원 목록 조회
     * 옵션을 통해 다양한 조건으로 필터링 가능
     */
    async findPaginatedEmployeesByDepartmentIds(
        departmentIds: string[],
        paginationQuery: PaginationQueryDto,

        options?: EmployeeSearchOptions,
    ): Promise<PaginatedResponseDto<EmployeeResponseDto>> {
        const { page = 1, limit = 10 } = paginationQuery;
        // 모든 고유 직원 조회 (필터링 포함)
        const allEmployees = await this.findAllEmployeesByDepartmentIds(departmentIds, options);

        // 페이지네이션 계산
        const totalCount = allEmployees.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        // 페이지네이션 적용
        const paginatedEmployees = allEmployees
            .slice(startIndex, endIndex)
            .map((employee) => plainToInstance(EmployeeResponseDto, employee));
        const meta = new PaginationMetaDto(page, limit, totalCount);
        return new PaginatedResponseDto(paginatedEmployees, meta);
    }

    /**
     * 직원의 부서 관계를 효율적으로 업데이트
     * - 기존 관계와 비교하여 변경이 필요한 경우에만 업데이트
     * - 불필요한 삭제/생성 작업을 방지
     */
    async updateEmployeeDepartmentRelation(
        employee: EmployeeInfoEntity,
        newDepartment: DepartmentInfoEntity,
        queryRunner?: QueryRunner,
    ): Promise<boolean> {
        // 기존 직원의 부서 관계 조회
        const existingRelations = await this.findDepartmentEmployeesByEmployeeId(employee.employeeId, queryRunner);

        // 기존 관계가 없는 경우 - 새로 생성
        if (existingRelations.length === 0) {
            await this.saveDepartmentEmployee(newDepartment, employee, queryRunner);
            return true;
        }

        // 기존 관계가 하나이고 동일한 부서인 경우 - 변경 없음
        if (
            existingRelations.length === 1 &&
            existingRelations[0].department.departmentId === newDepartment.departmentId
        ) {
            return false;
        }

        // 관계가 다른 경우 - 기존 관계 삭제 후 새로 생성
        await this.deleteDepartmentEmployeeByEmployeeId(employee.employeeId, queryRunner);
        await this.saveDepartmentEmployee(newDepartment, employee, queryRunner);
        return true;
    }

    /**
     * 여러 직원의 부서 관계를 배치로 효율적으로 업데이트
     */
    async batchUpdateEmployeeDepartmentRelations(
        updates: Array<{
            employee: EmployeeInfoEntity;
            department: DepartmentInfoEntity;
        }>,
    ): Promise<{ updated: number; skipped: number }> {
        let updatedCount = 0;
        let skippedCount = 0;

        for (const { employee, department } of updates) {
            const wasUpdated = await this.updateEmployeeDepartmentRelation(employee, department);
            if (wasUpdated) {
                updatedCount++;
            } else {
                skippedCount++;
            }
        }

        return { updated: updatedCount, skipped: skippedCount };
    }
}
