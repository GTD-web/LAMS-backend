import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    ParseUUIDPipe,
    HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { Roles } from '@src/common/decorators/roles.decorator';
import { GetUser } from '@src/common/decorators/get-user.decorator';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { UserBusinessService } from '@src/business/user/user-business.service';
import { SignUpDto } from './dto/requests/create-lams-user.dto';
import { UpdateUserDto, ChangePasswordDto } from './dto/requests/update-lams-user.dto';
import { UserResponseDto } from './dto/responses/user-response.dto';
import { UserRole } from '@src/domain/user/enum/user.enum';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: UserBusinessService) {}

    /**
     * 모든 LAMS 사용자 조회
     */
    @Get()
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '모든 LAMS 사용자 조회' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: '사용자 목록 조회 성공' })
    async findAllLamsUsers(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
        return this.userService.findAllUsers(query);
    }

    /**
     * 사용자 프로필 조회
     */
    @Get('profile')
    @ApiOperation({ summary: '사용자 프로필 조회' })
    @ApiResponse({ status: 200, description: '프로필 조회 성공' })
    async getUserProfile(@GetUser() user: any): Promise<UserResponseDto> {
        return this.userService.findUserById(user.userId);
    }

    /**
     * 사용자 ID로 LAMS 사용자 조회
     */
    @Get(':id')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '사용자 ID로 LAMS 사용자 조회' })
    @ApiParam({ name: 'id', description: '사용자 ID', type: String })
    @ApiResponse({ status: 200, description: '사용자 조회 성공' })
    async findLamsUserById(@Param('id', ParseUUIDPipe) userId: string): Promise<UserResponseDto> {
        return this.userService.findUserById(userId);
    }

    /**
     * LAMS 사용자 생성
     */
    @Post()
    @Roles(UserRole.SYSTEM_ADMIN)
    @ApiOperation({ summary: 'LAMS 사용자 생성' })
    @ApiResponse({ status: 201, description: '사용자 생성 성공' })
    async createUser(@Body() signUpDto: SignUpDto): Promise<UserResponseDto> {
        const { username, email, password } = signUpDto;

        return this.userService.createUser(username, email, password);
    }

    /**
     * LAMS 사용자 업데이트
     */
    @Put(':id')
    @Roles(UserRole.SYSTEM_ADMIN)
    @ApiOperation({ summary: 'LAMS 사용자 업데이트' })
    @ApiParam({ name: 'id', description: '사용자 ID', type: String })
    @ApiResponse({ status: 200, description: '사용자 업데이트 성공' })
    async updateLamsUser(
        @Param('id', ParseUUIDPipe) userId: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        return this.userService.updateUser(userId, updateUserDto);
    }

    /**
     * 사용자 비밀번호 변경
     */
    @Put(':id/password')
    @ApiOperation({ summary: '사용자 비밀번호 변경' })
    @ApiParam({ name: 'id', description: '사용자 ID', type: String })
    @ApiResponse({ status: 200, description: '비밀번호 변경 성공' })
    async changePassword(
        @Param('id', ParseUUIDPipe) userId: string,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<UserResponseDto> {
        const { currentPassword, newPassword } = changePasswordDto;
        return this.userService.changePassword(userId, currentPassword, newPassword);
    }

    /**
     * 사용자 삭제
     */
    @Delete(':id')
    @Roles(UserRole.SYSTEM_ADMIN)
    @ApiOperation({ summary: '사용자 삭제' })
    @ApiParam({ name: 'id', description: '사용자 ID', type: String })
    @ApiResponse({ status: 200, description: '사용자 삭제 성공' })
    @HttpCode(200)
    async deleteUser(@Param('id', ParseUUIDPipe) userId: string): Promise<{ success: boolean }> {
        const result = await this.userService.deleteUser(userId);
        return { success: result };
    }

    /**
     * 사용자 역할 업데이트
     */
    @Put(':id/roles')
    @Roles(UserRole.SYSTEM_ADMIN)
    @ApiOperation({ summary: '사용자 역할 업데이트' })
    @ApiParam({ name: 'id', description: '사용자 ID', type: String })
    @ApiResponse({ status: 200, description: '사용자 역할 업데이트 성공' })
    async updateUserRole(
        @Param('id', ParseUUIDPipe) userId: string,
        @Body() body: { roles: UserRole[] },
    ): Promise<UserResponseDto> {
        return this.userService.updateUserRole(userId, body.roles);
    }
}
