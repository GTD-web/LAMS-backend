import { Controller, Get, Post, Body, Param, Query, UseGuards, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam,
    ApiQuery,
    ApiBearerAuth,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UserBusinessService } from '@src/business/user/user.business';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { RolesGuard } from '@src/common/guards/roles.guard';
import { Roles } from '@src/common/decorators/roles.decorator';
import { GetUser } from '@src/common/decorators/get-user.decorator';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { SearchUserDto } from '@src/interfaces/dto/user/requests/search-user.dto';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { ManageDepartmentAuthorityDto } from '@src/interfaces/dto/organization/requests/manage-department-authority.dto';
import { DepartmentAuthorityResponse } from '@src/interfaces/dto/organization/responses/department-authority-response.dto';
import { ErrorResponseDto } from '@src/common/dtos/common/error-response.dto';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { SuccessMessageHelper } from '@src/common/helpers/success-message.helper';
import { PaginatedSuccessResponse, SuccessResponseWithData } from '@src/common/types/success-response.type';

/**
 * 사용자 관리 컨트롤러
 * - 사용자 목록 조회, 프로필 조회, 검색 등의 API 제공
 * - 부서 권한 관리 기능 포함
 */
@ApiTags('사용자 관리 (Users)')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly userBusinessService: UserBusinessService) {}

    @Get()
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '사용자 목록 조회',
        description: '페이지네이션된 사용자 목록을 조회합니다.',
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
        description: '사용자 목록 조회 성공',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '사용자 목록이 성공적으로 조회되었습니다.' },
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/UserResponseDto' },
                },
                meta: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        total: { type: 'integer', example: 100 },
                        totalPages: { type: 'integer', example: 10 },
                    },
                },
                timestamp: { type: 'string', format: 'date-time' },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '접근 권한 없음 - 관리자 권한 필요',
        type: ErrorResponseDto,
    })
    async getUserList(
        @Query() paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedSuccessResponse<UserResponseDto>> {
        return this.userBusinessService.getUserList(paginationQuery);
    }

    @Get('search')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '사용자 검색',
        description: '다양한 조건으로 사용자를 검색합니다. 키워드 검색 시 이름, 이메일, 로그인 ID를 통합 검색합니다.',
    })
    @ApiQuery({
        name: 'userId',
        description: '사용자 ID (UUID)',
        type: 'string',
        required: false,
    })
    @ApiQuery({
        name: 'email',
        description: '사용자 이메일 (부분 검색)',
        type: 'string',
        required: false,
    })
    @ApiQuery({
        name: 'name',
        description: '사용자 이름 (부분 검색)',
        type: 'string',
        required: false,
    })
    @ApiQuery({
        name: 'loginId',
        description: '로그인 ID (부분 검색)',
        type: 'string',
        required: false,
    })
    @ApiQuery({
        name: 'keyword',
        description: '검색 키워드 (이름, 이메일, 로그인 ID 통합 검색)',
        type: 'string',
        required: false,
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
        description: '사용자 검색 성공',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '사용자 검색이 성공적으로 완료되었습니다.' },
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/UserResponseDto' },
                },
                meta: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        total: { type: 'integer', example: 5 },
                        totalPages: { type: 'integer', example: 1 },
                    },
                },
                timestamp: { type: 'string', format: 'date-time' },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '접근 권한 없음 - 관리자 권한 필요',
        type: ErrorResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 검색 조건',
        type: ErrorResponseDto,
    })
    async searchUsers(
        @Query() searchDto: SearchUserDto,
        @Query() paginationQuery: PaginationQueryDto,
    ): Promise<PaginatedSuccessResponse<UserResponseDto>> {
        return this.userBusinessService.searchUsers(searchDto, paginationQuery);
    }

    @Get(':id')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '사용자 상세 조회',
        description: '사용자 ID로 특정 사용자의 상세 정보를 조회합니다.',
    })
    @ApiParam({
        name: 'id',
        description: '사용자 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiOkResponse({
        description: '사용자 상세 조회 성공',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '사용자 프로필이 성공적으로 조회되었습니다.' },
                data: { $ref: '#/components/schemas/UserResponseDto' },
                timestamp: { type: 'string', format: 'date-time' },
            },
        },
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
        description: '사용자를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    async getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<SuccessResponseWithData<UserResponseDto>> {
        return this.userBusinessService.getUserProfile(id);
    }

    @Post('departments/:departmentId/authorities/:type/:action')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '부서 권한 관리',
        description: '사용자의 부서 권한을 추가하거나 삭제합니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiParam({
        name: 'type',
        description: '권한 타입',
        enum: ['access', 'review'],
        example: 'access',
    })
    @ApiParam({
        name: 'action',
        description: '작업 타입',
        enum: ['add', 'delete'],
        example: 'add',
    })
    @ApiBody({
        type: ManageDepartmentAuthorityDto,
        description: '권한 관리 데이터',
    })
    @ApiCreatedResponse({
        description: '부서 권한 관리 성공',
        type: DepartmentAuthorityResponse,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '접근 권한 없음 - 관리자 권한 필요',
        type: ErrorResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 데이터',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '부서 또는 사용자를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    async manageDepartmentAuthority(
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
        @Param('type') type: 'access' | 'review',
        @Param('action') action: 'add' | 'delete',
        @Body() dto: ManageDepartmentAuthorityDto,
    ): Promise<DepartmentAuthorityResponse> {
        return this.userBusinessService.manageDepartmentAuthority(departmentId, dto.userId, type, action);
    }
}
