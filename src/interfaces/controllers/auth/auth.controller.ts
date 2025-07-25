import { Body, Controller, Post, Get, Put, UseGuards, Headers } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
    ApiBody,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthBusinessService } from '../../../business/auth/auth.business';
import { Public } from '../../../common/decorators/public.decorator';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from '../../../business/user/dto/user-response.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { ErrorResponseDto } from '../../../common/dtos/common/error-response.dto';
import { UserEntity } from '../../../domain/user/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginResponseDto } from './dto/login-response.dto';

/**
 * 인증 컨트롤러
 * - 사용자 로그인, 토큰 검증, 프로필 조회 등 인증 관련 API 제공
 */
@Controller('admin/auth')
@ApiTags('인증 (Authentication)')
export class AuthController {
    constructor(private readonly authBusinessService: AuthBusinessService) {}

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
    async verifyToken(@Headers('authorization') token: string): Promise<{
        valid: boolean;
    }> {
        return {
            valid: this.authBusinessService.verifyToken(token),
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
        @GetUser() user: UserEntity,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<UserResponseDto> {
        return this.authBusinessService.changeUserPassword(
            user.userId,
            changePasswordDto.currentPassword,
            changePasswordDto.newPassword,
        );
    }
}
