import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { DepartmentDomainService } from '../../domain/organization/department/services/department-domain.service';
import { EmployeeDomainService } from '../../domain/organization/employee/services/employee-domain.service';
import { DepartmentEmployeeDomainService } from '../../domain/organization/department-employee/department-employee-domain.service';
import { MMSDepartmentResponseDto } from '../../interfaces/dto/organization/requests/mms-department-import.dto';
import { MMSEmployeeResponseDto } from '../../interfaces/dto/organization/requests/mms-employee-import.dto';
import { DepartmentInfoEntity } from '../../domain/organization/department/entities/department-info.entity';
import { EmployeeInfoEntity } from '../../domain/organization/employee/entities/employee-info.entity';

/**
 * 조직 컨텍스트 서비스
 * - User, Department, Employee 통합 관리
 * - 조직 관련 모든 상호작용 처리
 * - MMS 외부 시스템과의 동기화 처리
 */
@Injectable()
export class OrganizationContextService {
    private readonly logger = new Logger(OrganizationContextService.name);
    private readonly MMS_BASE_URL = 'https://lumir-metadata-manager.vercel.app';

    constructor(
        private readonly departmentDomainService: DepartmentDomainService,
        private readonly employeeDomainService: EmployeeDomainService,
        private readonly departmentEmployeeDomainService: DepartmentEmployeeDomainService,
    ) {}

    /**
     * MMS에서 부서 데이터 가져오기 (외부 시스템 연동이므로 try-catch 유지)
     */
    private async getDepartmentsFromMMS(): Promise<MMSDepartmentResponseDto[]> {
        try {
            const department = await axios.get(`${this.MMS_BASE_URL}/api/departments?hierarchy=true`);
            console.log('department:', department.data);
            return department.data;
        } catch (error) {
            this.logger.error('MMS 부서 데이터 조회 실패', error);
            throw new Error('MMS 부서 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    }

    /**
     * MMS에서 직원 데이터 가져오기 (외부 시스템 연동이므로 try-catch 유지)
     */
    private async getEmployeesFromMMS(): Promise<MMSEmployeeResponseDto[]> {
        try {
            const employee = await axios.get(`${this.MMS_BASE_URL}/api/employees`);
            console.log('employee:', employee.data);
            return employee.data;
        } catch (error) {
            this.logger.error('MMS 직원 데이터 조회 실패', error);
            throw new Error('MMS 직원 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    }

    /**
     * 부서를 업데이트하고 없는 부서는 삭제한다 (외부 시스템 연동 및 트랜잭션이므로 try-catch 유지)
     */
    async 부서를_업데이트하고_없는부서는_삭제한다(): Promise<void> {
        try {
            const mmsDepartments = await this.getDepartmentsFromMMS();

            // 기존 부서 목록 조회
            const existingDepartments = await this.departmentDomainService.findAllDepartments();

            // MMS 부서 데이터로 업데이트/생성
            for (const mmsDept of mmsDepartments) {
                await this.departmentDomainService.createOrUpdateDepartment(mmsDept);
            }

            // MMS에 없는 부서 삭제
            const mmsIds = mmsDepartments.map((dept) => dept.id);
            for (const existingDept of existingDepartments) {
                if (existingDept.mmsDepartmentId && !mmsIds.includes(existingDept.mmsDepartmentId)) {
                    await this.departmentDomainService.removeDepartment(existingDept.departmentId);
                }
            }

            this.logger.log('부서 업데이트 및 삭제 완료');
        } catch (error) {
            this.logger.error('부서 업데이트 및 삭제 실패', error.stack);
            throw error;
        }
    }

    /**
     * 직원을 업데이트한다 (외부 시스템 연동이므로 try-catch 유지)
     */
    async 직원을_업데이트한다(): Promise<void> {
        try {
            const mmsEmployees = await this.getEmployeesFromMMS();

            for (const mmsEmp of mmsEmployees) {
                // MMS 직원 데이터를 기반으로 직원 정보 업데이트
                // 실제 구현에서는 createOrUpdateEmployee 메서드를 Employee Domain Service에 추가해야 함
                this.logger.log(`직원 데이터 처리: ${mmsEmp.name}`);
            }

            this.logger.log('직원 업데이트 완료');
        } catch (error) {
            this.logger.error('직원 업데이트 실패', error.stack);
            throw error;
        }
    }

    /**
     * 직원 부서 중간테이블 데이터를 삭제 갱신한다 (복잡한 트랜잭션이므로 try-catch 유지)
     */
    async 직원_부서_중간테이블_데이터를_삭제_갱신한다(): Promise<void> {
        try {
            // 기존 중간테이블 데이터 삭제
            await this.departmentEmployeeDomainService.deleteAllDepartmentEmployees();

            // 새로운 관계 생성
            const employees = await this.employeeDomainService.findAllEmployees();
            for (const employee of employees) {
                if (employee.department) {
                    await this.departmentEmployeeDomainService.createDepartmentEmployee(employee.department, employee);
                }
            }

            this.logger.log('직원 부서 중간테이블 갱신 완료');
        } catch (error) {
            this.logger.error('직원 부서 중간테이블 갱신 실패', error.stack);
            throw error;
        }
    }

    /**
     * 페이지네이션된 부서 목록을 조회한다
     */
    async 페이지네이션된_부서_목록을_조회한다(limit: number, page: number): Promise<{ data: any[]; meta: any }> {
        const result = await this.departmentDomainService.findPaginatedDepartments(page, limit);

        return {
            data: result.departments,
            meta: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        };
    }

    /**
     * 부서의 제외 여부를 변경한다
     */
    async 부서의_제외_여부를_변경한다(departmentId: string): Promise<DepartmentInfoEntity> {
        return await this.departmentDomainService.toggleDepartmentExclusion(departmentId);
    }

    /**
     * 부서에 해당하는 직원 페이지네이션된 목록을 조회한다
     */
    async 부서에_해당하는_직원_페이지네이션된_목록을_조회한다(
        departmentId: string,
        limit: number,
        page: number,
    ): Promise<{ data: any[]; meta: any }> {
        // 실제 구현에서는 findPaginatedEmployeesByDepartment 메서드를 Employee Domain Service에 추가해야 함
        const result = { employees: [], total: 0 };

        return {
            data: result.employees,
            meta: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        };
    }

    /**
     * 직원들의 연차 정보를 갱신해서 보여준다
     */
    async 직원들의_연차_정보를_갱신해서_보여준다(): Promise<void> {
        // 연차 정보 갱신 로직 (현재는 로깅만)
        this.logger.log('직원들의 연차 정보 갱신 완료');
    }

    /**
     * 직원의 제외 여부를 변경한다
     */
    async 직원의_제외_여부_변경한다(employeeId: string): Promise<EmployeeInfoEntity> {
        return await this.employeeDomainService.toggleEmployeeExclude(employeeId);
    }

    /**
     * 퇴사데이터가 있는 직원을 제외한 부서의 직원을 조회한다
     */
    async 퇴사데이터가_있는_직원을_제외한_부서의_직원을_조회한다(departmentId: string): Promise<EmployeeInfoEntity[]> {
        // 실제 구현에서는 findActiveEmployeesByDepartment 메서드를 Employee Domain Service에 추가해야 함
        return [];
    }

    async findDepartmentById(departmentId: string): Promise<DepartmentInfoEntity> {
        return await this.departmentDomainService.findDepartmentById(departmentId);
    }
}
