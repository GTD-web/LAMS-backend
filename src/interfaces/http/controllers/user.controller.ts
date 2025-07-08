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
import { UserDomainService } from '@src/domain/user/user.service';
import { UserMapper } from '@src/domain/user/mappers/user.mapper';
import { SignUpDto } from '@src/interfaces/http/dtos/user/requests/create-lams-user.dto';
import { UpdateUserDto, ChangePasswordDto } from '@src/interfaces/http/dtos/user/requests/update-lams-user.dto';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { CustomResponse } from '@src/common/dtos/common/custom-response.dto';
import { AuthGuard } from '@src/common/guards/auth.guard';
import { RolesGuard } from '@src/common/guards/roles.guard';
import { Roles } from '@src/common/decorators/roles.decorator';
import { GetUser } from '@src/common/decorators/get-user.decorator';
import { UserRole } from '@src/domain/user/entities/user.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userDomainService: UserDomainService) {}

    /**
     * 모든 LAMS 사용자 조회
     */
    @Get()
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '모든 LAMS 사용자 조회' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: '사용자 목록 조회 성공' })
    async findAllLamsUsers(@Query() query: PaginationQueryDto) {
        const result = await this.userDomainService.findAllUsers(query);
        const responseData = UserMapper.toUserResponseArray(result.users);

        return new CustomResponse({ users: responseData, total: result.total }, '사용자 목록 조회 성공');
    }

    /**
     * 사용자 프로필 조회
     */
    @Get('profile')
    @ApiOperation({ summary: '사용자 프로필 조회' })
    @ApiResponse({ status: 200, description: '프로필 조회 성공' })
    async getUserProfile(@GetUser() user: any) {
        const userProfile = await this.userDomainService.findUserById(user.userId);

        if (!userProfile) {
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        // TODO: notification 관련 로직 추가 예정
        const responseData = UserMapper.toUserResponse(userProfile);

        return new CustomResponse(responseData, '프로필 조회 성공');
    }

    /**
     * 사용자 ID로 LAMS 사용자 조회
     */
    @Get(':id')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '사용자 ID로 LAMS 사용자 조회' })
    @ApiParam({ name: 'id', description: '사용자 ID', type: String })
    @ApiResponse({ status: 200, description: '사용자 조회 성공' })
    async findLamsUserById(@Param('id', ParseUUIDPipe) userId: string) {
        const user = await this.userDomainService.findUserById(userId);

        if (!user) {
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        const responseData = UserMapper.toUserResponse(user);

        return new CustomResponse(responseData, '사용자 조회 성공');
    }

    /**
     * LAMS 사용자 생성
     */
    @Post()
    @Roles(UserRole.SYSTEM_ADMIN)
    @ApiOperation({ summary: 'LAMS 사용자 생성' })
    @ApiResponse({ status: 201, description: '사용자 생성 성공' })
    async createLamsUser(@Body() createUserDto: SignUpDto) {
        const user = await this.userDomainService.createLamsUser(createUserDto);
        const responseData = UserMapper.toLamsUserResponse(user);

        return new CustomResponse(responseData, '사용자 생성 성공');
    }

    /**
     * LAMS 사용자 업데이트
     */
    @Put(':id')
    @Roles(UserRole.SYSTEM_ADMIN)
    @ApiOperation({ summary: 'LAMS 사용자 업데이트' })
    @ApiParam({ name: 'id', description: '사용자 ID', type: String })
    @ApiResponse({ status: 200, description: '사용자 업데이트 성공' })
    async updateLamsUser(@Param('id', ParseUUIDPipe) userId: string, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.userDomainService.updateUser(userId, updateUserDto);
        const responseData = UserMapper.toUserResponse(user);

        return new CustomResponse(responseData, '사용자 업데이트 성공');
    }

    /**
     * 사용자 비밀번호 변경
     */
    @Put(':id/password')
    @ApiOperation({ summary: '사용자 비밀번호 변경' })
    @ApiParam({ name: 'id', description: '사용자 ID', type: String })
    @ApiResponse({ status: 200, description: '비밀번호 변경 성공' })
    async changePassword(@Param('id', ParseUUIDPipe) userId: string, @Body() changePasswordDto: ChangePasswordDto) {
        // 현재 비밀번호 검증을 위해 사용자 조회
        const user = await this.userDomainService.findUserById(userId);

        if (!user) {
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        const params = UserMapper.fromChangePasswordDto(changePasswordDto);

        // 실제 구현에서는 현재 비밀번호를 포함한 별도 DTO가 필요
        const updatedUser = await this.userDomainService.changePassword(
            userId,
            '', // currentPassword - 실제로는 별도 DTO에서 받아야 함
            params.newPassword,
        );

        const responseData = UserMapper.toUserResponse(updatedUser);

        return new CustomResponse(responseData, '비밀번호 변경 성공');
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
    async deleteUser(@Param('id', ParseUUIDPipe) userId: string) {
        const result = await this.userDomainService.deleteUser(userId);

        return new CustomResponse({ deleted: result }, result ? '사용자 삭제 성공' : '사용자 삭제 실패');
    }

    /**
     * 사용자 역할 업데이트
     */
    @Put(':id/roles')
    @Roles(UserRole.SYSTEM_ADMIN)
    @ApiOperation({ summary: '사용자 역할 업데이트' })
    @ApiParam({ name: 'id', description: '사용자 ID', type: String })
    @ApiResponse({ status: 200, description: '사용자 역할 업데이트 성공' })
    async updateUserRole(@Param('id', ParseUUIDPipe) userId: string, @Body() body: { roles: UserRole[] }) {
        const user = await this.userDomainService.updateUserRole(userId, body.roles);
        const responseData = UserMapper.toUserRoleResponse(user);

        return new CustomResponse(responseData, '사용자 역할 업데이트 성공');
    }

    /**
     * 사용자 역할 조회
     */
    @Get(':id/roles')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({ summary: '사용자 역할 조회' })
    @ApiParam({ name: 'id', description: '사용자 ID', type: String })
    @ApiResponse({ status: 200, description: '사용자 역할 조회 성공' })
    async getUserRole(@Param('id', ParseUUIDPipe) userId: string) {
        const roleInfo = await this.userDomainService.getUserRole(userId);

        return new CustomResponse(roleInfo, '사용자 역할 조회 성공');
    }
}
