import { Injectable } from '@nestjs/common';
import { OrganizationContextService } from '../../contexts/organization/organization-context.service';
import { DepartmentResponseDto } from '../../interfaces/dto/organization/responses/department-response.dto';
import { EmployeeResponseDto } from '../../interfaces/dto/organization/responses/employee-response.dto';
import { SyncOrganizationResponseDto } from '../../interfaces/dto/organization/responses/sync-organization-response.dto';
import { PaginationQueryDto } from '../../common/dtos/pagination/pagination-query.dto';
import { plainToInstance } from 'class-transformer';
import { UserDepartmentAuthorityContext } from '../../contexts/user-department-authority/user-department-authority-context';

/**
 * 조직관리 비즈니스 서비스
 * - 조직 관리 관련 비즈니스 로직을 처리
 * - 컨텍스트 서비스를 통해 실제 작업 수행
 */
@Injectable()
export class OrganizationBusinessService {
    constructor(
        private readonly organizationContextService: OrganizationContextService,
        private readonly userDepartmentAuthorityContext: UserDepartmentAuthorityContext,
    ) {}

    /**
     * 조직 동기화 (외부 시스템 연동이므로 try-catch 유지)
     */
    async syncOrganization(): Promise<SyncOrganizationResponseDto> {
        const mmsDepartments = await this.organizationContextService.getDepartmentsFromMMS();
        const mmsEmployees = await this.organizationContextService.getEmployeesFromMMS();

        // 1. 부서를 업데이트하고 없는 부서는 삭제한다
        await this.organizationContextService.부서를_업데이트하고_없는부서는_삭제한다(mmsDepartments);

        for (const mmsEmployee of mmsEmployees) {
            // 2. 직원을 업데이트한다
            const employee = await this.organizationContextService.직원을_업데이트한다(mmsEmployee);
            // 3. 직원 부서 중간테이블 데이터를 삭제 갱신한다
            if (mmsEmployee.department && mmsEmployee.status === '재직중') {
                await this.organizationContextService.직원_부서_중간테이블_데이터를_삭제_갱신한다(
                    employee,
                    mmsEmployee.department._id,
                );
            }
        }

        return new SyncOrganizationResponseDto();
    }

    /**
     * 부서 목록 조회
     */
    async getDepartmentList(paginationQuery: PaginationQueryDto) {
        return await this.organizationContextService.페이지네이션된_부서_목록을_조회한다(paginationQuery);
    }

    /**
     * 권한이 있는 부서 조회
     */
    async getAccessibleAuthorizedDepartments(userId: string): Promise<DepartmentResponseDto[]> {
        const departments = await this.userDepartmentAuthorityContext.사용자의_접근_가능한_부서_목록을_조회한다(userId);
        return departments.map((department) => plainToInstance(DepartmentResponseDto, department));
    }

    /**
     * 검토 가능한 부서 조회
     */
    async getReviewableAuthorizedDepartments(userId: string): Promise<DepartmentResponseDto[]> {
        const departments = await this.userDepartmentAuthorityContext.사용자의_검토_가능한_부서_목록을_조회한다(userId);
        return departments.map((department) => plainToInstance(DepartmentResponseDto, department));
    }

    /**
     * 부서 제외 여부 변경
     */
    async toggleDepartmentExclusion(departmentId: string): Promise<DepartmentResponseDto> {
        const result = await this.organizationContextService.부서의_제외_여부를_변경한다(departmentId);
        return plainToInstance(DepartmentResponseDto, result);
    }

    /**
     * 부서별 직원 목록 조회
     */
    async getEmployeeListByDepartment(departmentId: string, paginationQuery: PaginationQueryDto) {
        // 1. 부서에 해당하는 직원 페이지네이션된 목록을 조회한다
        const result = await this.organizationContextService.해당_부서_직원의_페이지네이션된_목록을_조회한다(
            departmentId,
            paginationQuery,
        );

        // 2. 직원들의 연차 정보를 갱신해서 보여준다
        await this.organizationContextService.직원들의_연차_정보를_갱신해서_보여준다();

        return result;
    }

    /**
     * 직원 제외 여부 변경
     */
    async toggleEmployeeExclusion(employeeId: string): Promise<EmployeeResponseDto> {
        if (!employeeId || employeeId.trim().length === 0) {
            throw new Error('직원 ID가 필요합니다.');
        }

        const result = await this.organizationContextService.직원의_제외_여부_변경한다(employeeId);
        return plainToInstance(EmployeeResponseDto, result);
    }

    /**
     * 활성 직원 목록 조회 (부서별)
     */
    async getActiveEmployeesByDepartment(departmentId: string): Promise<EmployeeResponseDto[]> {
        const result = await this.organizationContextService.퇴사데이터가_있는_직원을_제외한_부서의_직원을_조회한다(
            departmentId,
        );

        return result.map((employee) => plainToInstance(EmployeeResponseDto, employee));
    }
}
