import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Query,
    UseGuards,
    HttpStatus,
    ParseUUIDPipe,
    BadRequestException,
    ValidationPipe,
    UsePipes,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiParam,
    ApiBody,
    ApiBearerAuth,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UserBusinessService } from '@src/business/user/user.business';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { RolesGuard } from '@src/common/guards/roles.guard';
import { Roles } from '@src/common/decorators/roles.decorator';
import { GetUser } from '@src/common/decorators/get-user.decorator';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { ManageDepartmentAuthorityDto } from '@src/interfaces/dto/organization/requests/manage-department-authority.dto';
import { DepartmentAuthorityResponse } from '@src/interfaces/dto/organization/responses/department-authority-response.dto';
import { ErrorResponseDto } from '@src/common/dtos/common/error-response.dto';

/**
 * 사용자 관리 컨트롤러
 * - 사용자 목록 조회, 프로필 관리, 부서 권한 관리 등의 API 제공
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
        description: '현재 로그인한 사용자의 프로필 정보를 조회합니다.',
    })
    @ApiOkResponse({
        description: '프로필이 성공적으로 조회되었습니다.',
        type: UserResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: '서버 내부 오류',
        type: ErrorResponseDto,
    })
    async getProfile(@GetUser('userId') userId: string): Promise<UserResponseDto> {
        return this.userBusinessService.getUserProfile(userId);
    }

    @Post('departments/:departmentId/authorities/:type/:action')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    @ApiOperation({
        summary: '부서 권한 관리',
        description: '사용자의 부서 접근/검토 권한을 추가하거나 삭제합니다. 관리자만 접근 가능합니다.',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID (UUID)',
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
        description: '수행할 작업',
        enum: ['add', 'delete'],
        example: 'add',
    })
    @ApiBody({
        type: ManageDepartmentAuthorityDto,
        description: '권한을 관리할 사용자 정보',
    })
    @ApiCreatedResponse({
        description: '부서 권한이 성공적으로 관리되었습니다.',
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
    @ApiNotFoundResponse({
        description: '부서 또는 사용자를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 데이터',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: '서버 내부 오류',
        type: ErrorResponseDto,
    })
    async manageDepartmentAuthority(
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
        @Param('type') type: 'access' | 'review',
        @Param('action') action: 'add' | 'delete',
        @Body() body: ManageDepartmentAuthorityDto,
    ): Promise<DepartmentAuthorityResponse> {
        // 컨트롤러 단에서 입력 검증
        this.validateAuthorityParams(type, action);

        const result = await this.userBusinessService.manageDepartmentAuthority(
            departmentId,
            body.userId,
            type,
            action,
        );
        return new DepartmentAuthorityResponse(result);
    }

    @Get(':userId/departments/authorities')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '사용자 부서 권한 조회',
        description: '특정 사용자의 모든 부서 권한 정보를 조회합니다. 관리자만 접근 가능합니다.',
    })
    @ApiParam({
        name: 'userId',
        description: '사용자 ID (UUID)',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiOkResponse({
        description: '사용자 부서 권한 정보가 성공적으로 조회되었습니다.',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', example: 'uuid-v4-string' },
                reviewDepartments: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['dept-1', 'dept-2'],
                },
                accessDepartments: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['dept-3', 'dept-4'],
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
    @ApiInternalServerErrorResponse({
        description: '서버 내부 오류',
        type: ErrorResponseDto,
    })
    async getUserDepartmentAuthorities(@Param('userId', ParseUUIDPipe) userId: string): Promise<{
        userId: string;
        reviewDepartments: string[];
        accessDepartments: string[];
    }> {
        return this.userBusinessService.getUserDepartmentAuthorities(userId);
    }

    /**
     * 권한 파라미터 검증
     * 컨트롤러 단에서 입력값 검증 수행
     */
    private validateAuthorityParams(type: string, action: string): void {
        const validTypes = ['access', 'review'];
        const validActions = ['add', 'delete'];

        if (!validTypes.includes(type)) {
            throw new BadRequestException(`잘못된 권한 타입입니다. 허용된 값: ${validTypes.join(', ')}`);
        }

        if (!validActions.includes(action)) {
            throw new BadRequestException(`잘못된 작업 타입입니다. 허용된 값: ${validActions.join(', ')}`);
        }
    }
}
