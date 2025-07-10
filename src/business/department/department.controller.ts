import { Controller, Get, Param, Query, UseGuards, ParseUUIDPipe, Patch, ParseBoolPipe } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiBearerAuth,
    ApiOkResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
} from '@nestjs/swagger';
import { DepartmentBusinessService } from './department.business';
import { DepartmentAdminBusinessService } from './department-admin.business';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { RolesGuard } from '@src/common/guards/roles.guard';
import { CheckDepartmentAccessGuard } from '@src/common/guards/check-department-access.guard';
import { Roles } from '@src/common/decorators/roles.decorator';
import { GetUser } from '@src/common/decorators/get-user.decorator';
import { DepartmentInfoEntity } from '@src/domain/organization/department/entities/department-info.entity';
import { ErrorResponseDto } from '@src/common/dtos/common/error-response.dto';
import { CustomResponseDto } from '@src/common/dtos/common/custom-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';

@ApiTags('부서')
@Controller({ path: 'departments', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DepartmentController {
    constructor(
        private readonly departmentBusinessService: DepartmentBusinessService,
        private readonly departmentAdminBusinessService: DepartmentAdminBusinessService,
    ) {}

    // ========== 일반 사용자 기능 ==========

    @Get('my-access-authority')
    @ApiOperation({
        summary: '접근 권한에 포함된 부서 조회',
        description: '현재 사용자가 접근 권한을 가진 부서 목록을 조회합니다.',
    })
    @ApiOkResponse({
        description: '접근 권한 부서 조회 성공',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { $ref: '#/components/schemas/DepartmentInfoEntity' } },
                message: { type: 'string', example: '접근 권한에 포함된 부서를 조회하였습니다.' },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: '인증 필요',
        type: ErrorResponseDto,
    })
    async getDepartmentByAccessAuthority(
        @GetUser() user: LamsUserEntity,
    ): Promise<CustomResponseDto<DepartmentInfoEntity[]>> {
        const data = await this.departmentBusinessService.getDepartmentByAccessAuthority(user);
        return new CustomResponseDto(data, '접근 권한에 포함된 부서를 조회하였습니다.');
    }

    @Get('my-review')
    @ApiOperation({
        summary: '내 검토 권한 부서 조회',
        description: '현재 사용자가 검토 권한을 가진 부서 목록을 조회합니다.',
    })
    @ApiOkResponse({
        description: '검토 권한 부서 조회 성공',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { $ref: '#/components/schemas/DepartmentInfoEntity' } },
                message: { type: 'string', example: '검토 권한 부서를 조회하였습니다.' },
            },
        },
    })
    async getMyReviewDepartments(@GetUser() user: LamsUserEntity): Promise<CustomResponseDto<DepartmentInfoEntity[]>> {
        const data = await this.departmentBusinessService.getDepartmentsByReviewAuthority(user);
        return new CustomResponseDto(data, '검토 권한 부서를 조회하였습니다.');
    }

    @Get('user/:departmentId')
    @ApiOperation({
        summary: '부서 조회 (권한 기반)',
        description: '접근 권한이 있는 부서 정보를 조회합니다.',
    })
    @UseGuards(CheckDepartmentAccessGuard)
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: '부서 조회 성공',
        schema: {
            type: 'object',
            properties: {
                data: { $ref: '#/components/schemas/DepartmentInfoEntity' },
                message: { type: 'string', example: '부서 정보를 조회하였습니다.' },
            },
        },
    })
    async getDepartmentById(
        @Param('departmentId') departmentId: string,
    ): Promise<CustomResponseDto<DepartmentInfoEntity>> {
        const data = await this.departmentBusinessService.getAuthorityDepartmentById(departmentId);
        return new CustomResponseDto(data, '부서 정보를 조회하였습니다.');
    }

    @Get('hierarchy')
    @ApiOperation({
        summary: '부서 계층 구조 조회',
        description: '부서의 계층 구조를 조회합니다.',
    })
    @ApiOkResponse({
        description: '부서 계층 구조 조회 성공',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { $ref: '#/components/schemas/DepartmentInfoEntity' } },
                message: { type: 'string', example: '부서 계층 구조를 조회하였습니다.' },
            },
        },
    })
    async getDepartmentHierarchy(): Promise<CustomResponseDto<DepartmentInfoEntity[]>> {
        const data = await this.departmentBusinessService.getDepartmentHierarchy();
        return new CustomResponseDto(data, '부서 계층 구조를 조회하였습니다.');
    }

    @Get('search')
    @ApiOperation({
        summary: '부서 검색',
        description: '부서명으로 부서를 검색합니다.',
    })
    @ApiQuery({
        name: 'q',
        description: '검색어 (최소 2자)',
        type: 'string',
        example: '개발',
        required: true,
    })
    @ApiOkResponse({
        description: '부서 검색 성공',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { $ref: '#/components/schemas/DepartmentInfoEntity' } },
                message: { type: 'string', example: '부서 검색을 완료하였습니다.' },
            },
        },
    })
    async searchDepartments(@Query('q') searchTerm: string): Promise<CustomResponseDto<DepartmentInfoEntity[]>> {
        const data = await this.departmentBusinessService.searchDepartments(searchTerm);
        return new CustomResponseDto(data, '부서 검색을 완료하였습니다.');
    }

    @Get('mms/sync')
    @ApiOperation({
        summary: 'MMS 부서 동기화 (관리자 전용)',
        description: 'MMS 시스템과 부서 정보를 동기화합니다.',
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    @ApiOkResponse({
        description: 'MMS 동기화 성공',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'object' },
                message: { type: 'string', example: 'MMS 데이터 동기화를 완료하였습니다.' },
            },
        },
    })
    @ApiForbiddenResponse({
        description: '관리자 권한 필요',
        type: ErrorResponseDto,
    })
    async syncMMS(): Promise<CustomResponseDto<any>> {
        const data = await this.departmentAdminBusinessService.syncMMS();
        return new CustomResponseDto(data, 'MMS 데이터 동기화를 완료하였습니다.');
    }

    // ========== 관리자 전용 기능 ==========

    @Get()
    @ApiOperation({
        summary: '부서 목록 조회 (관리자 전용)',
        description: '모든 부서 목록을 페이지네이션으로 조회합니다.',
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    @ApiQuery({
        name: 'page',
        description: '페이지 번호',
        type: 'number',
        example: 1,
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        description: '페이지당 항목 수',
        type: 'number',
        example: 10,
        required: false,
    })
    @ApiQuery({
        name: 'isExclude',
        description: '제외된 부서 포함 여부',
        type: 'boolean',
        example: false,
        required: true,
    })
    @ApiOkResponse({
        description: '부서 목록 조회 성공',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'object' },
                message: { type: 'string', example: '부서 목록을 조회하였습니다.' },
            },
        },
    })
    @ApiForbiddenResponse({
        description: '관리자 권한 필요',
        type: ErrorResponseDto,
    })
    async getDepartmentList(
        @Query() query: PaginationQueryDto,
        @Query('isExclude', ParseBoolPipe) isExclude: boolean,
    ): Promise<CustomResponseDto<any>> {
        const data = await this.departmentAdminBusinessService.getDepartmentList(query, isExclude);
        return new CustomResponseDto(data, '부서 목록을 조회하였습니다.');
    }

    @Get(':departmentId')
    @ApiOperation({
        summary: '부서 조회 (관리자 전용)',
        description: '관리자 권한으로 부서 정보를 조회합니다.',
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: '부서 조회 성공',
        schema: {
            type: 'object',
            properties: {
                data: { $ref: '#/components/schemas/DepartmentInfoEntity' },
                message: { type: 'string', example: '부서 정보를 조회하였습니다.' },
            },
        },
    })
    @ApiForbiddenResponse({
        description: '관리자 권한 필요',
        type: ErrorResponseDto,
    })
    async getDepartmentByIdForAdmin(
        @Param('departmentId') departmentId: string,
    ): Promise<CustomResponseDto<DepartmentInfoEntity>> {
        const data = await this.departmentAdminBusinessService.getDepartmentById(departmentId);
        return new CustomResponseDto(data, '부서 정보를 조회하였습니다.');
    }

    @Patch('exclude-from-call-list/:departmentId')
    @ApiOperation({
        summary: '부서를 호출 목록에서 제외 (관리자 전용)',
        description: '부서의 제외 상태를 토글합니다.',
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: '부서 제외 상태 토글 성공',
        schema: {
            type: 'object',
            properties: {
                data: { $ref: '#/components/schemas/DepartmentInfoEntity' },
                message: { type: 'string', example: '부서 제외 목록을 조회하였습니다.' },
            },
        },
    })
    @ApiForbiddenResponse({
        description: '관리자 권한 필요',
        type: ErrorResponseDto,
    })
    async toggleExclude(@Param('departmentId') departmentId: string): Promise<CustomResponseDto<DepartmentInfoEntity>> {
        const data = await this.departmentAdminBusinessService.toggleExclude(departmentId);
        return new CustomResponseDto(data, '부서 호출 제외 토글을 변경 완료하였습니다.');
    }

    @Patch('include-access-authority/:departmentId')
    @ApiOperation({
        summary: '부서 접근 권한 추가 (관리자 전용)',
        description: '사용자에게 부서 접근 권한을 추가합니다.',
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiQuery({
        name: 'userId',
        description: '사용자 ID',
        type: 'string',
        required: true,
    })
    @ApiOkResponse({
        description: '접근 권한 추가 성공',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'object' },
                message: { type: 'string', example: '부서 접근 권한을 추가하였습니다.' },
            },
        },
    })
    @ApiForbiddenResponse({
        description: '관리자 권한 필요',
        type: ErrorResponseDto,
    })
    async includeAccessAuthority(
        @Param('departmentId') departmentId: string,
        @Query('userId') userId: string,
    ): Promise<CustomResponseDto<any>> {
        const data = await this.departmentAdminBusinessService.includeAccessAuthority(departmentId, userId);
        return new CustomResponseDto(data, '부서 접근 권한을 추가하였습니다.');
    }

    @Patch('include-review-authority/:departmentId')
    @ApiOperation({
        summary: '부서 검토 권한 추가 (관리자 전용)',
        description: '사용자에게 부서 검토 권한을 추가합니다.',
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiQuery({
        name: 'userId',
        description: '사용자 ID',
        type: 'string',
        required: true,
    })
    @ApiOkResponse({
        description: '검토 권한 추가 성공',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'object' },
                message: { type: 'string', example: '부서 검토 권한을 추가하였습니다.' },
            },
        },
    })
    @ApiForbiddenResponse({
        description: '관리자 권한 필요',
        type: ErrorResponseDto,
    })
    async includeReviewAuthority(
        @Param('departmentId') departmentId: string,
        @Query('userId') userId: string,
    ): Promise<CustomResponseDto<any>> {
        const data = await this.departmentAdminBusinessService.includeReviewAuthority(departmentId, userId);
        return new CustomResponseDto(data, '부서 검토 권한을 추가하였습니다.');
    }

    @Patch('remove-access-authority/:departmentId')
    @ApiOperation({
        summary: '부서 접근 권한 제거 (관리자 전용)',
        description: '사용자의 부서 접근 권한을 제거합니다.',
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiQuery({
        name: 'userId',
        description: '사용자 ID',
        type: 'string',
        required: true,
    })
    @ApiOkResponse({
        description: '접근 권한 제거 성공',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'object' },
                message: { type: 'string', example: '부서 접근 권한을 제거하였습니다.' },
            },
        },
    })
    @ApiForbiddenResponse({
        description: '관리자 권한 필요',
        type: ErrorResponseDto,
    })
    async removeAccessAuthority(
        @Param('departmentId') departmentId: string,
        @Query('userId') userId: string,
    ): Promise<CustomResponseDto<any>> {
        const data = await this.departmentAdminBusinessService.excludeAccessAuthority(departmentId, userId);
        return new CustomResponseDto(data, '부서 접근 권한을 제거하였습니다.');
    }

    @Patch('remove-review-authority/:departmentId')
    @ApiOperation({
        summary: '부서 검토 권한 제거 (관리자 전용)',
        description: '사용자의 부서 검토 권한을 제거합니다.',
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiQuery({
        name: 'userId',
        description: '사용자 ID',
        type: 'string',
        required: true,
    })
    @ApiOkResponse({
        description: '검토 권한 제거 성공',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'object' },
                message: { type: 'string', example: '부서 검토 권한을 제거하였습니다.' },
            },
        },
    })
    @ApiForbiddenResponse({
        description: '관리자 권한 필요',
        type: ErrorResponseDto,
    })
    async removeReviewAuthority(
        @Param('departmentId') departmentId: string,
        @Query('userId') userId: string,
    ): Promise<CustomResponseDto<any>> {
        const data = await this.departmentAdminBusinessService.excludeReviewAuthority(departmentId, userId);
        return new CustomResponseDto(data, '부서 검토 권한을 제거하였습니다.');
    }

    @Get(':id/employee-count')
    @ApiOperation({
        summary: '부서 직원 수 조회',
        description: '특정 부서의 직원 수를 조회합니다.',
    })
    @ApiParam({
        name: 'id',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: '부서 직원 수 조회 성공',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        departmentId: { type: 'string' },
                        employeeCount: { type: 'number' },
                    },
                },
                message: { type: 'string', example: '부서 직원 수를 조회하였습니다.' },
            },
        },
    })
    async getDepartmentEmployeeCount(
        @Param('id') departmentId: string,
    ): Promise<CustomResponseDto<{ departmentId: string; employeeCount: number }>> {
        const count = await this.departmentBusinessService.getDepartmentEmployeeCount(departmentId);
        const data = { departmentId, employeeCount: count };
        return new CustomResponseDto(data, '부서 직원 수를 조회하였습니다.');
    }
}
