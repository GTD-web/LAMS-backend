import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, In } from 'typeorm';
import { DepartmentEmployeeEntity } from './entities/department-employee.entity';

/**
 * 부서-직원 관계 도메인 서비스
 * - 부서와 직원 간의 관계 관리
 * - 중간테이블 데이터 처리
 * - 관계 생성, 삭제, 조회 등의 핵심 로직 (자신의 repository만 사용)
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
        departmentId: string,
        employeeId: string,
        queryRunner?: QueryRunner,
    ): Promise<DepartmentEmployeeEntity> {
        const repository = queryRunner
            ? queryRunner.manager.getRepository(DepartmentEmployeeEntity)
            : this.departmentEmployeeRepository;

        const departmentEmployee = repository.create({
            departmentId,
            employeeId,
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
        await repository.delete({ employeeId });
    }

    /**
     * 부서 ID로 부서-직원 관계 삭제
     */
    async deleteDepartmentEmployeeByDepartmentId(departmentId: string, queryRunner?: QueryRunner): Promise<void> {
        const repository = queryRunner
            ? queryRunner.manager.getRepository(DepartmentEmployeeEntity)
            : this.departmentEmployeeRepository;
        await repository.delete({ departmentId });
    }

    /**
     * 부서별 직원 관계 조회 (직원 ID 목록만 반환)
     */
    async findEmployeeIdsByDepartmentId(departmentId: string): Promise<string[]> {
        const relations = await this.departmentEmployeeRepository.find({
            where: { departmentId },
        });
        this.logger.log(`부서별 직원 관계 조회: ${departmentId} -> ${relations.length}개`);
        return relations.map((relation) => relation.employeeId);
    }

    /**
     * 여러 부서 ID로 직원 ID 목록 조회 (중복 제거)
     */
    async findEmployeeIdsByDepartmentIds(departmentIds: string[]): Promise<string[]> {
        if (!departmentIds || departmentIds.length === 0) {
            return [];
        }

        const uniqueDepartmentIds = [...new Set(departmentIds)];
        const departmentEmployees = await this.departmentEmployeeRepository.find({
            where: { departmentId: In(uniqueDepartmentIds) },
        });
        // 중복 직원 ID 제거
        const uniqueEmployeeIds = [...new Set(departmentEmployees.map((de) => de.employeeId))];
        return uniqueEmployeeIds;
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
            where: { employeeId },
        });
        return relations;
    }

    /**
     * 부서-직원 관계 존재 여부 확인
     */
    async existsDepartmentEmployee(departmentId: string, employeeId: string): Promise<boolean> {
        const count = await this.departmentEmployeeRepository.count({
            where: {
                departmentId,
                employeeId,
            },
        });
        return count > 0;
    }

    /**
     * 직원과 부서 간의 관계를 효율적으로 업데이트 (기존과 비교하여 변경사항만 처리)
     */
    async updateEmployeeDepartmentRelation(
        employeeId: string,
        newDepartmentId: string,
        queryRunner?: QueryRunner,
    ): Promise<boolean> {
        // 기존 관계 조회
        const existingRelations = await this.findDepartmentEmployeesByEmployeeId(employeeId, queryRunner);

        // 기존 관계가 새로운 부서 ID와 동일한지 확인
        if (existingRelations.length === 1 && existingRelations[0].departmentId === newDepartmentId) {
            // 변경사항 없음
            return false;
        }

        // 기존 관계 삭제
        await this.deleteDepartmentEmployeeByEmployeeId(employeeId, queryRunner);

        // 새로운 관계 생성
        await this.saveDepartmentEmployee(newDepartmentId, employeeId, queryRunner);

        return true;
    }

    /**
     * 여러 직원의 부서 관계를 일괄 업데이트
     */
    async batchUpdateEmployeeDepartmentRelations(
        employeeDepartmentMappings: Array<{ employeeId: string; departmentId: string }>,
        queryRunner?: QueryRunner,
    ): Promise<{ updated: number; skipped: number }> {
        let updatedCount = 0;
        let skippedCount = 0;

        for (const mapping of employeeDepartmentMappings) {
            const wasUpdated = await this.updateEmployeeDepartmentRelation(
                mapping.employeeId,
                mapping.departmentId,
                queryRunner,
            );

            if (wasUpdated) {
                updatedCount++;
            } else {
                skippedCount++;
            }
        }

        return { updated: updatedCount, skipped: skippedCount };
    }
}
