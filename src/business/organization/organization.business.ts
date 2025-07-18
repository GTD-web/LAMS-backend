import { Injectable, Logger } from '@nestjs/common';
import { OrganizationContextService } from '@src/contexts/organization/organization-context.service';
import { DepartmentResponseDto } from '@src/interfaces/dto/organization/responses/department-response.dto';
import { EmployeeResponseDto } from '@src/interfaces/dto/organization/responses/employee-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { SuccessMessageHelper } from '@src/common/helpers/success-message.helper';
import { plainToInstance } from 'class-transformer';
import {
    SyncSuccessResponse,
    SuccessResponseWithData,
    PaginatedSuccessResponse,
} from '@src/common/types/success-response.type';

/**
 * 조직관리 비즈니스 서비스
 * - 조직 관리 관련 비즈니스 로직을 처리
 * - 컨텍스트 서비스를 통해 실제 작업 수행
 */
@Injectable()
export class OrganizationBusinessService {
    private readonly logger = new Logger(OrganizationBusinessService.name);

    constructor(private readonly organizationContextService: OrganizationContextService) {}

    /**
     * 조직 동기화 (외부 시스템 연동이므로 try-catch 유지)
     */
    async syncOrganization(): Promise<SyncSuccessResponse> {
        try {
            // 1. 부서를 업데이트하고 없는 부서는 삭제한다
            await this.organizationContextService.부서를_업데이트하고_없는부서는_삭제한다();

            // 2. 직원을 업데이트한다
            await this.organizationContextService.직원을_업데이트한다();

            // 3. 직원 부서 중간테이블 데이터를 삭제 갱신한다
            await this.organizationContextService.직원_부서_중간테이블_데이터를_삭제_갱신한다();

            this.logger.log('조직 동기화 완료');

            return SuccessMessageHelper.createSyncSuccessResponse(SuccessMessageHelper.MESSAGES.ORGANIZATION_SYNCED);
        } catch (error) {
            this.logger.error('조직 동기화 실패', error.stack);
            throw new Error('조직 동기화 중 오류가 발생했습니다. 관리자에게 문의하세요.');
        }
    }

    /**
     * 부서 목록 조회
     */
    async getDepartmentList(
        paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedSuccessResponse<DepartmentResponseDto>> {
        if (!paginationQuery.page || !paginationQuery.limit) {
            throw new Error('페이지 정보가 필요합니다.');
        }

        const { page = 1, limit = 10 } = paginationQuery;
        const result = await this.organizationContextService.페이지네이션된_부서_목록을_조회한다(limit, page);

        return SuccessMessageHelper.createPaginatedSuccessResponse(
            SuccessMessageHelper.MESSAGES.DEPARTMENT_LIST_RETRIEVED,
            result.data || [],
            result.meta || { page, limit, total: 0, totalPages: 0 },
        );
    }

    /**
     * 부서 제외 여부 변경
     */
    async toggleDepartmentExclusion(departmentId: string): Promise<SuccessResponseWithData<DepartmentResponseDto>> {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new Error('부서 ID가 필요합니다.');
        }

        const result = await this.organizationContextService.부서의_제외_여부를_변경한다(departmentId);

        return SuccessMessageHelper.createToggleSuccessResponse(
            SuccessMessageHelper.MESSAGES.DEPARTMENT_EXCLUSION_TOGGLED,
            result,
            'isExclude',
            result.isExclude,
        );
    }

    /**
     * 부서별 직원 목록 조회
     */
    async getEmployeeListByDepartment(
        departmentId: string,
        paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedSuccessResponse<EmployeeResponseDto>> {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new Error('부서 ID가 필요합니다.');
        }

        if (!paginationQuery.page || !paginationQuery.limit) {
            throw new Error('페이지 정보가 필요합니다.');
        }

        const { page = 1, limit = 10 } = paginationQuery;

        // 1. 부서에 해당하는 직원 페이지네이션된 목록을 조회한다
        const result = await this.organizationContextService.부서에_해당하는_직원_페이지네이션된_목록을_조회한다(
            departmentId,
            limit,
            page,
        );

        // 2. 직원들의 연차 정보를 갱신해서 보여준다
        await this.organizationContextService.직원들의_연차_정보를_갱신해서_보여준다();

        return SuccessMessageHelper.createPaginatedSuccessResponse(
            SuccessMessageHelper.MESSAGES.EMPLOYEE_LIST_RETRIEVED,
            result.data || [],
            result.meta || { page, limit, total: 0, totalPages: 0 },
        );
    }

    /**
     * 직원 제외 여부 변경
     */
    async toggleEmployeeExclusion(employeeId: string): Promise<SuccessResponseWithData<EmployeeResponseDto>> {
        if (!employeeId || employeeId.trim().length === 0) {
            throw new Error('직원 ID가 필요합니다.');
        }

        const result = await this.organizationContextService.직원의_제외_여부_변경한다(employeeId);

        // EmployeeInfoEntity를 EmployeeResponseDto로 변환
        const employeeDto = plainToInstance(EmployeeResponseDto, result);

        return SuccessMessageHelper.createToggleSuccessResponse(
            SuccessMessageHelper.MESSAGES.EMPLOYEE_EXCLUSION_TOGGLED,
            employeeDto,
            'isExcludedFromCalculation',
            result.isExcludedFromCalculation,
        );
    }

    /**
     * 활성 직원 목록 조회 (부서별)
     */
    async getActiveEmployeesByDepartment(
        departmentId: string,
    ): Promise<SuccessResponseWithData<EmployeeResponseDto[]>> {
        if (!departmentId || departmentId.trim().length === 0) {
            throw new Error('부서 ID가 필요합니다.');
        }

        const result = await this.organizationContextService.퇴사데이터가_있는_직원을_제외한_부서의_직원을_조회한다(
            departmentId,
        );

        // EmployeeInfoEntity[]를 EmployeeResponseDto[]로 변환
        const employeeDtos = result.map((employee) => plainToInstance(EmployeeResponseDto, employee));

        return SuccessMessageHelper.createRetrievalSuccessResponse(
            SuccessMessageHelper.MESSAGES.EMPLOYEE_LIST_RETRIEVED,
            employeeDtos,
            employeeDtos.length,
        );
    }
}
