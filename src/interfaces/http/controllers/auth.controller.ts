import { AuthGuard } from '@src/common/guards/auth.guard';
import { CustomResponse } from '@src/common/dtos/common/custom-response.dto';
import { GetUser } from '@src/common/decorators/get-user.decorator';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dtos/user/requests/login-lams-user.dto';
import { AuthBusinessService } from '@src/business/auth/auth.service';
import { AuthPayloadEntity } from '@src/domain/auth/entities/auth-payload.entity';

@Controller('auth')
@ApiTags('인증')
export class AuthController {
    constructor(private readonly authBusinessService: AuthBusinessService) {}

    @Post('lams/login')
    @ApiOperation({ summary: 'LAMS 로그인 #사용자' })
    @ApiResponse({ status: 200, description: '로그인 성공' })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @ApiResponse({ status: 400, description: '잘못된 요청' })
    async lamsLogin(@Body() loginDto: LoginDto): Promise<CustomResponse<{ token: string }>> {
        const token = await this.authBusinessService.login(loginDto.email, loginDto.password);

        return new CustomResponse({ token }, '로그인이 완료되었습니다.');
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('test-auth')
    @ApiOperation({ summary: '토큰 검증 테스트 #사용자' })
    @ApiResponse({ status: 200, description: '토큰 검증 성공' })
    @ApiResponse({ status: 401, description: '토큰 검증 실패' })
    async testAuth(@GetUser() user: AuthPayloadEntity): Promise<CustomResponse<AuthPayloadEntity>> {
        return new CustomResponse(user, '토큰 검증이 완료되었습니다.');
    }
}
