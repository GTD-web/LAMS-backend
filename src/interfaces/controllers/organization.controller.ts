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
import { OrganizationBusinessService } from '@src/business/organization/organization.business';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { RolesGuard } from '@src/common/guards/roles.guard';
import { Roles } from '@src/common/decorators/roles.decorator';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { SyncOrganizationResponseDto } from '@src/interfaces/dto/organization/responses/sync-organization-response.dto';
import { DepartmentResponseDto } from '@src/interfaces/dto/organization/responses/department-response.dto';
import { EmployeeResponseDto } from '@src/interfaces/dto/organization/responses/employee-response.dto';
import { ErrorResponseDto } from '@src/common/dtos/common/error-response.dto';

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
        summary: '부서별 직원 목록 조회',
        description: '특정 부서에 속한 직원들의 페이지네이션된 목록을 조회합니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
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
        description: '부서별 직원 목록 조회 성공',
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
        @Query() paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedResponseDto<EmployeeResponseDto>> {
        return await this.organizationBusinessService.getEmployeeListByDepartment(departmentId, paginationQuery);
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

    @Get('departments/:departmentId/active-employees')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '부서별 활성 직원 목록 조회',
        description: '특정 부서의 퇴사하지 않은 활성 직원 목록을 조회합니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiOkResponse({
        description: '부서별 활성 직원 목록 조회 성공',
        schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/EmployeeResponseDto' },
        },
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
    async getActiveEmployeesByDepartment(
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
    ): Promise<EmployeeResponseDto[]> {
        return await this.organizationBusinessService.getActiveEmployeesByDepartment(departmentId);
    }
}
