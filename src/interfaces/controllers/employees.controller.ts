import { Controller, Get, Put, Post, Param, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { OrganizationManagementService } from '../../business/organization/services/organization-management.service';
import { OrganizationQueryService } from '../../business/organization/services/organization-query.service';
import { PaginationQueryDto } from '../../common/dtos/pagination/pagination-query.dto';
import { UserRole } from '../../domain/user/enum/user.enum';
import { EmployeeInfoEntity } from '../../domain/organization/employee/entities/employee-info.entity';
import { DepartmentInfoEntity } from '../../domain/organization/department/entities/department-info.entity';

/**
 * 직원 관리 컨트롤러
 * - 직원 조회 및 isExclude 토글, 부서 배치 기능만 제공
 * - 직원 생성/삭제는 MMS 동기화를 통해서만 가능
 */
@ApiTags('employees')
@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EmployeesController {
    constructor(
        private readonly organizationManagementService: OrganizationManagementService,
        private readonly organizationQueryService: OrganizationQueryService,
    ) {}

    @Get()
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '직원 목록 조회' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'isExclude', required: false, type: Boolean, description: '제외된 직원 포함 여부' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '직원 목록이 성공적으로 조회되었습니다.',
    })
    async getEmployees(
        @Query() paginationQuery: PaginationQueryDto,
        @Query('isExcludedFromCalculation') isExcludedFromCalculation?: boolean,
    ): Promise<{ employees: EmployeeInfoEntity[]; total: number }> {
        return await this.organizationQueryService.getEmployees(paginationQuery, isExcludedFromCalculation);
    }

    @Get(':employeeId')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '직원 단일 조회' })
    @ApiParam({ name: 'employeeId', description: '직원 ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '직원이 성공적으로 조회되었습니다.',
        type: EmployeeInfoEntity,
    })
    async getEmployeeById(@Param('employeeId') employeeId: string): Promise<EmployeeInfoEntity | null> {
        return await this.organizationQueryService.getEmployeeById(employeeId);
    }

    @Get('number/:employeeNumber')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '사번으로 직원 조회' })
    @ApiParam({ name: 'employeeNumber', description: '직원 사번' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '직원이 성공적으로 조회되었습니다.',
        type: EmployeeInfoEntity,
    })
    async getEmployeeByEmployeeNumber(
        @Param('employeeNumber') employeeNumber: string,
    ): Promise<EmployeeInfoEntity | null> {
        return await this.organizationQueryService.getEmployeeByEmployeeNumber(employeeNumber);
    }

    @Get(':employeeId/with-department')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '직원과 소속 부서 함께 조회' })
    @ApiParam({ name: 'employeeId', description: '직원 ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '직원과 소속 부서가 성공적으로 조회되었습니다.',
    })
    async getEmployeeWithDepartment(
        @Param('employeeId') employeeId: string,
    ): Promise<{ employee: EmployeeInfoEntity | null; department: DepartmentInfoEntity | null }> {
        return await this.organizationQueryService.getEmployeeWithDepartment(employeeId);
    }

    @Put(':employeeId/toggle-exclude')
    @Roles(UserRole.SYSTEM_ADMIN)
    @ApiOperation({ summary: '직원 제외 상태 토글' })
    @ApiParam({ name: 'employeeId', description: '직원 ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '직원 제외 상태가 성공적으로 변경되었습니다.',
        type: EmployeeInfoEntity,
    })
    async toggleEmployeeExclude(@Param('employeeId') employeeId: string): Promise<EmployeeInfoEntity> {
        return await this.organizationManagementService.toggleEmployeeExclude(employeeId);
    }

    @Post(':employeeId/assign-department/:departmentId')
    @Roles(UserRole.SYSTEM_ADMIN)
    @ApiOperation({ summary: '직원 부서 배치' })
    @ApiParam({ name: 'employeeId', description: '직원 ID' })
    @ApiParam({ name: 'departmentId', description: '부서 ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '직원이 부서에 성공적으로 배치되었습니다.',
    })
    async assignEmployeeToDepartment(
        @Param('employeeId') employeeId: string,
        @Param('departmentId') departmentId: string,
    ): Promise<void> {
        await this.organizationManagementService.assignEmployeeToDepartment(employeeId, departmentId);
    }
}
