import { Controller, Get, Param, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { OrganizationQueryService } from '../../business/organization/services/organization-query.service';
import { PaginationQueryDto } from '../../common/dtos/pagination/pagination-query.dto';
import { UserRole } from '../../domain/user/enum/user.enum';
import { UserResponseDto } from '../dto/organization/responses/user-response.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';

/**
 * 사용자 권한 관리 컨트롤러
 */
@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly organizationQueryService: OrganizationQueryService) {}

    @Get()
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '사용자 목록 조회' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '사용자 목록이 성공적으로 조회되었습니다.',
        type: PaginatedResponseDto<UserResponseDto>,
    })
    async getUsers(@Query() paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
        return this.organizationQueryService.findAllUsers(paginationQuery);
    }

    @Get(':userId')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '사용자 단일 조회' })
    @ApiParam({ name: 'userId', description: '사용자 ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '사용자가 성공적으로 조회되었습니다.',
        type: UserResponseDto,
    })
    async getUserById(@Param('userId') userId: string): Promise<UserResponseDto | null> {
        return this.organizationQueryService.findUserById(userId);
    }

    @Get('email/:email')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '이메일로 사용자 조회' })
    @ApiParam({ name: 'email', description: '사용자 이메일' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '사용자가 성공적으로 조회되었습니다.',
        type: UserResponseDto,
    })
    async getUserByEmail(@Param('email') email: string): Promise<UserResponseDto | null> {
        return this.organizationQueryService.findUserByEmail(email);
    }
}
