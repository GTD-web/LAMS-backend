import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Query,
    Body,
    UseGuards,
    HttpStatus,
    ParseUUIDPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiParam,
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UserBusinessService } from '@src/business/user/user.business';
import { UserContextService } from '@src/contexts/user/user-context.service';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { RolesGuard } from '@src/common/guards/roles.guard';
import { Roles } from '@src/common/decorators/roles.decorator';
import { GetUser } from '@src/common/decorators/get-user.decorator';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { ErrorResponseDto } from '@src/common/dtos/common/error-response.dto';
import { ManageDepartmentAuthorityDto } from '@src/interfaces/dto/user/requests/manage-department-authority.dto';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';

/**
 * 사용자 권한 관리 컨트롤러
 * - 사용자 목록 조회, 부서 권한 관리 등의 API 제공
 */
@ApiTags('사용자 관리 (Users)')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(
        private readonly userBusinessService: UserBusinessService,
        private readonly userContextService: UserContextService,
    ) {}

    @Get()
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '사용자 목록 조회',
        description: '페이지네이션된 사용자 목록을 조회합니다. 관리자만 접근 가능합니다.',
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
        description: '사용자 목록이 성공적으로 조회되었습니다.',
        type: PaginatedResponseDto<UserResponseDto>,
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
    async getUsers(@Query() paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
        return this.userBusinessService.getUserList(paginationQuery);
    }

    @Get('profile')
    @ApiOperation({
        summary: '내 프로필 조회',
        description: '현재 로그인된 사용자의 프로필을 조회합니다.',
    })
    @ApiOkResponse({
        description: '프로필이 성공적으로 조회되었습니다.',
        type: UserResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    async getMyProfile(@GetUser() user: LamsUserEntity): Promise<UserResponseDto> {
        return this.userBusinessService.getProfile(user.userId);
    }

    @Get(':userId')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '사용자 단일 조회',
        description: '특정 사용자의 정보를 조회합니다. 관리자만 접근 가능합니다.',
    })
    @ApiParam({
        name: 'userId',
        description: '사용자 ID (UUID)',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: '사용자가 성공적으로 조회되었습니다.',
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
    async getUserById(@Param('userId', ParseUUIDPipe) userId: string): Promise<UserResponseDto> {
        return this.userBusinessService.getProfile(userId);
    }

    @Post('departments/:departmentId/authorities')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '부서 권한 관리',
        description: '사용자의 부서 검토/접근 권한을 추가하거나 삭제합니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID (UUID)',
        type: 'string',
        format: 'uuid',
    })
    @ApiBody({
        type: ManageDepartmentAuthorityDto,
        description: '권한 관리 요청 정보',
    })
    @ApiOkResponse({
        description: '부서 권한이 성공적으로 변경되었습니다.',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '부서 권한이 성공적으로 변경되었습니다.' },
                departmentId: { type: 'string', format: 'uuid' },
                userId: { type: 'string', format: 'uuid' },
                action: { type: 'string', enum: ['add', 'delete'] },
                type: { type: 'string', enum: ['access', 'review'] },
            },
        },
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 데이터',
        type: ErrorResponseDto,
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
        description: '사용자 또는 부서를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    async manageDepartmentAuthority(
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
        @Body() body: ManageDepartmentAuthorityDto,
    ): Promise<{
        success: boolean;
        message: string;
        departmentId: string;
        userId: string;
        action: 'add' | 'delete';
        type: 'access' | 'review';
    }> {
        const { userId, action, type } = body;

        // 비즈니스 서비스를 통해 권한 변경
        await this.userBusinessService.manageDepartmentAuthority(departmentId, userId, action, type);

        const actionText = action === 'add' ? '추가' : '삭제';
        const typeText = type === 'access' ? '접근' : '검토';

        return {
            success: true,
            message: `부서 ${typeText} 권한이 성공적으로 ${actionText}되었습니다.`,
            departmentId,
            userId,
            action,
            type,
        };
    }

    @Get(':userId/departments/authorities')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '사용자 부서 권한 조회',
        description: '특정 사용자의 부서 권한 목록을 조회합니다.',
    })
    @ApiParam({
        name: 'userId',
        description: '사용자 ID (UUID)',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: '사용자 부서 권한이 성공적으로 조회되었습니다.',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', format: 'uuid' },
                accessDepartments: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            departmentId: { type: 'string', format: 'uuid' },
                            departmentName: { type: 'string' },
                            departmentCode: { type: 'string' },
                        },
                    },
                },
                reviewDepartments: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            departmentId: { type: 'string', format: 'uuid' },
                            departmentName: { type: 'string' },
                            departmentCode: { type: 'string' },
                        },
                    },
                },
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
    async getUserDepartmentAuthorities(@Param('userId', ParseUUIDPipe) userId: string): Promise<{
        userId: string;
        accessDepartments: Array<{
            departmentId: string;
            departmentName: string;
            departmentCode: string;
        }>;
        reviewDepartments: Array<{
            departmentId: string;
            departmentName: string;
            departmentCode: string;
        }>;
    }> {
        const authorities = await this.userBusinessService.getUserDepartmentAuthorities(userId);

        return {
            userId,
            accessDepartments: authorities.accessDepartments.map((dept) => ({
                departmentId: dept.departmentId,
                departmentName: dept.departmentName,
                departmentCode: dept.departmentCode,
            })),
            reviewDepartments: authorities.reviewDepartments.map((dept) => ({
                departmentId: dept.departmentId,
                departmentName: dept.departmentName,
                departmentCode: dept.departmentCode,
            })),
        };
    }
}
