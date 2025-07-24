import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { QueryRunner } from 'typeorm';
import { DepartmentDomainService } from '../../domain/department/services/department-domain.service';
import { DepartmentEmployeeDomainService } from '../../domain/department-employee/department-employee-domain.service';
import { DepartmentInfoEntity } from '../../domain/department/entities/department-info.entity';
import { EmployeeDomainService } from '../../domain/employee/services/employee-domain.service';
import { EmployeeInfoEntity } from '../../domain/employee/entities/employee-info.entity';
import { PaginationQueryDto } from '../../common/dtos/pagination/pagination-query.dto';
import { MMSDepartmentResponseDto } from '../../interfaces/controllers/organization/dto/mms-department-import.dto';
import { MMSEmployeeResponseDto } from '../../interfaces/controllers/organization/dto/mms-employee-import.dto';
import { PaginatedResponseDto } from '../../common/dtos/pagination/pagination-response.dto';
import { DepartmentResponseDto } from '../../interfaces/dto/organization/responses/department-response.dto';
import { EmployeeResponseDto } from '../../interfaces/dto/organization/responses/employee-response.dto';
import { EmployeeSearchOptions } from '../../domain/department-employee/interfaces/employee-search-options.interface';
import { EmployeeFilterQueryDto } from 'src/interfaces/dto/organization/requests/employee-filter-query.dto';

/**
 * 조직 컨텍스트 서비스
 * - User, Department, Employee 통합 관리
 * - 조직 관련 모든 상호작용 처리
 * - MMS 외부 시스템과의 동기화 처리
 */
@Injectable()
export class OrganizationContextService {
    private readonly logger = new Logger(OrganizationContextService.name);

    constructor(
        private readonly departmentDomainService: DepartmentDomainService,
        private readonly employeeDomainService: EmployeeDomainService,
        private readonly departmentEmployeeDomainService: DepartmentEmployeeDomainService,
    ) {}

    /**
     * MMS에서 부서 데이터 가져오기 (외부 시스템 연동이므로 try-catch 유지)
     */
    async getDepartmentsFromMMS(): Promise<MMSDepartmentResponseDto[]> {
        try {
            console.log('process.env.MMS_BASE_URL:', process.env.MMS_BASE_URL);
            const department = await axios.get(`${process.env.MMS_BASE_URL}/api/departments?hierarchy=true`);
            this.logger.debug(`MMS에서 가져온 부서 데이터:`, JSON.stringify(department.data, null, 2));
            return department.data;
        } catch (error) {
            this.logger.error('MMS 부서 데이터 조회 실패', error);
            throw new Error('MMS 부서 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    }

    /**
     * MMS에서 직원 데이터 가져오기 (외부 시스템 연동이므로 try-catch 유지)
     */
    async getEmployeesFromMMS(): Promise<MMSEmployeeResponseDto[]> {
        try {
            const employee = await axios.get(`${process.env.MMS_BASE_URL}/api/employees`);
            return employee.data;
        } catch (error) {
            this.logger.error('MMS 직원 데이터 조회 실패', error);
            throw new Error('MMS 직원 데이터를 가져오는 중 오류가 발생했습니다.');
        }
    }

    async MMS와_상이한_부서_목록을_조회한다(
        mmsDepartments: MMSDepartmentResponseDto[],
        queryRunner?: QueryRunner,
    ): Promise<DepartmentInfoEntity[]> {
        const existingDepartments = await this.departmentDomainService.findAllDepartments(undefined, queryRunner);

        // MMS 부서 데이터를 평면화 (domain 서비스 활용)
        const flattenedMMSDepartments = this.departmentDomainService.flattenMMSDepartments(mmsDepartments);

        // 디버깅을 위한 로그 추가
        this.logger.debug(`기존 부서 수: ${existingDepartments.length}`);
        this.logger.debug(`MMS 부서 수 (평면화 전): ${mmsDepartments.length}`);
        this.logger.debug(`MMS 부서 수 (평면화 후): ${flattenedMMSDepartments.length}`);

        existingDepartments.forEach((dept) => {
            this.logger.debug(`기존 부서: ${dept.departmentName} (MMS ID: ${dept.mmsDepartmentId})`);
        });

        flattenedMMSDepartments.forEach((dept) => {
            this.logger.debug(`MMS 부서: ${dept.department_name} (_id: ${dept._id}, id: ${dept.id})`);
        });

        const differentDepartments = existingDepartments.filter(
            (existingDept) =>
                !flattenedMMSDepartments.some(
                    (mmsDept) =>
                        mmsDept.id === existingDept.mmsDepartmentId || mmsDept._id === existingDept.mmsDepartmentId,
                ),
        );

        this.logger.debug(`삭제될 부서 수: ${differentDepartments.length}`);
        differentDepartments.forEach((dept) => {
            this.logger.debug(`삭제될 부서: ${dept.departmentName} (MMS ID: ${dept.mmsDepartmentId})`);
        });

        return differentDepartments;
    }

    async 해당_부서의_직원과의_중간테이블_데이터를_삭제한다(
        differentDepartments: DepartmentInfoEntity[],
        queryRunner?: QueryRunner,
    ): Promise<void> {
        for (const department of differentDepartments) {
            await this.departmentEmployeeDomainService.deleteDepartmentEmployeeByDepartmentId(
                department.departmentId,
                queryRunner,
            );
        }
    }

    /**
     * 부서를 업데이트하고 없는 부서는 삭제한다 (외부 시스템 연동 및 트랜잭션이므로 try-catch 유지)
     */
    async 부서를_업데이트하고_없는부서는_삭제한다(
        mmsDepartments: MMSDepartmentResponseDto[],
        differentDepartments: DepartmentInfoEntity[],
        queryRunner?: QueryRunner,
    ): Promise<void> {
        // MMS 부서 데이터를 평면화하여 모든 부서 처리
        const flattenedMMSDepartments = this.departmentDomainService.flattenMMSDepartments(mmsDepartments);

        this.logger.debug(`업데이트할 MMS 부서 수: ${flattenedMMSDepartments.length}`);

        // 부모 부서부터 생성하기 위해 정렬
        const sortedDepartments = this.departmentDomainService.sortDepartmentsByHierarchy(flattenedMMSDepartments);

        // 평면화된 MMS 부서 데이터로 업데이트/생성
        for (const mmsDept of sortedDepartments) {
            this.logger.debug(
                `부서 업데이트/생성: ${mmsDept.department_name} (_id: ${mmsDept._id}, id: ${mmsDept.id}, parent: ${mmsDept.parent_department_id})`,
            );
            await this.departmentDomainService.createOrUpdateDepartment(mmsDept, undefined, queryRunner);
        }

        // MMS에 없는 부서 삭제
        this.logger.debug(`삭제할 부서 수: ${differentDepartments.length}`);
        for (const differentDept of differentDepartments) {
            this.logger.debug(`부서 삭제: ${differentDept.departmentName} (MMS ID: ${differentDept.mmsDepartmentId})`);
            await this.departmentDomainService.removeDepartment(differentDept.departmentId, queryRunner);
        }
    }

    /**
     * 직원을 업데이트한다 (도메인으로 위임)
     */
    async MMS데이터와_비교_직원을_업데이트한다(
        mmsEmployee: MMSEmployeeResponseDto,
        queryRunner?: QueryRunner,
    ): Promise<EmployeeInfoEntity> {
        // MMSEmployeeResponseDto를 도메인 인터페이스로 변환
        const employeeData = {
            employee_number: mmsEmployee.employee_number,
            name: mmsEmployee.name,
            email: mmsEmployee.email,
            hire_date: mmsEmployee.hire_date,
            termination_date: mmsEmployee.termination_date,
            date_of_birth: mmsEmployee.date_of_birth,
            department: mmsEmployee.department,
        };

        return await this.employeeDomainService.updateEmployeeFromMMSData(employeeData, queryRunner);
    }

    /**
     * 직원 부서 중간테이블 데이터를 효율적으로 업데이트한다
     * - 기존 관계와 비교하여 변경이 필요한 경우에만 업데이트
     */
    async 직원_부서_중간테이블_데이터를_삭제_갱신한다(
        employee: EmployeeInfoEntity,
        departmentId: string,
        queryRunner?: QueryRunner,
    ): Promise<boolean> {
        const department = await this.departmentDomainService.getDepartmentByMMSDepartmentId(departmentId, queryRunner);

        // 도메인 서비스에서 효율적 업데이트 수행
        return await this.departmentEmployeeDomainService.updateEmployeeDepartmentRelation(
            employee,
            department,
            queryRunner,
        );
    }

    /**
     * 페이지네이션된 부서 목록을 조회한다
     */
    async 페이지네이션된_부서_목록을_조회한다(
        paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedResponseDto<DepartmentResponseDto>> {
        return await this.departmentDomainService.findPaginatedDepartments(paginationQuery.page, paginationQuery.limit);
    }

    /**
     * 부서의 제외 여부를 변경한다
     */
    async 부서의_제외_여부를_변경한다(departmentId: string): Promise<DepartmentInfoEntity> {
        return await this.departmentDomainService.toggleDepartmentExclusion(departmentId);
    }

    async 부서의_속한_모든_부서_목록을_조회한다(departmentId: string): Promise<DepartmentInfoEntity[]> {
        // ✅ 모든 부서를 한 번에 조회 (성능 최적화)
        const allDepartments = await this.departmentDomainService.findAllDepartments();

        // ✅ 시작 부서 찾기
        const targetDepartment = allDepartments.find((dept) => dept.departmentId === departmentId);
        if (!targetDepartment) {
            this.logger.error(`Department with ID ${departmentId} not found`);
            throw new NotFoundException(`Department with ID ${departmentId} not found`);
        }

        // ✅ 부서 ID별 맵 생성 (O(1) 접근)
        const departmentMap = new Map<string, DepartmentInfoEntity>();
        allDepartments.forEach((dept) => departmentMap.set(dept.departmentId, dept));

        // ✅ 재귀적으로 모든 하위 부서 수집
        const allChildrenDepartments: DepartmentInfoEntity[] = [];
        this.collectAllChildrenFromMemory(departmentId, departmentMap, allChildrenDepartments);

        return allChildrenDepartments;
    }

    private collectAllChildrenFromMemory(
        parentDepartmentId: string,
        departmentMap: Map<string, DepartmentInfoEntity>,
        collectedDepartments: DepartmentInfoEntity[],
    ): void {
        // ✅ 현재 부서 추가
        const currentDepartment = departmentMap.get(parentDepartmentId);
        if (currentDepartment) {
            // 중복 방지 체크
            const alreadyExists = collectedDepartments.some(
                (dept) => dept.departmentId === currentDepartment.departmentId,
            );

            if (!alreadyExists) {
                collectedDepartments.push(currentDepartment);
            }
        }

        // ✅ 모든 부서에서 현재 부서를 부모로 하는 하위 부서들 찾기
        for (const [departmentId, department] of departmentMap) {
            if (department.parentDepartmentId === parentDepartmentId) {
                // 재귀적으로 하위 부서들 수집
                this.collectAllChildrenFromMemory(departmentId, departmentMap, collectedDepartments);
            }
        }
    }

    /**
     * 부서에 해당하는 직원 페이지네이션된 목록을 조회한다
     */
    async 해당부서들의_직원을_페이지네이션된_목록으로_조회한다(
        departments: DepartmentInfoEntity[],
        paginationQuery: PaginationQueryDto,
        employeeFilterQuery?: EmployeeFilterQueryDto,
    ): Promise<PaginatedResponseDto<EmployeeResponseDto>> {
        const departmentIds = departments.map((department) => department.departmentId);

        // 도메인에서 페이지네이션까지 처리
        const paginationResult = await this.departmentEmployeeDomainService.findPaginatedEmployeesByDepartmentIds(
            departmentIds,
            paginationQuery,
            employeeFilterQuery,
        );

        // 응답 DTO 생성
        return paginationResult;
    }

    /**
     * 직원들의 연차 정보를 갱신해서 보여준다
     */
    async 직원들의_연차_정보를_갱신해서_보여준다(): Promise<void> {
        // 연차 정보 갱신 로직 (현재는 로깅만)
    }

    /**
     * 직원의 제외 여부를 변경한다
     */
    async 직원의_제외_여부_변경한다(employeeId: string): Promise<EmployeeInfoEntity> {
        return await this.employeeDomainService.toggleEmployeeExclude(employeeId);
    }

    async findDepartmentById(departmentId: string): Promise<DepartmentInfoEntity> {
        return await this.departmentDomainService.findDepartmentById(departmentId);
    }
}
