import { Body, Controller, HttpStatus, Post, Get, Put, Param, UseGuards, Headers } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
    ApiBody,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthBusinessService } from '@src/business/auth/auth.business';
import { AuthContextService } from '@src/contexts/auth/auth-user-context.service';
import { Public } from '@src/common/decorators/public.decorator';
import { GetUser } from '@src/common/decorators/get-user.decorator';
import { LoginResponseDto } from '@src/interfaces/dto/auth/responses/login-response.dto';
import { LoginDto } from '@src/interfaces/dto/auth/request/login.dto';
import { Roles } from '@src/common/decorators/roles.decorator';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { ChangePasswordDto } from '../dto/auth/request/change-password.dto';
import { UserResponseDto } from '../dto/organization/responses/user-response.dto';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { RolesGuard } from '@src/common/guards/roles.guard';
import { ErrorResponseDto } from '@src/common/dtos/common/error-response.dto';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';

/**
 * 인증 컨트롤러
 * - 사용자 로그인, 토큰 검증, 프로필 조회 등 인증 관련 API 제공
 */
@Controller('admin/auth')
@ApiTags('인증 (Authentication)')
export class AuthController {
    constructor(
        private readonly authBusinessService: AuthBusinessService,
        private readonly authContextService: AuthContextService,
    ) {}

    @Post('login')
    @Public()
    @ApiOperation({
        summary: '사용자 로그인',
        description: '사용자 아이디(이메일)와 패스워드를 검증하여 JWT 토큰을 발급합니다.',
    })
    @ApiBody({
        type: LoginDto,
        description: '로그인 정보',
    })
    @ApiCreatedResponse({
        description: '로그인 성공',
        type: LoginResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 데이터',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패 - 잘못된 사용자명 또는 비밀번호',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: '서버 내부 오류',
        type: ErrorResponseDto,
    })
    async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
        return this.authBusinessService.login(loginDto.email, loginDto.password);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: '사용자 프로필 조회',
        description: '현재 로그인된 사용자의 프로필 정보를 조회합니다.',
    })
    @ApiOkResponse({
        description: '프로필 조회 성공',
        type: UserResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패 - 유효하지 않은 토큰',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: '서버 내부 오류',
        type: ErrorResponseDto,
    })
    async getProfile(
        @GetUser() user: LamsUserEntity,
        @Headers('authorization') token: string,
    ): Promise<UserResponseDto> {
        return this.authBusinessService.getProfile(token, user.userId);
    }

    @Get('verify')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: '토큰 검증',
        description: '현재 사용자의 JWT 토큰이 유효한지 검증합니다.',
    })
    @ApiOkResponse({
        description: '토큰 검증 성공',
        schema: {
            type: 'object',
            properties: {
                valid: { type: 'boolean', example: true },
                user: { $ref: '#/components/schemas/UserResponseDto' },
                sessionInfo: {
                    type: 'object',
                    properties: {
                        sessionValid: { type: 'boolean', example: true },
                        roles: { type: 'array', items: { type: 'string' }, example: ['SYSTEM_ADMIN'] },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: '토큰 검증 실패',
        type: ErrorResponseDto,
    })
    async verifyToken(@GetUser() user: LamsUserEntity): Promise<{
        valid: boolean;
        user: UserResponseDto;
        sessionInfo: {
            sessionValid: boolean;
            roles: UserRole[];
        };
    }> {
        const sessionInfo = await this.authContextService.사용자의_현재_세션_정보를_조회한다(user.userId);
        const userProfile = await this.authBusinessService.사용자의_프로필을_조회한다(user.userId);

        return {
            valid: true,
            user: userProfile,
            sessionInfo: {
                sessionValid: sessionInfo.sessionValid,
                roles: sessionInfo.roles,
            },
        };
    }

    @Put('change-password')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: '비밀번호 변경',
        description: '현재 사용자의 비밀번호를 변경합니다.',
    })
    @ApiBody({
        type: ChangePasswordDto,
        description: '비밀번호 변경 정보',
    })
    @ApiOkResponse({
        description: '비밀번호 변경 성공',
        type: UserResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 데이터 또는 현재 비밀번호 불일치',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: '서버 내부 오류',
        type: ErrorResponseDto,
    })
    async changePassword(
        @GetUser() user: LamsUserEntity,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<UserResponseDto> {
        return this.authBusinessService.비밀번호를_변경한다(
            user.userId,
            changePasswordDto.currentPassword,
            changePasswordDto.newPassword,
        );
    }
}
