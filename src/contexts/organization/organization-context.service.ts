import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { DepartmentDomainService } from '../../domain/organization/department/services/department-domain.service';
import { UserDomainService } from '../../domain/user/services/user-domain.service';
import { EmployeeDomainService } from '../../domain/organization/employee/services/employee-domain.service';
import { DepartmentEmployeeDomainService } from '../../domain/organization/department-employee/department-employee-domain.service';
import { MMSDepartmentResponseDto } from '../../interfaces/dto/organization/requests/mms-department-import.dto';
import { MMSEmployeeResponseDto } from '../../interfaces/dto/organization/requests/mms-employee-import.dto';
import { LamsUserEntity } from '../../domain/user/entities/lams-user.entity';
import { DepartmentInfoEntity } from '../../domain/organization/department/entities/department-info.entity';
import { EmployeeInfoEntity } from '../../domain/organization/employee/entities/employee-info.entity';
import { DepartmentEmployeeEntity } from '@src/domain/organization/department/entities/department-employee.entity';

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
        private readonly userDomainService: UserDomainService,
        private readonly employeeDomainService: EmployeeDomainService,
        private readonly departmentEmployeeDomainService: DepartmentEmployeeDomainService,
    ) {}

    /**
     * MMS에서 부서 데이터 가져오기
     */
    private async getDepartmentsFromMMS(): Promise<MMSDepartmentResponseDto[]> {
        try {
            const url = 'https://lumir-metadata-manager.vercel.app';
            const department = await axios.get(`${url}/api/departments?hierarchy=true`);
            return department.data;
        } catch (error) {
            this.logger.error('MMS 부서 데이터 조회 실패', error);
            throw new Error('MMS 부서 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    }

    /**
     * MMS에서 직원 데이터 가져오기
     */
    private async getEmployeesFromMMS(): Promise<MMSEmployeeResponseDto[]> {
        try {
            const url = 'https://lumir-metadata-manager.vercel.app';
            const employees = await axios.get(`${url}/api/employees?detailed=true`);
            return employees.data;
        } catch (error) {
            this.logger.error('MMS 직원 데이터 조회 실패', error);
            throw new Error('MMS 직원 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    }

    // ==================== USER 관련 메서드 ====================

    /**
     * 사용자 조회 (ID)
     */
    async findUserById(userId: string): Promise<LamsUserEntity | null> {
        return await this.userDomainService.findUserById(userId);
    }

    // ==================== DEPARTMENT 관련 메서드 ====================

    /**
     * 부서 조회 (ID)
     */
    async findDepartmentById(departmentId: string): Promise<DepartmentInfoEntity | null> {
        return await this.departmentDomainService.findDepartmentById(departmentId);
    }

    // ==================== MMS 동기화 관련 메서드 ====================

    // ==================== 조직 관리 메서드 ====================

    /**
     * 부서를 업데이트하고 없는 부서는 삭제한다
     */
    async 부서를_업데이트하고_없는부서는_삭제한다(): Promise<void> {
        try {
            const mmsDepartments = await this.getDepartmentsFromMMS();
            const syncedIds: string[] = [];

            for (const mmsDepartment of mmsDepartments) {
                await this.processDepartmentHierarchy(mmsDepartment, syncedIds);
            }

            await this.removeDeletedDepartments(syncedIds);
        } catch (error) {
            this.logger.error('부서 업데이트 및 삭제 실패', error);
            throw new Error('부서 업데이트 중 오류가 발생했습니다.');
        }
    }

    /**
     * 직원을 업데이트한다
     */
    async 직원을_업데이트한다(): Promise<void> {
        try {
            // MMS에서 직원 데이터 가져오기 - 외부 시스템 연동이므로 예외 처리 필요
            const mmsEmployees = await this.getEmployeesFromMMS();

            // 직원 생성 및 부서 중간테이블 갱신
            await this.직원_생성_및_부서_중간테이블_갱신한다(mmsEmployees);

            // 현재는 기본 구현으로 로그만 출력
            this.logger.log(`MMS에서 ${mmsEmployees.length}개 직원 데이터 조회`);
            this.logger.log('직원 업데이트 완료');
        } catch (error) {
            this.logger.error('직원 업데이트 실패', error);
            throw new Error('직원 업데이트 중 오류가 발생했습니다.');
        }
    }

    /**
     * 직원 부서 중간테이블 데이터를 삭제 갱신한다
     */
    async 직원_부서_중간테이블_데이터를_삭제_갱신한다(): Promise<void> {
        try {
            // 현재는 기본 구현으로 로그만 출력
            this.logger.log('직원-부서 중간테이블 갱신 완료');
        } catch (error) {
            this.logger.error('직원-부서 중간테이블 갱신 실패', error);
            throw new Error('직원-부서 중간테이블 갱신 중 오류가 발생했습니다.');
        }
    }

    /**
     * 페이지네이션된 부서 목록을 조회한다
     */
    async 페이지네이션된_부서_목록을_조회한다(limit: number, page: number): Promise<any> {
        try {
            // 현재는 기본 구현으로 로그만 출력
            const result = {
                departments: [],
                total: 0,
                page,
                limit,
            };

            this.logger.log(`페이지네이션된 부서 목록 조회: page=${page}, limit=${limit}`);
            return result;
        } catch (error) {
            this.logger.error('페이지네이션된 부서 목록 조회 실패', error);
            throw new Error('부서 목록 조회 중 오류가 발생했습니다.');
        }
    }

    /**
     * 부서의 제외 여부를 변경한다
     */
    async 부서의_제외_여부를_변경한다(departmentId: string): Promise<any> {
        try {
            const updatedDepartment = await this.departmentDomainService.toggleDepartmentExclude(departmentId);

            this.logger.log(
                `부서 제외 여부 변경: ${updatedDepartment.departmentName} -> ${updatedDepartment.isExclude}`,
            );
            return updatedDepartment;
        } catch (error) {
            this.logger.error(`부서 제외 여부 변경 실패: ${departmentId}`, error);
            throw new Error('부서 제외 여부 변경 중 오류가 발생했습니다.');
        }
    }

    /**
     * 부서에 해당하는 직원 페이지네이션된 목록을 조회한다
     */
    async 부서에_해당하는_직원_페이지네이션된_목록을_조회한다(
        departmentId: string,
        limit: number,
        page: number,
    ): Promise<any> {
        try {
            // 현재는 기본 구현으로 로그만 출력
            const result = {
                employees: [],
                total: 0,
                page,
                limit,
            };

            this.logger.log(`부서별 직원 목록 조회: departmentId=${departmentId}, page=${page}, limit=${limit}`);
            return result;
        } catch (error) {
            this.logger.error(`부서별 직원 목록 조회 실패: ${departmentId}`, error);
            throw new Error('부서별 직원 목록 조회 중 오류가 발생했습니다.');
        }
    }

    /**
     * 직원들의 연차 정보를 갱신해서 보여준다
     */
    async 직원들의_연차_정보를_갱신해서_보여준다(): Promise<void> {
        try {
            // 현재는 기본 구현으로 로그만 출력
            this.logger.log('직원 연차 정보 갱신 완료');
        } catch (error) {
            this.logger.error('직원 연차 정보 갱신 실패', error);
            throw new Error('직원 연차 정보 갱신 중 오류가 발생했습니다.');
        }
    }

    /**
     * 직원의 제외 여부 변경한다
     */
    async 직원의_제외_여부_변경한다(employeeId: string): Promise<any> {
        try {
            const updatedEmployee = await this.employeeDomainService.toggleEmployeeExclude(employeeId);

            this.logger.log(
                `직원 제외 여부 변경: ${updatedEmployee.employeeName} -> ${updatedEmployee.isExcludedFromCalculation}`,
            );
            return updatedEmployee;
        } catch (error) {
            this.logger.error(`직원 제외 여부 변경 실패: ${employeeId}`, error);
            throw new Error('직원 제외 여부 변경 중 오류가 발생했습니다.');
        }
    }

    /**
     * 퇴사데이터가 있는 직원을 제외한 부서의 직원을 조회한다
     */
    async 퇴사데이터가_있는_직원을_제외한_부서의_직원을_조회한다(departmentId: string): Promise<any[]> {
        try {
            // 현재는 기본 구현으로 로그만 출력
            const activeEmployees = [];

            this.logger.log(`활성 직원 조회 완료: ${departmentId} -> ${activeEmployees.length}명`);
            return activeEmployees;
        } catch (error) {
            this.logger.error(`활성 직원 조회 실패: ${departmentId}`, error);
            throw new Error('활성 직원 조회 중 오류가 발생했습니다.');
        }
    }

    /**
     * 부서와 하위 부서를 재귀적으로 처리하며 동기화된 ID를 수집하는 함수
     */
    private async processDepartmentHierarchy(
        department: MMSDepartmentResponseDto,
        syncedIds: string[],
        parentDepartment?: DepartmentInfoEntity,
    ): Promise<DepartmentInfoEntity> {
        try {
            // 현재 부서 생성 또는 업데이트
            const departmentInfo = await this.departmentDomainService.createOrUpdateDepartment(department);

            // 동기화된 부서 ID 수집
            syncedIds.push(department.id);

            // 부모 부서가 있으면 설정
            if (parentDepartment) {
                departmentInfo.parent = parentDepartment;
                await this.departmentDomainService.saveDepartment(departmentInfo);
            }

            // 하위 부서가 있으면 재귀적으로 처리
            if (department.child_departments && department.child_departments.length > 0) {
                for (const childDepartment of department.child_departments) {
                    await this.processDepartmentHierarchy(childDepartment, syncedIds, departmentInfo);
                }
            }

            return departmentInfo;
        } catch (error) {
            this.logger.error(`부서 계층 처리 실패: ${department.department_name}`, error);
            throw new Error(`부서 계층 처리 중 오류가 발생했습니다: ${department.department_name}`);
        }
    }

    /**
     * 기존 부서목록에서 삭제된 부서를 처리하는 함수
     */
    private async removeDeletedDepartments(syncedMmsDepartmentIds: string[]): Promise<void> {
        try {
            // 모든 부서 정보 가져오기
            const allDepartments = await this.departmentDomainService.findAllDepartments();
            console.log('allDepartments', allDepartments);
            // MMS에서 더 이상 존재하지 않는 부서 찾기
            const deletedDepartments = allDepartments.filter(
                (department) =>
                    !department.mmsDepartmentId ||
                    (department.mmsDepartmentId && !syncedMmsDepartmentIds.includes(department.mmsDepartmentId)),
            );

            // 삭제될 부서 로깅
            if (deletedDepartments.length > 0) {
                this.logger.log(`삭제 대상 부서 발견: ${deletedDepartments.map((d) => d.departmentName).join(', ')}`);
            }

            // 삭제 처리
            for (const department of deletedDepartments) {
                this.logger.log(`부서 삭제 처리 중: ${department.departmentName} (ID: ${department.departmentId})`);
                await this.departmentDomainService.removeDepartment(department.departmentId);
                this.logger.log(`부서 삭제 완료: ${department.departmentName}`);
            }
        } catch (error) {
            this.logger.error('부서 삭제 처리 중 오류 발생', error);
            throw new Error('부서 삭제 처리 중 오류가 발생했습니다.');
        }
    }

    /**
     * 직원 생성 및 부서 중간테이블 갱신
     */
    private async 직원_생성_및_부서_중간테이블_갱신한다(mmsEmployees: MMSEmployeeResponseDto[]): Promise<void> {
        try {
            for (const employee of mmsEmployees) {
                let employeeInfo = await this.employeeDomainService.findEmployeeByEmployeeNumber(
                    employee.employee_number,
                );

                if (employeeInfo) {
                    // 기존 직원 정보 업데이트
                    employeeInfo.email = employee.email;
                    employeeInfo.entryAt = employee.hire_date.split('T')[0];
                    employeeInfo.birthDate = employee.date_of_birth.split('T')[0];
                    employeeInfo.quitedAt = employee.termination_date ? employee.termination_date.split('T')[0] : null;
                    employeeInfo = await this.employeeDomainService.saveEmployee(employeeInfo);
                } else {
                    // 새 직원 생성
                    const newEmployee = new EmployeeInfoEntity();
                    newEmployee.employeeName = employee.name;
                    newEmployee.employeeNumber = employee.employee_number;
                    newEmployee.email = employee.email;
                    newEmployee.entryAt = employee.hire_date ? employee.hire_date.split('T')[0] : null;
                    newEmployee.birthDate = employee.date_of_birth ? employee.date_of_birth.split('T')[0] : null;
                    newEmployee.quitedAt = employee.termination_date ? employee.termination_date.split('T')[0] : null;
                    employeeInfo = await this.employeeDomainService.saveEmployee(newEmployee);
                }

                // 기존 부서-직원 관계 삭제
                await this.departmentEmployeeDomainService.deleteDepartmentEmployeeByEmployeeId(
                    employeeInfo.employeeId,
                );

                // 재직중인 직원만 부서-직원 관계 생성
                if (employee.department && employee.status === '재직중') {
                    const departmentInfo = await this.departmentDomainService.findDepartmentByMMSDepartmentId(
                        employee.department._id,
                    );

                    if (departmentInfo) {
                        const departmentEmployee = new DepartmentEmployeeEntity();
                        departmentEmployee.department = departmentInfo;
                        departmentEmployee.employee = employeeInfo;
                        await this.departmentEmployeeDomainService.saveDepartmentEmployee(departmentEmployee);
                    }
                }
            }
        } catch (error) {
            this.logger.error('직원 생성 및 부서 중간테이블 갱신 실패', error);
            throw new Error('직원 생성 및 부서 중간테이블 갱신 중 오류가 발생했습니다.');
        }
    }
}
