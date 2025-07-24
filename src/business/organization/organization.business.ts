import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrganizationContextService } from '../../contexts/organization/organization-context.service';
import { DepartmentResponseDto } from '../../interfaces/dto/organization/responses/department-response.dto';
import { EmployeeResponseDto } from '../../interfaces/dto/organization/responses/employee-response.dto';
import { SyncOrganizationResponseDto } from '../../interfaces/dto/organization/responses/sync-organization-response.dto';
import { PaginationQueryDto } from '../../common/dtos/pagination/pagination-query.dto';
import { plainToInstance } from 'class-transformer';
import { UserDepartmentAuthorityContext } from '../../contexts/user-department-authority/user-department-authority-context';
import { PaginatedResponseDto } from 'src/common/dtos/pagination/pagination-response.dto';
import { EmployeeFilterQueryDto } from '../../interfaces/dto/organization/requests/employee-filter-query.dto';
import { EmployeeSearchOptions } from '../../domain/department-employee/interfaces/employee-search-options.interface';

/**
 * 조직관리 비즈니스 서비스
 * - 조직 관리 관련 비즈니스 로직을 처리
 * - 컨텍스트 서비스를 통해 실제 작업 수행
 */
@Injectable()
export class OrganizationBusinessService {
    private readonly logger = new Logger(OrganizationBusinessService.name);

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly organizationContextService: OrganizationContextService,
        private readonly userDepartmentAuthorityContext: UserDepartmentAuthorityContext,
    ) {}

    /**
     * 조직 동기화 (트랜잭션 처리)
     */
    async syncOrganization(): Promise<SyncOrganizationResponseDto> {
        // 외부 API 호출은 트랜잭션 외부에서 수행
        const mmsDepartments = await this.organizationContextService.getDepartmentsFromMMS();
        const mmsEmployees = await this.organizationContextService.getEmployeesFromMMS();

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. MMS와 상이한 부서 목록을 조회한다.
            const differentDepartments = await this.organizationContextService.MMS와_상이한_부서_목록을_조회한다(
                mmsDepartments,
                queryRunner,
            );
            console.log('differentDepartments:', differentDepartments);
            // 2. 해당 부서의 권한을 가진 데이터를 삭제한다.
            await this.userDepartmentAuthorityContext.해당_부서의_권한을_가진_데이터를_삭제한다(
                differentDepartments,
                queryRunner,
            );

            // 3. 해당 부서의 직원과의 중간테이블 데이터를 삭제한다.
            await this.organizationContextService.해당_부서의_직원과의_중간테이블_데이터를_삭제한다(
                differentDepartments,
                queryRunner,
            );

            // 4. 부서를 업데이트하고 없는 부서는 삭제한다.
            await this.organizationContextService.부서를_업데이트하고_없는부서는_삭제한다(
                mmsDepartments,
                differentDepartments,
                queryRunner,
            );

            // 통계 수집을 위한 변수
            let updatedRelations = 0;
            let skippedRelations = 0;

            for (const mmsEmployee of mmsEmployees) {
                // 5. 직원을 업데이트한다
                const employee = await this.organizationContextService.MMS데이터와_비교_직원을_업데이트한다(
                    mmsEmployee,
                    queryRunner,
                );

                // 6. 직원 부서 중간테이블 데이터를 효율적으로 업데이트한다
                if (mmsEmployee.department && mmsEmployee.status === '재직중') {
                    const wasUpdated =
                        await this.organizationContextService.직원_부서_중간테이블_데이터를_삭제_갱신한다(
                            employee,
                            mmsEmployee.department._id,
                            queryRunner,
                        );

                    if (wasUpdated) {
                        updatedRelations++;
                    } else {
                        skippedRelations++;
                    }
                }
            }

            // 트랜잭션 커밋
            await queryRunner.commitTransaction();

            const statistics = {
                totalEmployees: mmsEmployees.length,
                updatedRelations,
                skippedRelations,
            };

            this.logger.log(
                `조직 동기화 완료: ${statistics.totalEmployees}명 처리, ${statistics.updatedRelations}개 업데이트, ${statistics.skippedRelations}개 스킵`,
            );
            return new SyncOrganizationResponseDto('조직 동기화가 성공적으로 완료되었습니다.', statistics);
        } catch (error) {
            // 트랜잭션 롤백
            await queryRunner.rollbackTransaction();

            // 구체적인 에러 정보 로깅
            if (error.name === 'EntityPropertyNotFoundError') {
                this.logger.error(`Entity 관계 설정 오류: ${error.message}`, error.stack);
                throw new Error(`데이터베이스 스키마 오류: ${error.message}`);
            } else if (error.message?.includes('employee_number')) {
                this.logger.error(`직원 정보 처리 오류: ${error.message}`, error.stack);
                throw new Error(`직원 데이터 처리 중 오류가 발생했습니다: ${error.message}`);
            } else {
                this.logger.error('조직 동기화 실패 - 모든 변경사항이 롤백되었습니다.', error.stack);
                throw new Error(`조직 동기화 중 오류가 발생했습니다: ${error.message}`);
            }
        } finally {
            // QueryRunner 해제
            await queryRunner.release();
        }
    }

    /**
     * 부서 목록 조회
     */
    async getDepartmentList(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<DepartmentResponseDto>> {
        return await this.organizationContextService.페이지네이션된_부서_목록을_조회한다(paginationQuery);
    }

    /**
     * 접근 가능한 부서 조회
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
    async getEmployeeListByDepartment(
        departmentId: string,
        paginationQuery: PaginationQueryDto,
        employeeFilterQuery?: EmployeeFilterQueryDto,
    ): Promise<PaginatedResponseDto<EmployeeResponseDto>> {
        // 1. 부서의 속한 모든 부서 목록을 조회한다
        const departments = await this.organizationContextService.부서의_속한_모든_부서_목록을_조회한다(departmentId);

        // 2. 해당 부서들의 직원을 페이지네이션된 목록으로 조회한다
        const result = await this.organizationContextService.해당부서들의_직원을_페이지네이션된_목록으로_조회한다(
            departments,
            paginationQuery,
            employeeFilterQuery,
        );

        // 2. 직원들의 연차 정보를 갱신해서 보여준다
        // TODO: 연차 정보 갱신 로직 추가
        await this.organizationContextService.직원들의_연차_정보를_갱신해서_보여준다();

        return result;
    }

    /**
     * 직원 제외 여부 변경
     */
    async toggleEmployeeExclusion(employeeId: string): Promise<EmployeeResponseDto> {
        const result = await this.organizationContextService.직원의_제외_여부_변경한다(employeeId);
        return plainToInstance(EmployeeResponseDto, result);
    }
}
