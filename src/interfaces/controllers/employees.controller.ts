import { Controller, Put, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../domain/user/enum/user.enum';
import { EmployeeResponseDto } from '../dto/organization/responses/employee-response.dto';
import { OrganizationBusinessService } from '@src/business/organization/organization.business';
import { SuccessResponseWithData } from '@src/common/types/success-response.type';

/**
 * 직원 관리 컨트롤러
 * - 직원 제외 여부 토글 기능만 제공
 * - 직원 생성/삭제는 MMS 동기화를 통해서만 가능
 * - 직원 목록 조회는 departments 컨트롤러에서 부서별로 제공
 */
@ApiTags('employees')
@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EmployeesController {
    constructor(private readonly organizationBusinessService: OrganizationBusinessService) {}

    @Put(':employeeId/toggle-exclusion')
    @Roles(UserRole.SYSTEM_ADMIN)
    @ApiOperation({
        summary: '직원 제외 상태 토글',
        description: '직원의 계산 제외 여부를 토글합니다.',
    })
    @ApiParam({
        name: 'employeeId',
        description: '직원 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '직원 제외 상태가 성공적으로 변경되었습니다.',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: '직원 제외 여부가 성공적으로 변경되었습니다.' },
                data: { $ref: '#/components/schemas/EmployeeResponseDto' },
                timestamp: { type: 'string', format: 'date-time' },
            },
        },
    })
    async toggleEmployeeExclusion(
        @Param('employeeId') employeeId: string,
    ): Promise<SuccessResponseWithData<EmployeeResponseDto>> {
        return await this.organizationBusinessService.toggleEmployeeExclusion(employeeId);
    }
}
