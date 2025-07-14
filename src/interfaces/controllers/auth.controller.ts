import { GetUser } from '@src/common/decorators/get-user.decorator';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthBusinessService } from '@src/business/auth/auth-business.service';
import { Public } from '@src/common/decorators/public.decorator';
import { LoginResponseDto } from '@src/interfaces/dto/auth/responses/login-response.dto';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import { LoginDto } from '@src/interfaces/dto/auth/request/login.dto';

@Controller('admin/auth')
@ApiTags('인증')
@Public()
export class AuthController {
    constructor(private readonly authBusinessService: AuthBusinessService) {}

    @Post('login')
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
    async validateToken(@GetUser() user: LamsUserEntity) {
        return user;
    }
}
