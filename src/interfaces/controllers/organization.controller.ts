import { Controller, Post, UseGuards, HttpStatus } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { OrganizationBusinessService } from '@src/business/organization/organization.business';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { RolesGuard } from '@src/common/guards/roles.guard';
import { Roles } from '@src/common/decorators/roles.decorator';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { ErrorResponseDto } from '@src/common/dtos/common/error-response.dto';

/**
 * 조직 관리 컨트롤러
 * - 조직 동기화 및 관리 관련 API 제공
 */
@ApiTags('조직 관리 (Organization)')
@Controller('organization')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrganizationController {
    constructor(private readonly organizationBusinessService: OrganizationBusinessService) {}

    @Post('sync')
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.ATTENDANCE_ADMIN)
    @ApiOperation({
        summary: '조직 동기화',
        description: 'MMS 시스템과 조직 데이터를 동기화합니다. 부서와 직원 정보를 업데이트합니다.',
    })
    @ApiOkResponse({
        description: '조직 동기화가 성공적으로 완료되었습니다.',
        type: MMSSyncResponseDto,
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
    async syncOrganization(): Promise<MMSSyncResponseDto> {
        return this.organizationBusinessService.syncOrganization();
    }
}
