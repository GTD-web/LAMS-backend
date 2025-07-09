import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { EmployeeInfoEntity } from '../entities/employee-info.entity';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';

/**
 * 직원 도메인 리포지토리 구현체
 * - 직원 엔티티에 대한 데이터 접근 로직을 구현
 * - 트랜잭션 처리 및 복잡한 쿼리 로직 포함
 */
@Injectable()
export class EmployeeDomainRepository {
    constructor(
        @InjectRepository(EmployeeInfoEntity)
        private readonly employeeRepository: Repository<EmployeeInfoEntity>,
    ) {}

    /**
     * 직원 ID로 조회
     */
    async findByEmployeeId(employeeId: string): Promise<EmployeeInfoEntity | null> {
        if (!employeeId) return null;

        return this.employeeRepository.findOne({
            where: { employeeId },
            relations: ['department', 'departments'],
        });
    }

    /**
     * 사번으로 조회
     */
    async findByEmployeeNumber(employeeNumber: string): Promise<EmployeeInfoEntity | null> {
        if (!employeeNumber) return null;

        return this.employeeRepository.findOne({
            where: { employeeNumber },
            relations: ['department', 'departments'],
        });
    }
    /**
     * 직원 정보 업데이트 (트랜잭션)
     */
    async updateEmployee(employeeId: string, updateData: Partial<EmployeeInfoEntity>): Promise<EmployeeInfoEntity> {
        return this.employeeRepository.manager.transaction(async (manager: EntityManager) => {
            const employeeRepo = manager.getRepository(EmployeeInfoEntity);

            const employee = await employeeRepo.findOne({ where: { employeeId } });
            if (!employee) {
                throw new Error('해당 직원을 찾을 수 없습니다.');
            }

            const updatedEmployee = employeeRepo.merge(employee, updateData);
            return await employeeRepo.save(updatedEmployee);
        });
    }

    /**
     * 직원 삭제 (트랜잭션)
     */
    async deleteEmployee(employeeId: string): Promise<boolean> {
        return this.employeeRepository.manager.transaction(async (manager: EntityManager) => {
            const employeeRepo = manager.getRepository(EmployeeInfoEntity);

            const employee = await employeeRepo.findOne({ where: { employeeId } });
            if (!employee) {
                throw new Error('해당 직원을 찾을 수 없습니다.');
            }

            await employeeRepo.remove(employee);
            return true;
        });
    }

    /**
     * 모든 직원 조회 (페이지네이션)
     */
    async findAndCount(query: PaginationQueryDto): Promise<{ employees: EmployeeInfoEntity[]; total: number }> {
        const { page, limit } = query;
        const offset = (page - 1) * limit;

        const [employees, total] = await this.employeeRepository.findAndCount({
            skip: offset,
            take: limit,
            relations: ['department', 'departments'],
            order: { entryAt: 'ASC' },
        });

        return { employees, total };
    }

    /**
     * 부서별 직원 조회 (퇴사일 필터링 포함)
     */
    async findEmployeesByDepartmentWithQuitFilter(departmentId: string): Promise<EmployeeInfoEntity[]> {
        const employees = await this.employeeRepository.find({
            where: {
                department: { departmentId },
                isExcludedFromCalculation: false,
            },
        });

        // 퇴사일 필터링 로직
        const currentDate = new Date();
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        return employees.filter((employee) => {
            if (!employee.quitedAt) return true;
            const quitDate = new Date(employee.quitedAt);
            return quitDate <= endOfMonth;
        });
    }
}
