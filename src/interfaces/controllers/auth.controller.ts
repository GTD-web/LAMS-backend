import { Body, Controller, HttpStatus, Headers, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthBusinessService } from '@src/business/auth/auth-business.service';
import { Public } from '@src/common/decorators/public.decorator';
import { LoginResponseDto } from '@src/interfaces/dto/auth/responses/login-response.dto';
import { LoginDto } from '@src/interfaces/dto/auth/request/login.dto';
import { Roles } from '@src/common/decorators/roles.decorator';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { ChangePasswordDto } from '../dto/auth/request/change-password.dto';
import { UserResponseDto } from '../dto/organization/responses/user-response.dto';

@Controller('admin/auth')
@ApiTags('인증')
export class AuthController {
    constructor(private readonly authBusinessService: AuthBusinessService) {}

    @Post('login')
    @Public()
    @ApiOperation({ summary: 'LAMS 로그인 #사용자' })
    @ApiResponse({ status: 200, description: '로그인 성공' })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @ApiResponse({ status: 400, description: '잘못된 요청' })
    async lamsLogin(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
        return this.authBusinessService.login(loginDto.email, loginDto.password);
    }

    @ApiBearerAuth()
    @Post('token')
    @ApiOperation({ summary: '토큰 검증 테스트 #사용자' })
    @ApiResponse({ status: 200, description: '토큰 검증 성공' })
    @ApiResponse({ status: 401, description: '토큰 검증 실패' })
    async validateToken(@Headers('authorization') auth: string): Promise<{ isValid: boolean }> {
        return { isValid: this.authBusinessService.validateToken(auth) };
    }

    @Put(':userId')
    @Roles(UserRole.SYSTEM_ADMIN)
    @ApiOperation({ summary: '사용자 비밀번호 수정' })
    @ApiParam({ name: 'userId', description: '사용자 ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '비밀번호가 성공적으로 수정되었습니다.',
        type: UserResponseDto,
    })
    async changePassword(
        @Param('userId') userId: string,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<UserResponseDto> {
        return this.authBusinessService.changePassword(
            userId,
            changePasswordDto.currentPassword,
            changePasswordDto.newPassword,
        );
    }
}
