import { Controller, Get, Put, Post, Param, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationQueryDto } from '../../common/dtos/pagination/pagination-query.dto';
import { UserRole } from '../../domain/user/enum/user.enum';
import { EmployeeResponseDto } from '../dto/organization/responses/employee-response.dto';
import { PaginatedResponseDto } from '../../common/dtos/pagination/pagination-response.dto';
import { EmployeeWithDepartmentResponseDto } from '../dto/organization/responses/employee-with-department-response.dto';
import { DepartmentResponseDto } from '../dto/organization/responses/department-response.dto';
import { OrganizationBusinessService } from '@src/business/organization/organization.business';

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
    constructor(private readonly organizationBusinessService: OrganizationBusinessService) {}

    // @Get()
    // @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    // @ApiOperation({ summary: '직원 목록 조회' })
    // @ApiQuery({ name: 'page', required: false, type: Number })
    // @ApiQuery({ name: 'limit', required: false, type: Number })
    // @ApiQuery({ name: 'isExclude', required: false, type: Boolean, description: '제외된 직원 포함 여부' })
    // @ApiResponse({
    //     status: HttpStatus.OK,
    //     description: '직원 목록이 성공적으로 조회되었습니다.',
    //     type: PaginatedResponseDto<EmployeeResponseDto>,
    // })
    // async getEmployees(
    //     @Query() paginationQuery: PaginationQueryDto,
    //     @Query('isExcludedFromCalculation') isExcludedFromCalculation?: boolean,
    // ): Promise<PaginatedResponseDto<EmployeeResponseDto>> {
    //     return await this.organizationBusinessService.getEmployees(paginationQuery, isExcludedFromCalculation);
    // }

    // @Get(':employeeId')
    // @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    // @ApiOperation({ summary: '직원 단일 조회' })
    // @ApiParam({ name: 'employeeId', description: '직원 ID' })
    // @ApiResponse({
    //     status: HttpStatus.OK,
    //     description: '직원이 성공적으로 조회되었습니다.',
    //     type: EmployeeResponseDto,
    // })
    // async getEmployeeById(@Param('employeeId') employeeId: string): Promise<EmployeeResponseDto | null> {
    //     const employee = await this.organizationBusinessService.getEmployeeById(employeeId);
    //     if (!employee) return null;
    //     return new EmployeeResponseDto(employee);
    // }

    // @Get(':employeeId/with-department')
    // @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    // @ApiOperation({ summary: '직원과 소속 부서 함께 조회' })
    // @ApiParam({ name: 'employeeId', description: '직원 ID' })
    // @ApiResponse({
    //     status: HttpStatus.OK,
    //     description: '직원과 소속 부서가 성공적으로 조회되었습니다.',
    //     type: EmployeeWithDepartmentResponseDto,
    // })
    // async getEmployeeWithDepartment(
    //     @Param('employeeId') employeeId: string,
    // ): Promise<EmployeeWithDepartmentResponseDto> {
    //     const result = await this.organizationBusinessService.getEmployeeWithDepartment(employeeId);
    //     return new EmployeeWithDepartmentResponseDto({
    //         employee: result.employee ? new EmployeeResponseDto(result.employee) : null,
    //         department: result.department ? new DepartmentResponseDto(result.department) : null,
    //     });
    // }

    // @Put(':employeeId/toggle-exclude')
    // @Roles(UserRole.SYSTEM_ADMIN)
    // @ApiOperation({ summary: '직원 제외 상태 토글' })
    // @ApiParam({ name: 'employeeId', description: '직원 ID' })
    // @ApiResponse({
    //     status: HttpStatus.OK,
    //     description: '직원 제외 상태가 성공적으로 변경되었습니다.',
    //     type: EmployeeResponseDto,
    // })
    // async toggleEmployeeExclude(@Param('employeeId') employeeId: string): Promise<EmployeeResponseDto> {
    //     const employee = await this.organizationBusinessService.toggleEmployeeExclude(employeeId);
    //     return new EmployeeResponseDto(employee);
    // }

    // @Post(':employeeId/assign-department/:departmentId')
    // @Roles(UserRole.SYSTEM_ADMIN)
    // @ApiOperation({ summary: '직원 부서 배치' })
    // @ApiParam({ name: 'employeeId', description: '직원 ID' })
    // @ApiParam({ name: 'departmentId', description: '부서 ID' })
    // @ApiResponse({
    //     status: HttpStatus.OK,
    //     description: '직원이 부서에 성공적으로 배치되었습니다.',
    // })
    // async assignEmployeeToDepartment(
    //     @Param('employeeId') employeeId: string,
    //     @Param('departmentId') departmentId: string,
    // ): Promise<void> {
    //     await this.organizationBusinessService.assignEmployeeToDepartment(employeeId, departmentId);
    // }
}
