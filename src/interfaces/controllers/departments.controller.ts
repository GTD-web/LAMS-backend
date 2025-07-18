import { Controller, Get, Put, Param, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { OrganizationManagementService } from '../../business/organization/services/organization-management.service';
import { OrganizationQueryService } from '../../business/organization/services/organization-query.service';
import { PaginationQueryDto } from '../../common/dtos/pagination/pagination-query.dto';
import { UserRole } from '../../domain/user/enum/user.enum';
import { DepartmentResponseDto } from '../dto/organization/responses/department-response.dto';
import { PaginatedResponseDto } from '../../common/dtos/pagination/pagination-response.dto';
import {
    DepartmentWithEmployeesResponseDto,
    EmployeeInDepartmentDto,
} from '../dto/organization/responses/department-with-employees-response.dto';

/**
 * 부서 관리 컨트롤러
 * - 부서 조회 및 isExclude 토글 기능만 제공
 * - 부서 생성/삭제는 MMS 동기화를 통해서만 가능
 */
@ApiTags('departments')
@Controller('departments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DepartmentsController {
    constructor(
        private readonly organizationManagementService: OrganizationManagementService,
        private readonly organizationQueryService: OrganizationQueryService,
    ) {}

    @Get()
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '부서 목록 조회' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'isExclude', required: false, type: Boolean, description: '제외된 부서 포함 여부' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '부서 목록이 성공적으로 조회되었습니다.',
        type: PaginatedResponseDto<DepartmentResponseDto>,
    })
    async getDepartments(
        @Query() paginationQuery: PaginationQueryDto,
        @Query('isExclude') isExclude?: boolean,
    ): Promise<PaginatedResponseDto<DepartmentResponseDto>> {
        return await this.organizationQueryService.getDepartments(paginationQuery, isExclude);
    }

    @Get('search')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '부서 검색' })
    @ApiQuery({ name: 'searchTerm', required: true, type: String })
    @ApiQuery({ name: 'userId', required: false, type: String })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '부서 검색이 성공적으로 완료되었습니다.',
        type: [DepartmentResponseDto],
    })
    async searchDepartments(
        @Query('searchTerm') searchTerm: string,
        @Query('userId') userId?: string,
    ): Promise<DepartmentResponseDto[]> {
        const departments = await this.organizationQueryService.searchDepartments(searchTerm, userId);
        return departments.map((dept) => new DepartmentResponseDto(dept));
    }

    @Get('hierarchy')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '부서 계층 조회' })
    @ApiQuery({ name: 'departmentId', required: false, type: String })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '부서 계층이 성공적으로 조회되었습니다.',
        type: [DepartmentResponseDto],
    })
    async getDepartmentHierarchy(@Query('departmentId') departmentId?: string): Promise<DepartmentResponseDto[]> {
        const departments = await this.organizationQueryService.getDepartmentHierarchy(departmentId);
        return departments.map((dept) => new DepartmentResponseDto(dept));
    }

    @Get(':departmentId')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '부서 단일 조회' })
    @ApiParam({ name: 'departmentId', description: '부서 ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '부서가 성공적으로 조회되었습니다.',
        type: DepartmentResponseDto,
    })
    async getDepartmentById(@Param('departmentId') departmentId: string): Promise<DepartmentResponseDto | null> {
        const department = await this.organizationQueryService.getDepartmentById(departmentId);
        if (!department) return null;
        return new DepartmentResponseDto(department);
    }

    @Get(':departmentId/employees')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '부서별 직원 조회' })
    @ApiParam({ name: 'departmentId', description: '부서 ID' })
    @ApiQuery({ name: 'isExclude', required: false, type: Boolean, description: '제외된 직원 포함 여부' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '부서별 직원이 성공적으로 조회되었습니다.',
        type: [EmployeeInDepartmentDto],
    })
    async getEmployeesByDepartment(@Param('departmentId') departmentId: string): Promise<EmployeeInDepartmentDto[]> {
        const employees = await this.organizationQueryService.getEmployeesByDepartment(departmentId);
        return employees.map((emp) => new EmployeeInDepartmentDto(emp));
    }

    @Get(':departmentId/with-employees')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '부서와 소속 직원 함께 조회' })
    @ApiParam({ name: 'departmentId', description: '부서 ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '부서와 소속 직원이 성공적으로 조회되었습니다.',
        type: DepartmentWithEmployeesResponseDto,
    })
    async getDepartmentWithEmployees(
        @Param('departmentId') departmentId: string,
    ): Promise<DepartmentWithEmployeesResponseDto> {
        const result = await this.organizationQueryService.getDepartmentWithEmployees(departmentId);
        return new DepartmentWithEmployeesResponseDto({
            department: result.department ? new DepartmentResponseDto(result.department) : null,
            employees: result.employees.map((emp) => new EmployeeInDepartmentDto(emp)),
        });
    }

    @Put(':departmentId/toggle-exclude')
    @Roles(UserRole.SYSTEM_ADMIN)
    @ApiOperation({ summary: '부서 제외 상태 토글' })
    @ApiParam({ name: 'departmentId', description: '부서 ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '부서 제외 상태가 성공적으로 변경되었습니다.',
        type: DepartmentResponseDto,
    })
    async toggleDepartmentExclude(@Param('departmentId') departmentId: string): Promise<DepartmentResponseDto> {
        const department = await this.organizationManagementService.toggleDepartmentExclude(departmentId);
        return new DepartmentResponseDto(department);
    }
}
