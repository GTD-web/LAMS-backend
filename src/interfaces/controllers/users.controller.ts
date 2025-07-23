import { Controller, Get, Post, Delete, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
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
import { UserBusinessService } from '../../business/user/user.business';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../domain/user/enum/user.enum';
import { PaginationQueryDto } from '../../common/dtos/pagination/pagination-query.dto';
import { UserResponseDto } from '../../interfaces/dto/organization/responses/user-response.dto';
import { ErrorResponseDto } from '../../common/dtos/common/error-response.dto';
import { PaginatedResponseDto } from '../../common/dtos/pagination/pagination-response.dto';
import { AuthorityType } from '../../domain/user-department-authority/enum/authority-type.enum';

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

    // ==================== 부서 권한 관리 엔드포인트 ====================

    @Post(':userId/departments/:departmentId/access-authority')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '부서 접근 권한 부여',
        description: '사용자에게 특정 부서의 접근 권한을 부여합니다.',
    })
    @ApiParam({
        name: 'userId',
        description: '사용자 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiCreatedResponse({
        description: '접근 권한 부여 성공',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '접근 권한이 성공적으로 부여되었습니다.' },
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
        description: '잘못된 요청 데이터 또는 이미 권한이 존재함',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '부서 또는 사용자를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    async grantAccessAuthority(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
    ): Promise<{ success: boolean; message: string }> {
        const result = await this.userBusinessService.grantAuthority(userId, departmentId, AuthorityType.ACCESS);
        return {
            success: result,
            message: '접근 권한이 성공적으로 부여되었습니다.',
        };
    }

    @Post(':userId/departments/:departmentId/review-authority')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '부서 검토 권한 부여',
        description: '사용자에게 특정 부서의 검토 권한을 부여합니다.',
    })
    @ApiParam({
        name: 'userId',
        description: '사용자 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiCreatedResponse({
        description: '검토 권한 부여 성공',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '검토 권한이 성공적으로 부여되었습니다.' },
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
        description: '잘못된 요청 데이터 또는 이미 권한이 존재함',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '부서 또는 사용자를 찾을 수 없음',
        type: ErrorResponseDto,
    })
    async grantReviewAuthority(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
    ): Promise<{ success: boolean; message: string }> {
        const result = await this.userBusinessService.grantAuthority(userId, departmentId, AuthorityType.REVIEW);
        return {
            success: result,
            message: '검토 권한이 성공적으로 부여되었습니다.',
        };
    }

    @Delete(':userId/departments/:departmentId/access-authority')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '부서 접근 권한 삭제',
        description: '사용자의 특정 부서 접근 권한을 삭제합니다.',
    })
    @ApiParam({
        name: 'userId',
        description: '사용자 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiOkResponse({
        description: '접근 권한 삭제 성공',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '접근 권한이 성공적으로 삭제되었습니다.' },
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
        description: '잘못된 요청 데이터',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '부서, 사용자 또는 권한을 찾을 수 없음',
        type: ErrorResponseDto,
    })
    async removeAccessAuthority(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
    ): Promise<{ success: boolean; message: string }> {
        const result = await this.userBusinessService.removeAuthority(userId, departmentId, AuthorityType.ACCESS);
        return {
            success: result,
            message: '접근 권한이 성공적으로 삭제되었습니다.',
        };
    }

    @Delete(':userId/departments/:departmentId/review-authority')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '부서 검토 권한 삭제',
        description: '사용자의 특정 부서 검토 권한을 삭제합니다.',
    })
    @ApiParam({
        name: 'userId',
        description: '사용자 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiParam({
        name: 'departmentId',
        description: '부서 ID',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiOkResponse({
        description: '검토 권한 삭제 성공',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '검토 권한이 성공적으로 삭제되었습니다.' },
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
        description: '잘못된 요청 데이터',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '부서, 사용자 또는 권한을 찾을 수 없음',
        type: ErrorResponseDto,
    })
    async removeReviewAuthority(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
    ): Promise<{ success: boolean; message: string }> {
        const result = await this.userBusinessService.removeAuthority(userId, departmentId, AuthorityType.REVIEW);
        return {
            success: result,
            message: '검토 권한이 성공적으로 삭제되었습니다.',
        };
    }
}
