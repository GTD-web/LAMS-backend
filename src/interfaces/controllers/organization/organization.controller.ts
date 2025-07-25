import { Controller, Post, Get, Patch, Param, Query, UseGuards, ParseUUIDPipe, Body } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { OrganizationBusinessService } from '../../../business/organization/organization.business';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../domain/user/enum/user.enum';
import { PaginationQueryDto } from '../../../common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '../../../common/dtos/pagination/pagination-response.dto';
import { ErrorResponseDto } from '../../../common/dtos/common/error-response.dto';
import { EmployeeFilterQueryDto } from './dto/employee-filter-query.dto';
import { DepartmentResponseDto } from '../../../business/organization/dto/department-response.dto';
import { EmployeeResponseDto } from '../../../business/organization/dto/employee-response.dto';
import { SyncOrganizationResponseDto } from '../../../business/organization/dto/sync-organization-response.dto';
import { DepartmentWithEmployeesResponseDto } from '../../../contexts/organization/dto/department-with-employees-response.dto';
import { EmployeeWithDepartmentResponseDto } from '../../../contexts/organization/dto/employee-with-department-response.dto';

/**
 * 조직관리 컨트롤러
 * - 조직 동기화, 부서 관리, 직원 관리 API 제공
 */
@ApiTags('organization')
@Controller({ path: 'organization', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class OrganizationController {
    constructor(private readonly organizationBusinessService: OrganizationBusinessService) {}

    @Post('sync')
    @Roles(UserRole.SYSTEM_ADMIN)
    @ApiOperation({
        summary: '조직 동기화',
        description: 'MMS 시스템과 조직 정보를 동기화합니다. 부서 및 직원 정보를 최신 상태로 업데이트합니다.',
    })
    @ApiCreatedResponse({
        description: '조직 동기화 성공',
        type: SyncOrganizationResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '접근 권한 없음 - 시스템 관리자 권한 필요',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: '조직 동기화 실패',
        type: ErrorResponseDto,
    })
    async syncOrganization(): Promise<SyncOrganizationResponseDto> {
        return await this.organizationBusinessService.syncOrganization();
    }

    @Get('departments')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '부서 목록 조회',
        description: '페이지네이션된 부서 목록을 조회합니다.',
    })
    @ApiQuery({
        name: 'page',
        description: '페이지 번호 (1부터 시작)',
        type: 'integer',
        example: 1,
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        description: '페이지당 항목 수',
        type: 'integer',
        example: 10,
        required: false,
    })
    @ApiOkResponse({
        description: '부서 목록 조회 성공',
        type: PaginatedResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '접근 권한 없음',
        type: ErrorResponseDto,
    })
    async getDepartmentList(
        @Query() paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedResponseDto<DepartmentResponseDto>> {
        return await this.organizationBusinessService.getDepartmentList(paginationQuery);
    }

    @Patch('departments/:departmentId/toggle-exclusion')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '부서 제외 여부 변경',
        description: '특정 부서의 제외 여부를 토글합니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiOkResponse({
        description: '부서 제외 여부 변경 성공',
        type: DepartmentResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '접근 권한 없음',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '부서를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 부서 ID',
        type: ErrorResponseDto,
    })
    async toggleDepartmentExclusion(
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
    ): Promise<DepartmentResponseDto> {
        return await this.organizationBusinessService.toggleDepartmentExclusion(departmentId);
    }

    @Get('departments/:departmentId/employees')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '부서별 직원 목록 조회 (통합 endpoint)',
        description:
            '부서별 직원 목록을 다양한 필터 옵션과 함께 페이지네이션으로 조회합니다. 해당 부서와 하위 부서의 모든 직원을 포함합니다. status 파라미터로 활성/퇴사/전체 직원을 선택할 수 있고, excludeFromCalculation으로 계산 제외 직원을 필터링할 수 있습니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID (해당 부서와 하위 부서의 모든 직원 조회)',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: '부서별 직원 목록 조회 성공',
        type: PaginatedResponseDto<EmployeeResponseDto>,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '접근 권한 없음',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '부서를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 부서 ID',
        type: ErrorResponseDto,
    })
    async getEmployeeListByDepartment(
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
        @Query() query: EmployeeFilterQueryDto,
    ): Promise<PaginatedResponseDto<EmployeeResponseDto>> {
        const { page, limit, ...filterQuery } = query;
        const paginationQuery = { page, limit };

        return await this.organizationBusinessService.getEmployeeListByDepartment(
            departmentId,
            paginationQuery,
            filterQuery,
        );
    }

    @Patch('employees/:employeeId/toggle-exclusion')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '직원 제외 여부 변경',
        description: '특정 직원의 제외 여부를 토글합니다.',
    })
    @ApiParam({
        name: 'employeeId',
        description: '직원 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiOkResponse({
        description: '직원 제외 여부 변경 성공',
        type: EmployeeResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '접근 권한 없음',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '직원을 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 직원 ID',
        type: ErrorResponseDto,
    })
    async toggleEmployeeExclusion(
        @Param('employeeId', ParseUUIDPipe) employeeId: string,
    ): Promise<EmployeeResponseDto> {
        return await this.organizationBusinessService.toggleEmployeeExclusion(employeeId);
    }
}
