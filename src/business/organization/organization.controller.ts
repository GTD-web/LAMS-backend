import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiCreatedResponse,
    ApiBody,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '@src/common/dtos/common/error-response.dto';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { Roles } from '@src/common/decorators/roles.decorator';
import { RolesGuard } from '@src/common/guards/roles.guard';
import { OrganizationBusinessService } from './organization.business';
import { OrganizationTreeResponseDto, SaveOrganizationDto } from './dto/organization.dto';

@Controller('organizations')
@ApiTags('조직도')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class OrganizationController {
    constructor(private readonly organizationBusinessService: OrganizationBusinessService) {}

    @Get()
    @ApiOperation({
        summary: '조직도 전체 조회',
        description: '전체 조직도 트리 구조를 조회합니다.',
    })
    @ApiOkResponse({
        description: '조직도 트리 조회 성공',
        type: [OrganizationTreeResponseDto],
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
        type: ErrorResponseDto,
    })
    async getOrganizationTree(): Promise<OrganizationTreeResponseDto[]> {
        const organizationTree = await this.organizationBusinessService.getOrganizationTree();
        return organizationTree.map((node) => OrganizationTreeResponseDto.fromDomain(node));
    }

    @Post()
    @ApiOperation({
        summary: '조직도 저장',
        description: '조직도 구조를 저장합니다. 기존 조직도를 완전히 대체합니다.',
    })
    @ApiBody({
        type: SaveOrganizationDto,
        description: '저장할 조직도 데이터',
    })
    @ApiCreatedResponse({
        description: '조직도 저장 성공',
        schema: {
            type: 'object',
            properties: {
                success: {
                    type: 'boolean',
                    example: true,
                },
                message: {
                    type: 'string',
                    example: '조직도가 성공적으로 저장되었습니다.',
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '권한 없음 - 관리자만 접근 가능',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
        type: ErrorResponseDto,
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    async saveOrganizationTree(
        @Body() organizationTree: SaveOrganizationDto,
    ): Promise<{ success: boolean; message: string }> {
        await this.organizationBusinessService.saveOrganizationTree(organizationTree);
        return {
            success: true,
            message: '조직도가 성공적으로 저장되었습니다.',
        };
    }
}
