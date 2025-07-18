import { Controller, Get, Put, Param, Query, UseGuards, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiParam,
    ApiBearerAuth,
    ApiOkResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { OrganizationBusinessService } from '@src/business/organization/organization.business';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { RolesGuard } from '@src/common/guards/roles.guard';
import { Roles } from '@src/common/decorators/roles.decorator';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { DepartmentResponseDto } from '@src/interfaces/dto/organization/responses/department-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { ErrorResponseDto } from '@src/common/dtos/common/error-response.dto';
import { SuccessResponseWithData } from '@src/common/types/success-response.type';

/**
 * 부서 관리 컨트롤러
 * - 부서 목록 조회, 제외 여부 관리 등의 API 제공
 */
@ApiTags('부서 관리 (Departments)')
@Controller('departments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DepartmentsController {
    constructor(private readonly organizationBusinessService: OrganizationBusinessService) {}

    @Get()
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '부서 목록 조회',
        description: '페이지네이션된 부서 목록을 조회합니다. 관리자만 접근 가능합니다.',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: '페이지 번호 (기본값: 1)',
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: '페이지당 항목 수 (기본값: 10)',
        example: 10,
    })
    @ApiOkResponse({
        description: '부서 목록이 성공적으로 조회되었습니다.',
        type: PaginatedResponseDto<DepartmentResponseDto>,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '접근 권한 없음 - 관리자 권한 필요',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: '서버 내부 오류',
        type: ErrorResponseDto,
    })
    async getDepartments(
        @Query() paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedResponseDto<DepartmentResponseDto>> {
        return this.organizationBusinessService.getDepartmentList(paginationQuery);
    }

    @Put(':departmentId/toggle-exclude')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '부서 제외 여부 변경',
        description: '특정 부서의 제외 여부를 토글합니다. 관리자만 접근 가능합니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID (UUID)',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: '부서 제외 여부가 성공적으로 변경되었습니다.',
        type: DepartmentResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '접근 권한 없음 - 관리자 권한 필요',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '부서를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: '서버 내부 오류',
        type: ErrorResponseDto,
    })
    async toggleDepartmentExclusion(
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
    ): Promise<SuccessResponseWithData<DepartmentResponseDto>> {
        return this.organizationBusinessService.toggleDepartmentExclusion(departmentId);
    }
}
