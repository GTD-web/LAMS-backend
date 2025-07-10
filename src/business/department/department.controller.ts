import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Query,
    Body,
    UseGuards,
    ParseBoolPipe,
    ParseUUIDPipe,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiCreatedResponse,
    ApiBody,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { GetUser } from '@src/common/decorators/get-user.decorator';
import { Roles } from '@src/common/decorators/roles.decorator';
import { ErrorResponseDto } from '@src/common/dtos/common/error-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { RolesGuard } from '@src/common/guards/roles.guard';
import { CheckDepartmentAccessGuard } from '@src/common/guards/check-department-access.guard';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { DepartmentBusinessService } from './department.business';
import { DepartmentAdminBusinessService } from './department-admin.business';
import {
    DepartmentResponseDto,
    DepartmentDetailResponseDto,
    DepartmentListResponseDto,
    MMSSyncResponseDto,
    DepartmentStatusResponseDto,
} from './dto/responses/department-response.dto';
import {
    CreateDepartmentDto,
    UpdateDepartmentDto,
    DepartmentAuthorityDto,
    SearchDepartmentDto,
    DepartmentHierarchyDto,
} from './dto/requests/department-request.dto';

@Controller('departments')
@ApiTags('부서')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class DepartmentController {
    constructor(
        private readonly departmentBusinessService: DepartmentBusinessService,
        private readonly departmentAdminBusinessService: DepartmentAdminBusinessService,
    ) {}

    @Get('my-access-authority')
    @ApiOperation({
        summary: '접근 권한에 포함된 부서 조회',
        description: '현재 사용자가 접근 권한을 가진 부서 목록을 조회합니다.',
    })
    @ApiOkResponse({
        description: '접근 권한 부서 목록 조회 성공',
        type: [DepartmentResponseDto],
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    async getDepartmentByAccessAuthority(@GetUser() user: LamsUserEntity): Promise<DepartmentResponseDto[]> {
        const departments = await this.departmentBusinessService.getDepartmentByAccessAuthority(user);
        return departments.map((dept) => new DepartmentResponseDto(dept));
    }

    @Patch('exclude-from-call-list/:departmentId')
    @ApiOperation({
        summary: '부서를 호출 목록에서 제외 (관리자 전용)',
        description: '부서를 호출 목록에서 제외하거나 포함시킵니다. 토글 방식으로 동작합니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
    })
    @ApiOkResponse({
        description: '부서 제외 토글 성공',
        type: DepartmentResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '부서를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '권한 없음',
        type: ErrorResponseDto,
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    async toggleExcludeFromCallList(
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
    ): Promise<DepartmentResponseDto> {
        const department = await this.departmentAdminBusinessService.toggleExclude(departmentId);
        return new DepartmentResponseDto(department);
    }

    @Patch('include-access-authority/:departmentId')
    @ApiOperation({
        summary: '부서 접근 권한 추가 (관리자 전용)',
        description: '특정 사용자에게 부서 접근 권한을 추가합니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
    })
    @ApiQuery({
        name: 'userId',
        description: '사용자 ID',
        type: 'string',
    })
    @ApiOkResponse({
        description: '부서 접근 권한 추가 성공',
        type: Boolean,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '부서 또는 사용자를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '권한 없음',
        type: ErrorResponseDto,
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    async includeAccessAuthority(
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
        @Query('userId', ParseUUIDPipe) userId: string,
    ): Promise<boolean> {
        await this.departmentAdminBusinessService.includeAccessAuthority(departmentId, userId);
        return true;
    }

    @Patch('include-review-authority/:departmentId')
    @ApiOperation({
        summary: '부서 검토 권한 추가 (관리자 전용)',
        description: '특정 사용자에게 부서 검토 권한을 추가합니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
    })
    @ApiQuery({
        name: 'userId',
        description: '사용자 ID',
        type: 'string',
    })
    @ApiOkResponse({
        description: '부서 검토 권한 추가 성공',
        type: Boolean,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '부서 또는 사용자를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '권한 없음',
        type: ErrorResponseDto,
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    async includeReviewAuthority(
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
        @Query('userId', ParseUUIDPipe) userId: string,
    ): Promise<boolean> {
        await this.departmentAdminBusinessService.includeReviewAuthority(departmentId, userId);
        return true;
    }

    @Patch('exclude-access-authority/:departmentId')
    @ApiOperation({
        summary: '부서 접근 권한 제거 (관리자 전용)',
        description: '특정 사용자의 부서 접근 권한을 제거합니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
    })
    @ApiQuery({
        name: 'userId',
        description: '사용자 ID',
        type: 'string',
    })
    @ApiOkResponse({
        description: '부서 접근 권한 제거 성공',
        type: Boolean,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '부서 또는 사용자를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '권한 없음',
        type: ErrorResponseDto,
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    async removeAccessAuthority(
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
        @Query('userId', ParseUUIDPipe) userId: string,
    ): Promise<boolean> {
        const result = await this.departmentAdminBusinessService.excludeAccessAuthority(departmentId, userId);
        return result;
    }

    @Patch('exclude-review-authority/:departmentId')
    @ApiOperation({
        summary: '부서 검토 권한 제거 (관리자 전용)',
        description: '특정 사용자의 부서 검토 권한을 제거합니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
    })
    @ApiQuery({
        name: 'userId',
        description: '사용자 ID',
        type: 'string',
    })
    @ApiOkResponse({
        description: '부서 검토 권한 제거 성공',
        type: Boolean,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '부서 또는 사용자를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '권한 없음',
        type: ErrorResponseDto,
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    async removeReviewAuthority(
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
        @Query('userId', ParseUUIDPipe) userId: string,
    ): Promise<boolean> {
        const result = await this.departmentAdminBusinessService.excludeReviewAuthority(departmentId, userId);
        return result;
    }

    @Get('authority/:departmentId')
    @ApiOperation({
        summary: '권한이 있는 부서 조회',
        description: '특정 부서에 대한 권한 정보를 조회합니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
    })
    @ApiOkResponse({
        description: '부서 권한 정보 조회 성공',
        type: DepartmentResponseDto,
    })
    @ApiNotFoundResponse({
        description: '부서를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    async getDepartmentById(
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
    ): Promise<DepartmentResponseDto> {
        const department = await this.departmentBusinessService.getAuthorityDepartmentById(departmentId);
        return new DepartmentResponseDto(department);
    }

    @Get('admin/:departmentId')
    @ApiOperation({
        summary: '부서 상세 정보 조회 (관리자 전용)',
        description: '관리자가 특정 부서의 상세 정보를 조회합니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
    })
    @ApiOkResponse({
        description: '부서 상세 정보 조회 성공',
        type: DepartmentDetailResponseDto,
    })
    @ApiNotFoundResponse({
        description: '부서를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '권한 없음',
        type: ErrorResponseDto,
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    async getDepartmentByIdForAdmin(
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
    ): Promise<DepartmentDetailResponseDto> {
        const department = await this.departmentAdminBusinessService.getDepartmentById(departmentId);
        return new DepartmentDetailResponseDto(
            department,
            department.employees?.map((emp) => emp.employee) || [],
            department.accessAuthorities || [],
            department.reviewAuthorities || [],
        );
    }

    @Get('list')
    @ApiOperation({
        summary: '부서 목록 조회 (관리자 전용)',
        description: '관리자가 부서 목록을 조회합니다. 페이지네이션을 지원합니다.',
    })
    @ApiQuery({
        name: 'page',
        description: '페이지 번호',
        type: 'number',
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        description: '페이지 크기',
        type: 'number',
        required: false,
    })
    @ApiQuery({
        name: 'isExclude',
        description: '제외 여부',
        type: 'boolean',
        required: false,
    })
    @ApiOkResponse({
        description: '부서 목록 조회 성공',
        type: DepartmentListResponseDto,
    })
    @ApiForbiddenResponse({
        description: '권한 없음',
        type: ErrorResponseDto,
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    async getDepartmentList(
        @Query() query: PaginationQueryDto,
        @Query('isExclude', ParseBoolPipe) isExclude: boolean,
    ): Promise<DepartmentListResponseDto> {
        const result = await this.departmentAdminBusinessService.getDepartmentList(query, isExclude);
        return new DepartmentListResponseDto(
            result.data.map((dept) => new DepartmentResponseDto(dept)),
            result.meta.total,
        );
    }

    @Post('sync-mms')
    @ApiOperation({
        summary: 'MMS 동기화 (관리자 전용)',
        description: '외부 MMS 시스템과 부서 정보를 동기화합니다.',
    })
    @ApiOkResponse({
        description: 'MMS 동기화 성공',
        type: MMSSyncResponseDto,
    })
    @ApiForbiddenResponse({
        description: '권한 없음',
        type: ErrorResponseDto,
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    async syncMMS(): Promise<MMSSyncResponseDto> {
        const result = await this.departmentAdminBusinessService.syncMMS();
        return new MMSSyncResponseDto(result.syncedCount, result.errorCount);
    }

    @Post()
    @ApiOperation({
        summary: '부서 생성 (관리자 전용)',
        description: '새로운 부서를 생성합니다.',
    })
    @ApiBody({
        type: CreateDepartmentDto,
        description: '부서 생성 정보',
    })
    @ApiCreatedResponse({
        description: '부서 생성 성공',
        type: DepartmentResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '권한 없음',
        type: ErrorResponseDto,
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    async createDepartment(@Body() createDepartmentDto: CreateDepartmentDto): Promise<DepartmentResponseDto> {
        const department = await this.departmentAdminBusinessService.createDepartment(createDepartmentDto);
        return new DepartmentResponseDto(department);
    }

    @Patch(':departmentId')
    @ApiOperation({
        summary: '부서 정보 수정 (관리자 전용)',
        description: '기존 부서의 정보를 수정합니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
    })
    @ApiBody({
        type: UpdateDepartmentDto,
        description: '부서 수정 정보',
    })
    @ApiOkResponse({
        description: '부서 정보 수정 성공',
        type: DepartmentResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '부서를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '권한 없음',
        type: ErrorResponseDto,
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    async updateDepartment(
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
        @Body() updateDepartmentDto: UpdateDepartmentDto,
    ): Promise<DepartmentResponseDto> {
        const department = await this.departmentAdminBusinessService.updateDepartment(
            departmentId,
            updateDepartmentDto,
        );
        return new DepartmentResponseDto(department);
    }

    @Delete(':departmentId')
    @ApiOperation({
        summary: '부서 삭제 (관리자 전용)',
        description: '기존 부서를 삭제합니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
    })
    @ApiOkResponse({
        description: '부서 삭제 성공',
        type: Boolean,
    })
    @ApiNotFoundResponse({
        description: '부서를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '권한 없음',
        type: ErrorResponseDto,
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    async deleteDepartment(@Param('departmentId', ParseUUIDPipe) departmentId: string): Promise<boolean> {
        const result = await this.departmentAdminBusinessService.deleteDepartment(departmentId);
        return result;
    }
}
