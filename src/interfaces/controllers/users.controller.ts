import { Controller, Get, Post, Body, Param, Query, UseGuards, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
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
} from '@nestjs/swagger';
import { UserBusinessService } from '@src/business/user/user.business';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { RolesGuard } from '@src/common/guards/roles.guard';
import { Roles } from '@src/common/decorators/roles.decorator';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { ManageDepartmentAuthorityDto } from '@src/interfaces/dto/organization/requests/manage-department-authority.dto';
import { ErrorResponseDto } from '@src/common/dtos/common/error-response.dto';
import { UserEntity } from '@src/domain/user/entities/user.entity';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';

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
        type: PaginatedResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '접근 권한 없음 - 관리자 권한 필요',
        type: ErrorResponseDto,
    })
    async getUserList(@Query() paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
        return this.userBusinessService.getUserList(paginationQuery);
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
        type: UserResponseDto,
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
    async getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
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
        type: UserEntity,
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
        @Param('action') action: 'add' | 'remove',
        @Body() dto: ManageDepartmentAuthorityDto,
    ): Promise<UserEntity> {
        return this.userBusinessService.manageDepartmentAuthority(departmentId, dto.userId, type, action);
    }
}
