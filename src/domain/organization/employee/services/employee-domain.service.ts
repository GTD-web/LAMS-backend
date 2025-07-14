import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not, IsNull } from 'typeorm';
import { EmployeeInfoEntity } from '../entities/employee-info.entity';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { MergedEmployeeInfo } from '@src/domain/excel/employee-excel-import.domain';

/**
 * 직원 도메인 서비스
 * - 직원 관련 핵심 도메인 로직을 처리
 * - 검증 로직 및 데이터 접근 통합 처리
 * - 도메인 규칙과 불변성을 보장
 */
@Injectable()
export class EmployeeDomainService {
    private readonly logger = new Logger(EmployeeDomainService.name);

    constructor(
        @InjectRepository(EmployeeInfoEntity)
        private readonly employeeRepository: Repository<EmployeeInfoEntity>,
    ) {}

    /**
     * 직원 생성
     */
    async createEmployee(employeeData: Partial<EmployeeInfoEntity>): Promise<EmployeeInfoEntity> {
        try {
            // 사번 중복 확인
            if (employeeData.employeeNumber) {
                const existingEmployee = await this.findEmployeeByEmployeeNumber(employeeData.employeeNumber);
                if (existingEmployee) {
                    throw new BadRequestException('이미 존재하는 사번입니다.');
                }
            }

            const employee = this.employeeRepository.create(employeeData);
            const savedEmployee = await this.employeeRepository.save(employee);
            this.logger.log(`직원 생성 완료: ${savedEmployee.employeeName} (${savedEmployee.employeeNumber})`);
            return savedEmployee;
        } catch (error) {
            this.logger.error('직원 생성 실패', error.stack);
            throw error;
        }
    }

    /**
     * 직원 정보 업데이트
     */
    async updateEmployee(employeeId: string, updateData: Partial<EmployeeInfoEntity>): Promise<EmployeeInfoEntity> {
        try {
            const employee = await this.findEmployeeById(employeeId);
            if (!employee) {
                throw new NotFoundException('직원을 찾을 수 없습니다.');
            }

            // 사번 중복 확인 (자신 제외)
            if (updateData.employeeNumber && updateData.employeeNumber !== employee.employeeNumber) {
                const existingEmployee = await this.findEmployeeByEmployeeNumber(updateData.employeeNumber);
                if (existingEmployee && existingEmployee.employeeId !== employeeId) {
                    throw new BadRequestException('이미 존재하는 사번입니다.');
                }
            }

            Object.assign(employee, updateData);
            const updatedEmployee = await this.employeeRepository.save(employee);
            this.logger.log(
                `직원 정보 업데이트 완료: ${updatedEmployee.employeeName} (${updatedEmployee.employeeNumber})`,
            );
            return updatedEmployee;
        } catch (error) {
            this.logger.error(`직원 정보 업데이트 실패: ${employeeId}`, error.stack);
            throw error;
        }
    }

    /**
     * 퇴사일 업데이트
     */
    async updateQuitedAt(
        employeeId: string,
        quitedAt: string,
    ): Promise<{ employeeInfoEntity: EmployeeInfoEntity; beforeEmployee: EmployeeInfoEntity }> {
        try {
            const employee = await this.findEmployeeById(employeeId);
            if (!employee) {
                throw new NotFoundException('직원을 찾을 수 없습니다.');
            }

            const beforeEmployee = JSON.parse(JSON.stringify(employee)) as EmployeeInfoEntity;

            // 비즈니스 규칙 검증: 퇴사일이 입사일 이후인지 확인
            if (employee.entryAt && quitedAt < employee.entryAt) {
                throw new BadRequestException('퇴사일은 입사일 이후여야 합니다.');
            }

            employee.quitedAt = quitedAt;
            const updatedEmployee = await this.employeeRepository.save(employee);

            this.logger.log(
                `퇴사일 업데이트 완료: ${updatedEmployee.employeeName}(${updatedEmployee.employeeNumber}) - 퇴사일: ${quitedAt}`,
            );
            return { employeeInfoEntity: updatedEmployee, beforeEmployee };
        } catch (error) {
            this.logger.error(`퇴사일 업데이트 실패: ${employeeId}`, error.stack);
            throw error;
        }
    }

    /**
     * 입사일 업데이트
     */
    async updateEntryAt(
        employeeId: string,
        entryAt: string,
    ): Promise<{ employeeInfoEntity: EmployeeInfoEntity; beforeEmployee: EmployeeInfoEntity }> {
        try {
            const employee = await this.findEmployeeById(employeeId);
            if (!employee) {
                throw new NotFoundException('직원을 찾을 수 없습니다.');
            }

            const beforeEmployee = JSON.parse(JSON.stringify(employee)) as EmployeeInfoEntity;

            // 비즈니스 규칙 검증: 입사일이 퇴사일 이전인지 확인
            if (employee.quitedAt && entryAt > employee.quitedAt) {
                throw new BadRequestException('입사일은 퇴사일 이전이어야 합니다.');
            }

            employee.entryAt = entryAt;
            const updatedEmployee = await this.employeeRepository.save(employee);

            this.logger.log(
                `입사일 업데이트 완료: ${updatedEmployee.employeeName}(${updatedEmployee.employeeNumber}) - 입사일: ${entryAt}`,
            );
            return { employeeInfoEntity: updatedEmployee, beforeEmployee };
        } catch (error) {
            this.logger.error(`입사일 업데이트 실패: ${employeeId}`, error.stack);
            throw error;
        }
    }

    /**
     * 생년월일 업데이트
     */
    async updateBirthDate(employeeId: string, birthDate: string): Promise<EmployeeInfoEntity> {
        try {
            const employee = await this.findEmployeeById(employeeId);
            if (!employee) {
                throw new NotFoundException('직원을 찾을 수 없습니다.');
            }

            // 생년월일 유효성 검증
            const birthDateObj = new Date(birthDate);
            const currentDate = new Date();

            if (birthDateObj >= currentDate) {
                throw new BadRequestException('생년월일은 현재 날짜 이전이어야 합니다.');
            }

            employee.birthDate = birthDate;
            const updatedEmployee = await this.employeeRepository.save(employee);

            this.logger.log(
                `생년월일 업데이트 완료: ${updatedEmployee.employeeName}(${updatedEmployee.employeeNumber}) - 생년월일: ${birthDate}`,
            );
            return updatedEmployee;
        } catch (error) {
            this.logger.error(`생년월일 업데이트 실패: ${employeeId}`, error.stack);
            throw error;
        }
    }

    /**
     * 직원 제외 토글
     */
    async toggleExcludeEmployee(employeeId: string): Promise<EmployeeInfoEntity> {
        try {
            const employee = await this.findEmployeeById(employeeId);
            if (!employee) {
                throw new NotFoundException('직원을 찾을 수 없습니다.');
            }

            employee.isExcludedFromCalculation = !employee.isExcludedFromCalculation;
            const updatedEmployee = await this.employeeRepository.save(employee);

            const status = updatedEmployee.isExcludedFromCalculation ? '제외' : '포함';
            this.logger.log(
                `직원 ${status} 처리 완료: ${updatedEmployee.employeeName}(${updatedEmployee.employeeNumber})`,
            );
            return updatedEmployee;
        } catch (error) {
            this.logger.error(`직원 제외 토글 실패: ${employeeId}`, error.stack);
            throw error;
        }
    }

    /**
     * 직원 삭제
     */
    async deleteEmployee(employeeId: string): Promise<boolean> {
        try {
            const employee = await this.findEmployeeById(employeeId);
            if (!employee) {
                throw new NotFoundException('직원을 찾을 수 없습니다.');
            }

            await this.employeeRepository.delete(employeeId);
            this.logger.log(`직원 삭제 완료: ${employee.employeeName}(${employee.employeeNumber})`);
            return true;
        } catch (error) {
            this.logger.error(`직원 삭제 실패: ${employeeId}`, error.stack);
            throw error;
        }
    }

    /**
     * 직원 일괄 날짜 업데이트
     */
    async updateEmployeeDates(
        employeeId: string,
        updateData: { entryAt?: string; quitedAt?: string },
    ): Promise<{ employeeInfoEntity: EmployeeInfoEntity; beforeEmployee: EmployeeInfoEntity }> {
        try {
            const employee = await this.findEmployeeById(employeeId);
            if (!employee) {
                throw new NotFoundException('직원을 찾을 수 없습니다.');
            }

            const beforeEmployee = JSON.parse(JSON.stringify(employee)) as EmployeeInfoEntity;

            // 입사일과 퇴사일 검증
            if (updateData.entryAt && updateData.quitedAt) {
                if (updateData.entryAt > updateData.quitedAt) {
                    throw new BadRequestException('입사일은 퇴사일 이전이어야 합니다.');
                }
            } else if (updateData.entryAt && employee.quitedAt) {
                if (updateData.entryAt > employee.quitedAt) {
                    throw new BadRequestException('입사일은 퇴사일 이전이어야 합니다.');
                }
            } else if (updateData.quitedAt && employee.entryAt) {
                if (employee.entryAt > updateData.quitedAt) {
                    throw new BadRequestException('퇴사일은 입사일 이후여야 합니다.');
                }
            }

            Object.assign(employee, updateData);
            const updatedEmployee = await this.employeeRepository.save(employee);

            this.logger.log(
                `직원 날짜 정보 업데이트 완료: ${updatedEmployee.employeeName}(${updatedEmployee.employeeNumber})`,
            );
            return { employeeInfoEntity: updatedEmployee, beforeEmployee };
        } catch (error) {
            this.logger.error(`직원 날짜 업데이트 실패: ${employeeId}`, error.stack);
            throw error;
        }
    }

    /**
     * 엑셀 직원 정보 업데이트
     */
    async updateEmployeeInfo(mergedEmployeeInfo: MergedEmployeeInfo): Promise<EmployeeInfoEntity | null> {
        try {
            const employee = await this.findEmployeeByEmployeeNumber(mergedEmployeeInfo.employeeNumber);
            if (!employee) {
                this.logger.warn(`직원을 찾을 수 없습니다: ${mergedEmployeeInfo.employeeNumber}`);
                return null;
            }

            // 엑셀 데이터로 직원 정보 업데이트
            const updateData: Partial<EmployeeInfoEntity> = {};

            if (mergedEmployeeInfo.employeeName) updateData.employeeName = mergedEmployeeInfo.employeeName;
            if (mergedEmployeeInfo.entryDate) updateData.entryAt = mergedEmployeeInfo.entryDate;
            if (mergedEmployeeInfo.birthDate) updateData.birthDate = mergedEmployeeInfo.birthDate;

            // 날짜 검증
            if (updateData.entryAt && updateData.quitedAt && updateData.entryAt > updateData.quitedAt) {
                throw new BadRequestException(`입사일이 퇴사일보다 늦습니다: ${mergedEmployeeInfo.employeeNumber}`);
            }

            Object.assign(employee, updateData);
            const updatedEmployee = await this.employeeRepository.save(employee);

            this.logger.log(
                `엑셀 직원 정보 업데이트 완료: ${updatedEmployee.employeeName}(${updatedEmployee.employeeNumber})`,
            );
            return updatedEmployee;
        } catch (error) {
            this.logger.error(`엑셀 직원 정보 업데이트 실패: ${mergedEmployeeInfo.employeeNumber}`, error.stack);
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
     * 사번으로 직원 조회
     */
    async findEmployeeByEmployeeNumber(employeeNumber: string): Promise<EmployeeInfoEntity | null> {
        return await this.employeeRepository.findOne({
            where: { employeeNumber },
            relations: ['department'],
        });
    }

    /**
     * 전체 직원 조회 (페이지네이션)
     */
    async findAllEmployees(
        query: PaginationQueryDto,
        isExclude?: boolean,
    ): Promise<{ employees: EmployeeInfoEntity[]; total: number }> {
        const [employees, total] = await this.employeeRepository.findAndCount({
            where: { isExcludedFromCalculation: isExclude },
            skip: (query.page - 1) * query.limit,
            take: query.limit,
            order: { employeeName: 'ASC' },
            relations: ['department'],
        });

        return { employees, total };
    }

    /**
     * 부서별 직원 조회 (퇴사자 제외)
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
     * 활성 직원 조회 (퇴사하지 않은 직원)
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
     * 직원 검색
     */
    async searchEmployees(searchTerm: string): Promise<EmployeeInfoEntity[]> {
        return await this.employeeRepository.find({
            where: [{ employeeName: Like(`%${searchTerm}%`) }, { employeeNumber: Like(`%${searchTerm}%`) }],
            relations: ['department'],
            order: { employeeName: 'ASC' },
        });
    }

    /**
     * 직원 존재 여부 확인
     */
    async existsEmployee(employeeId: string): Promise<boolean> {
        try {
            const count = await this.employeeRepository.count({
                where: { employeeId },
            });
            return count > 0;
        } catch (error) {
            this.logger.error(`직원 존재 확인 실패: ${employeeId}`, error.stack);
            throw error;
        }
    }

    /**
     * 사번 중복 확인
     */
    async existsByEmployeeNumber(employeeNumber: string, excludeId?: string): Promise<boolean> {
        const whereCondition: any = { employeeNumber };
        if (excludeId) {
            whereCondition.employeeId = Not(excludeId);
        }

        const count = await this.employeeRepository.count({ where: whereCondition });
        return count > 0;
    }
}
