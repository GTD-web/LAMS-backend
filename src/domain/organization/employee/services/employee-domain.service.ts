import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not, IsNull, FindOptionsWhere, FindManyOptions, ILike } from 'typeorm';
import { EmployeeInfoEntity } from '../entities/employee-info.entity';

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
     * 직원 탈퇴 상태 토글
     */
    async toggleEmployeeExclude(employeeId: string): Promise<EmployeeInfoEntity> {
        try {
            const employee = await this.findEmployeeById(employeeId);
            if (!employee) {
                throw new NotFoundException('직원을 찾을 수 없습니다.');
            }

            employee.isExcludedFromCalculation = !employee.isExcludedFromCalculation;
            const updatedEmployee = await this.employeeRepository.save(employee);
            this.logger.log(
                `직원 탈퇴 상태 토글 완료: ${updatedEmployee.employeeName} (${updatedEmployee.isExcludedFromCalculation})`,
            );
            return updatedEmployee;
        } catch (error) {
            this.logger.error(`직원 탈퇴 상태 토글 실패: ${employeeId}`, error.stack);
            throw error;
        }
    }

    /**
     * 직원 ID로 조회
     */
    async findEmployeeById(employeeId: string): Promise<EmployeeInfoEntity | null> {
        return await this.employeeRepository.findOne({
            where: { employeeId },
            relations: ['department'],
        });
    }

    /**
     * 사원번호로 직원 조회
     */
    async findEmployeeByEmployeeNumber(employeeNumber: string): Promise<EmployeeInfoEntity | null> {
        return await this.employeeRepository.findOne({
            where: { employeeNumber },
            relations: ['department'],
        });
    }

    /**
     * 전체 직원 조회
     */
    async findAllEmployees(isExclude?: boolean): Promise<EmployeeInfoEntity[]> {
        const whereCondition = isExclude !== undefined ? { isExcludedFromCalculation: isExclude } : {};

        return await this.employeeRepository.find({
            where: whereCondition,
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
    }

    /**
     * 부서별 직원 조회 (퇴사 필터)
     */
    async findEmployeesByDepartmentWithQuitFilter(departmentId: string): Promise<EmployeeInfoEntity[]> {
        return await this.employeeRepository.find({
            where: {
                department: { departmentId },
                quitedAt: IsNull(),
            },
            relations: ['department'],
            order: { employeeName: 'ASC' },
        });
    }

    /**
     * 활성 직원 조회 (퇴사 직원 제외)
     */
    async findActiveEmployees(): Promise<EmployeeInfoEntity[]> {
        return await this.employeeRepository.find({
            where: { quitedAt: IsNull() },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });
    }

    /**
     * 퇴사 직원 조회
     */
    async findInactiveEmployees(): Promise<EmployeeInfoEntity[]> {
        return await this.employeeRepository.find({
            where: { quitedAt: Not(IsNull()) },
            relations: ['department'],
            order: { quitedAt: 'DESC' },
        });
    }

    /**
     * 직원 검색 (복합 조건)
     */
    async searchEmployeesWithCriteria(searchCriteria: {
        employeeName?: string;
        employeeNumber?: string;
        departmentId?: string;
        isExcludedFromCalculation?: boolean;
        keyword?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ employees: EmployeeInfoEntity[]; total: number }> {
        const {
            employeeName,
            employeeNumber,
            departmentId,
            isExcludedFromCalculation,
            keyword,
            limit = 10,
            offset = 0,
        } = searchCriteria;

        // 검색 조건 구성
        const whereConditions: FindOptionsWhere<EmployeeInfoEntity>[] = [];

        // 키워드 통합 검색이 있는 경우
        if (keyword) {
            const keywordConditions: FindOptionsWhere<EmployeeInfoEntity> = {
                employeeName: ILike(`%${keyword}%`),
            };
            if (isExcludedFromCalculation !== undefined) {
                keywordConditions.isExcludedFromCalculation = isExcludedFromCalculation;
            }
            if (departmentId) {
                keywordConditions.department = { departmentId };
            }
            whereConditions.push(keywordConditions);

            // 사원번호로도 검색
            const numberConditions: FindOptionsWhere<EmployeeInfoEntity> = {
                employeeNumber: ILike(`%${keyword}%`),
            };
            if (isExcludedFromCalculation !== undefined) {
                numberConditions.isExcludedFromCalculation = isExcludedFromCalculation;
            }
            if (departmentId) {
                numberConditions.department = { departmentId };
            }
            whereConditions.push(numberConditions);
        } else {
            // 개별 필드 검색
            const individualConditions: FindOptionsWhere<EmployeeInfoEntity> = {};

            if (employeeName) {
                individualConditions.employeeName = ILike(`%${employeeName}%`);
            }
            if (employeeNumber) {
                individualConditions.employeeNumber = ILike(`%${employeeNumber}%`);
            }
            if (departmentId) {
                individualConditions.department = { departmentId };
            }
            if (isExcludedFromCalculation !== undefined) {
                individualConditions.isExcludedFromCalculation = isExcludedFromCalculation;
            }

            if (Object.keys(individualConditions).length > 0) {
                whereConditions.push(individualConditions);
            }
        }

        // 검색 조건이 없으면 전체 조회
        const findOptions: FindManyOptions<EmployeeInfoEntity> = {
            where: whereConditions.length > 0 ? whereConditions : undefined,
            order: { employeeName: 'ASC' },
            skip: offset,
            take: limit,
            relations: ['department'],
        };

        // 총 개수와 데이터 조회
        const [employees, total] = await this.employeeRepository.findAndCount(findOptions);

        this.logger.log(`직원 검색 완료: ${employees.length}명 조회 (총 ${total}명)`);
        return { employees, total };
    }

    /**
     * 기존 직원 검색 메서드 (하위 호환성 유지)
     */
    async searchEmployees(searchTerm: string): Promise<EmployeeInfoEntity[]> {
        return await this.employeeRepository.find({
            where: [{ employeeName: Like(`%${searchTerm}%`) }, { employeeNumber: Like(`%${searchTerm}%`) }],
            relations: ['department'],
            order: { employeeName: 'ASC' },
        });
    }

    /**
     * 직원명으로 직원 검색
     */
    async searchEmployeesByName(employeeName: string): Promise<EmployeeInfoEntity[]> {
        if (!employeeName || employeeName.trim().length === 0) {
            throw new BadRequestException('직원명이 필요합니다.');
        }

        const employees = await this.employeeRepository.find({
            where: { employeeName: ILike(`%${employeeName}%`) },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });

        this.logger.log(`직원명 검색 완료: ${employees.length}명 조회`);
        return employees;
    }

    /**
     * 사원번호로 직원 검색
     */
    async searchEmployeesByNumber(employeeNumber: string): Promise<EmployeeInfoEntity[]> {
        if (!employeeNumber || employeeNumber.trim().length === 0) {
            throw new BadRequestException('사원번호가 필요합니다.');
        }

        const employees = await this.employeeRepository.find({
            where: { employeeNumber: ILike(`%${employeeNumber}%`) },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });

        this.logger.log(`사원번호 검색 완료: ${employees.length}명 조회`);
        return employees;
    }

    /**
     * 부서별 활성 직원 조회 (퇴사자 제외)
     */
    async findActiveEmployeesByDepartment(departmentId: string): Promise<EmployeeInfoEntity[]> {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new BadRequestException('부서 ID가 필요합니다.');
        }

        const employees = await this.employeeRepository.find({
            where: {
                department: { departmentId },
                quitedAt: IsNull(),
            },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });

        this.logger.log(`부서별 활성 직원 조회 완료: ${employees.length}명 조회`);
        return employees;
    }

    /**
     * 계산 제외되지 않은 직원 조회
     */
    async findIncludedEmployees(): Promise<EmployeeInfoEntity[]> {
        const employees = await this.employeeRepository.find({
            where: { isExcludedFromCalculation: false },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });

        this.logger.log(`계산 포함 직원 조회 완료: ${employees.length}명 조회`);
        return employees;
    }

    /**
     * 계산 제외된 직원 조회
     */
    async findExcludedEmployees(): Promise<EmployeeInfoEntity[]> {
        const employees = await this.employeeRepository.find({
            where: { isExcludedFromCalculation: true },
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });

        this.logger.log(`계산 제외 직원 조회 완료: ${employees.length}명 조회`);
        return employees;
    }

    /**
     * 직원 저장
     */
    async saveEmployee(employee: EmployeeInfoEntity): Promise<EmployeeInfoEntity> {
        return await this.employeeRepository.save(employee);
    }
}
