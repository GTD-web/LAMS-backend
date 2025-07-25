import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull, ILike, QueryRunner, In, Not } from 'typeorm';
import { EmployeeInfoEntity } from '../entities/employee-info.entity';
import { MMSEmployeeData } from '../interfaces/mms-employee-data.interface';
import { EmployeeFilterQueryDto } from '../../../interfaces/controllers/organization/dto/employee-filter-query.dto';
import { PaginatedResponseDto } from 'src/common/dtos/pagination/pagination-response.dto';
import { plainToInstance } from 'class-transformer';
import { EmployeeResponseDto } from '../../../business/organization/dto/employee-response.dto';

/**
 * 직원 도메인 서비스
 * - 직원 관련 핵심 도메인 로직을 처리
 * - 검증로직 및 데이터 접근 통합 처리
 * - 도메인 규칙의 불변성을 보장
 */
@Injectable()
export class EmployeeDomainService {
    private readonly logger = new Logger(EmployeeDomainService.name);

    constructor(
        @InjectRepository(EmployeeInfoEntity)
        private readonly employeeRepository: Repository<EmployeeInfoEntity>,
    ) {}

    /**
     * 직원 제외 상태 토글
     */
    async toggleEmployeeExclude(employeeId: string): Promise<EmployeeInfoEntity> {
        const employee = await this.findEmployeeById(employeeId);
        if (!employee) {
            throw new NotFoundException('직원을 찾을 수 없습니다.');
        }

        employee.isExcludedFromCalculation = !employee.isExcludedFromCalculation;
        const updatedEmployee = await this.employeeRepository.save(employee);

        return updatedEmployee;
    }

    /**
     * 직원 ID로 조회
     */
    async findEmployeeById(employeeId: string): Promise<EmployeeInfoEntity | null> {
        return await this.employeeRepository.findOne({
            where: { employeeId },
        });
    }

    /**
     * 사원번호로 직원 조회
     */
    async findEmployeeByEmployeeNumber(
        employeeNumber: string,
        queryRunner?: QueryRunner,
    ): Promise<EmployeeInfoEntity | null> {
        const repository = queryRunner
            ? queryRunner.manager.getRepository(EmployeeInfoEntity)
            : this.employeeRepository;
        return await repository.findOne({
            where: { employeeNumber },
        });
    }

    /**
     * 기존 직원 검색 메서드 (하위 호환성 유지)
     */
    async searchEmployees(searchTerm: string): Promise<EmployeeInfoEntity[]> {
        return await this.employeeRepository.find({
            where: [{ employeeName: Like(`%${searchTerm}%`) }, { employeeNumber: Like(`%${searchTerm}%`) }],
            order: { employeeName: 'ASC' },
        });
    }

    /**
     * 사원번호로 직원 검색
     */
    async searchEmployeesByNumber(employeeNumber: string): Promise<EmployeeInfoEntity[]> {
        const employees = await this.employeeRepository.find({
            where: { employeeNumber: ILike(`%${employeeNumber}%`) },
            order: { employeeName: 'ASC' },
        });

        this.logger.log(`사원번호 검색 완료: ${employees.length}명 조회`);
        return employees;
    }

    /**
     * 직원 저장
     */
    async saveEmployee(employee: EmployeeInfoEntity, queryRunner?: QueryRunner): Promise<EmployeeInfoEntity> {
        const repository = queryRunner
            ? queryRunner.manager.getRepository(EmployeeInfoEntity)
            : this.employeeRepository;
        return await repository.save(employee);
    }

    /**
     * MMS 데이터와 비교하여 직원을 업데이트한다
     */
    async updateEmployeeFromMMSData(
        mmsEmployee: MMSEmployeeData,
        queryRunner?: QueryRunner,
    ): Promise<EmployeeInfoEntity> {
        // 기존 직원 조회 (사원번호로)
        const existingEmployee = await this.findEmployeeByEmployeeNumber(mmsEmployee.employee_number, queryRunner);

        if (existingEmployee) {
            // 기존 직원 업데이트
            existingEmployee.employeeName = mmsEmployee.name;
            existingEmployee.email = mmsEmployee.email;
            existingEmployee.entryAt = mmsEmployee.hire_date ? mmsEmployee.hire_date.split('T')[0] : null;
            existingEmployee.quitedAt = mmsEmployee.termination_date
                ? mmsEmployee.termination_date.split('T')[0]
                : null;

            return await this.saveEmployee(existingEmployee, queryRunner);
        } else {
            // 새 직원 생성
            const newEmployee = this.employeeRepository.create({
                employeeNumber: mmsEmployee.employee_number,
                employeeName: mmsEmployee.name,
                email: mmsEmployee.email,
                entryAt: mmsEmployee.hire_date ? mmsEmployee.hire_date.split('T')[0] : null,
                quitedAt: mmsEmployee.termination_date ? mmsEmployee.termination_date.split('T')[0] : null,
                isExcludedFromCalculation: false,
            });

            return await this.saveEmployee(newEmployee, queryRunner);
        }
    }

    /**
     * 직원 ID 목록으로 페이지네이션된 직원 정보 조회 및 필터링 (Domain에서 페이지네이션 처리)
     */
    async findPaginatedEmployeesByIdsWithFiltering(
        employeeIds: string[],
        paginationQuery: { page?: number; limit?: number },
        filterQuery?: EmployeeFilterQueryDto,
    ): Promise<PaginatedResponseDto<EmployeeResponseDto>> {
        const { page = 1, limit = 10 } = paginationQuery;

        if (!employeeIds || employeeIds.length === 0) {
            return PaginatedResponseDto.create([], page, limit, 0);
        }

        // 기본 조건: 직원 ID 목록
        let whereConditions: any = {
            employeeId: In(employeeIds),
        };

        // 필터링 옵션 적용
        if (filterQuery?.status === 'resigned') {
            whereConditions.quitedAt = Not(IsNull());
        } else if (filterQuery?.status === 'active') {
            whereConditions.quitedAt = IsNull();
        }

        if (filterQuery?.excludeFromCalculation) {
            whereConditions.isExcludedFromCalculation = true;
        }

        const employees = await this.employeeRepository.find({
            where: whereConditions,
            skip: (page - 1) * limit,
            take: limit,
        });
        const employeeDtos = employees.map((employee) => plainToInstance(EmployeeResponseDto, employee));
        const totalCount = await this.employeeRepository.count({ where: whereConditions });

        return PaginatedResponseDto.create(employeeDtos, page, limit, totalCount);
    }
}
