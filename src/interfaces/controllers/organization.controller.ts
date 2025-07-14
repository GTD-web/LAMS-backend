import { Controller, Get, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { OrganizationSyncService } from '../../business/organization/services/organization-sync.service';
import { UserRole } from '../../domain/user/enum/user.enum';
import { MMSSyncResponseDto } from '../dto/organization/responses/mms-sync-response.dto';

/**
 * 조직도 전체 관리 컨트롤러
 * - MMS 전체 동기화만 지원
 */
@ApiTags('organization')
@Controller('organization')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrganizationController {
    constructor(private readonly organizationSyncService: OrganizationSyncService) {}

    @Post('sync')
    @Roles(UserRole.SYSTEM_ADMIN)
    @ApiOperation({ summary: 'MMS와 전체 동기화 실행' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'MMS 전체 동기화가 성공적으로 완료되었습니다.',
        type: MMSSyncResponseDto,
    })
    async syncMMS(): Promise<MMSSyncResponseDto> {
        const result = await this.organizationSyncService.syncMMS();
        return new MMSSyncResponseDto({
            success: result.success,
            message: result.message,
            timestamp: new Date().toISOString(),
        });
    }
}
