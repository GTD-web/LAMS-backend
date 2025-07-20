import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    ParseUUIDPipe,
    ParseIntPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam,
    ApiQuery,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { SystemSettingsBusinessService } from './system-settings.business';
import {
    CreateAttendanceTypeDto,
    UpdateAttendanceTypeDto,
    CreateHolidayDto,
    UpdateHolidayDto,
    PaginationQueryDto,
    HolidayYearQueryDto,
} from './dto/requests/system-settings-request.dto';
import { AttendanceTypeEntity } from '@src/domain/attendance/attendance-type/entities/attendance-type.entity';
import { HolidayInfoEntity } from '@src/domain/holiday/entities/holiday-info.entity';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { RolesGuard } from '@src/common/guards/roles.guard';
import { Roles } from '@src/common/decorators/roles.decorator';
import { UserRole } from '@src/domain/user/enum/user.enum';
import { CustomResponseDto } from '@src/common/dtos/common/custom-response.dto';
import { ErrorResponseDto } from '@src/common/dtos/common/error-response.dto';

@ApiTags('시스템 설정')
@Controller({ path: 'system-settings', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SystemSettingsController {
    constructor(private readonly systemSettingsBusinessService: SystemSettingsBusinessService) {}

    // ========== SEED 데이터 초기화 ==========

    @Post('seed/initialize')
    @ApiOperation({
        summary: 'SEED 데이터 초기화',
        description: '시스템 초기 데이터를 설정합니다.',
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    @ApiCreatedResponse({
        description: 'SEED 데이터 초기화 성공',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'object' },
                message: { type: 'string', example: 'SEED 데이터 초기화가 완료되었습니다.' },
            },
        },
    })
    @ApiForbiddenResponse({
        description: '관리자 권한 필요',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: '초기화 중 오류 발생',
        type: ErrorResponseDto,
    })
    async initializeSeedData(): Promise<CustomResponseDto<any>> {
        await this.systemSettingsBusinessService.initializeSeedData();
        return new CustomResponseDto({}, 'SEED 데이터 초기화가 완료되었습니다.');
    }

    // ========== 근무 유형 관리 ==========

    @Get('attendance-types')
    @ApiOperation({
        summary: '근무 유형 목록 조회',
        description: '페이지네이션된 근무 유형 목록을 조회합니다.',
    })
    @ApiQuery({
        name: 'page',
        description: '페이지 번호',
        type: 'number',
        example: 1,
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        description: '페이지당 항목 수',
        type: 'number',
        example: 10,
        required: false,
    })
    @ApiOkResponse({
        description: '근무 유형 목록 조회 성공',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        attendanceTypes: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/AttendanceTypeEntity' },
                        },
                        total: { type: 'number', example: 100 },
                        page: { type: 'number', example: 1 },
                        limit: { type: 'number', example: 10 },
                    },
                },
                message: { type: 'string', example: '근무 유형 목록을 조회하였습니다.' },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: '인증 필요',
        type: ErrorResponseDto,
    })
    async getAttendanceTypeList(@Query() query: PaginationQueryDto): Promise<CustomResponseDto<any>> {
        const data = await this.systemSettingsBusinessService.getAttendanceTypeList(query.limit, query.page);
        return new CustomResponseDto(data, '근무 유형 목록을 조회하였습니다.');
    }

    @Get('attendance-types/all')
    @ApiOperation({
        summary: '모든 근무 유형 조회',
        description: '페이지네이션 없이 모든 근무 유형을 조회합니다.',
    })
    @ApiOkResponse({
        description: '모든 근무 유형 조회 성공',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/AttendanceTypeEntity' },
                },
                message: { type: 'string', example: '모든 근무 유형을 조회하였습니다.' },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: '인증 필요',
        type: ErrorResponseDto,
    })
    async getAllAttendanceTypes(): Promise<CustomResponseDto<AttendanceTypeEntity[]>> {
        const data = await this.systemSettingsBusinessService.getAllAttendanceTypes();
        return new CustomResponseDto(data, '모든 근무 유형을 조회하였습니다.');
    }

    @Get('attendance-types/:id')
    @ApiOperation({
        summary: '근무 유형 조회',
        description: '특정 근무 유형을 조회합니다.',
    })
    @ApiParam({
        name: 'id',
        description: '근무 유형 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: '근무 유형 조회 성공',
        schema: {
            type: 'object',
            properties: {
                data: { $ref: '#/components/schemas/AttendanceTypeEntity' },
                message: { type: 'string', example: '근무 유형을 조회하였습니다.' },
            },
        },
    })
    @ApiNotFoundResponse({
        description: '근무 유형을 찾을 수 없음',
        type: ErrorResponseDto,
    })
    async getAttendanceTypeById(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<CustomResponseDto<AttendanceTypeEntity>> {
        const data = await this.systemSettingsBusinessService.getAttendanceTypeById(id);
        if (!data) {
            throw new Error('근무 유형을 찾을 수 없습니다.');
        }
        return new CustomResponseDto(data, '근무 유형을 조회하였습니다.');
    }

    @Post('attendance-types')
    @ApiOperation({
        summary: '근무 유형 생성',
        description: '새로운 근무 유형을 생성합니다.',
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    @ApiBody({ type: CreateAttendanceTypeDto })
    @ApiCreatedResponse({
        description: '근무 유형 생성 성공',
        schema: {
            type: 'object',
            properties: {
                data: { $ref: '#/components/schemas/AttendanceTypeEntity' },
                message: { type: 'string', example: '근무 유형이 생성되었습니다.' },
            },
        },
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 데이터',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '관리자 권한 필요',
        type: ErrorResponseDto,
    })
    async createAttendanceType(@Body() dto: CreateAttendanceTypeDto): Promise<CustomResponseDto<AttendanceTypeEntity>> {
        const data = await this.systemSettingsBusinessService.createAttendanceType(dto);
        return new CustomResponseDto(data, '근무 유형이 생성되었습니다.');
    }

    @Put('attendance-types/:id')
    @ApiOperation({
        summary: '근무 유형 업데이트',
        description: '기존 근무 유형을 업데이트합니다.',
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    @ApiParam({
        name: 'id',
        description: '근무 유형 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiBody({ type: UpdateAttendanceTypeDto })
    @ApiOkResponse({
        description: '근무 유형 업데이트 성공',
        schema: {
            type: 'object',
            properties: {
                data: { $ref: '#/components/schemas/AttendanceTypeEntity' },
                message: { type: 'string', example: '근무 유형이 업데이트되었습니다.' },
            },
        },
    })
    @ApiNotFoundResponse({
        description: '근무 유형을 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '관리자 권한 필요',
        type: ErrorResponseDto,
    })
    async updateAttendanceType(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateAttendanceTypeDto,
    ): Promise<CustomResponseDto<AttendanceTypeEntity>> {
        const data = await this.systemSettingsBusinessService.updateAttendanceType(id, dto);
        return new CustomResponseDto(data, '근무 유형이 업데이트되었습니다.');
    }

    @Delete('attendance-types/:id')
    @ApiOperation({
        summary: '근무 유형 삭제',
        description: '근무 유형을 삭제합니다.',
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    @ApiParam({
        name: 'id',
        description: '근무 유형 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: '근무 유형 삭제 성공',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'boolean', example: true },
                message: { type: 'string', example: '근무 유형이 삭제되었습니다.' },
            },
        },
    })
    @ApiNotFoundResponse({
        description: '근무 유형을 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '관리자 권한 필요',
        type: ErrorResponseDto,
    })
    async deleteAttendanceType(@Param('id', ParseUUIDPipe) id: string): Promise<CustomResponseDto<boolean>> {
        const data = await this.systemSettingsBusinessService.deleteAttendanceType(id);
        return new CustomResponseDto(data, '근무 유형이 삭제되었습니다.');
    }

    // ========== 휴일 관리 ==========

    @Get('holidays')
    @ApiOperation({
        summary: '연도별 휴일 목록 조회',
        description: '페이지네이션된 연도별 휴일 목록을 조회합니다.',
    })
    @ApiQuery({
        name: 'year',
        description: '연도',
        type: 'number',
        example: 2024,
        required: true,
    })
    @ApiQuery({
        name: 'page',
        description: '페이지 번호',
        type: 'number',
        example: 1,
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        description: '페이지당 항목 수',
        type: 'number',
        example: 10,
        required: false,
    })
    @ApiOkResponse({
        description: '휴일 목록 조회 성공',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        holidays: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/HolidayInfoEntity' },
                        },
                        total: { type: 'number', example: 20 },
                        page: { type: 'number', example: 1 },
                        limit: { type: 'number', example: 10 },
                        year: { type: 'number', example: 2024 },
                    },
                },
                message: { type: 'string', example: '휴일 목록을 조회하였습니다.' },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: '인증 필요',
        type: ErrorResponseDto,
    })
    async getHolidayList(@Query() query: HolidayYearQueryDto): Promise<CustomResponseDto<any>> {
        const data = await this.systemSettingsBusinessService.getHolidayList(query.year, query.limit, query.page);
        return new CustomResponseDto(data, '휴일 목록을 조회하였습니다.');
    }

    @Post('holidays')
    @ApiOperation({
        summary: '휴일 생성',
        description: '새로운 휴일을 생성합니다.',
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    @ApiBody({ type: CreateHolidayDto })
    @ApiCreatedResponse({
        description: '휴일 생성 성공',
        schema: {
            type: 'object',
            properties: {
                data: { $ref: '#/components/schemas/HolidayInfoEntity' },
                message: { type: 'string', example: '휴일이 생성되었습니다.' },
            },
        },
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 데이터',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '관리자 권한 필요',
        type: ErrorResponseDto,
    })
    async createHoliday(@Body() dto: CreateHolidayDto): Promise<CustomResponseDto<HolidayInfoEntity>> {
        const data = await this.systemSettingsBusinessService.createHoliday(dto.date, dto.holidayName);
        return new CustomResponseDto(data, '휴일이 생성되었습니다.');
    }

    @Put('holidays/:id')
    @ApiOperation({
        summary: '휴일 업데이트',
        description: '기존 휴일을 업데이트합니다.',
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    @ApiParam({
        name: 'id',
        description: '휴일 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiBody({ type: UpdateHolidayDto })
    @ApiOkResponse({
        description: '휴일 업데이트 성공',
        schema: {
            type: 'object',
            properties: {
                data: { $ref: '#/components/schemas/HolidayInfoEntity' },
                message: { type: 'string', example: '휴일이 업데이트되었습니다.' },
            },
        },
    })
    @ApiNotFoundResponse({
        description: '휴일을 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '관리자 권한 필요',
        type: ErrorResponseDto,
    })
    async updateHoliday(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateHolidayDto,
    ): Promise<CustomResponseDto<HolidayInfoEntity>> {
        const data = await this.systemSettingsBusinessService.updateHoliday(id, dto.date, dto.holidayName);
        return new CustomResponseDto(data, '휴일이 업데이트되었습니다.');
    }

    @Delete('holidays/:id')
    @ApiOperation({
        summary: '휴일 삭제',
        description: '휴일을 삭제합니다.',
    })
    @Roles(UserRole.ATTENDANCE_ADMIN)
    @ApiParam({
        name: 'id',
        description: '휴일 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: '휴일 삭제 성공',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'boolean', example: true },
                message: { type: 'string', example: '휴일이 삭제되었습니다.' },
            },
        },
    })
    @ApiNotFoundResponse({
        description: '휴일을 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '관리자 권한 필요',
        type: ErrorResponseDto,
    })
    async deleteHoliday(@Param('id', ParseUUIDPipe) id: string): Promise<CustomResponseDto<boolean>> {
        const data = await this.systemSettingsBusinessService.deleteHoliday(id);
        return new CustomResponseDto(data, '휴일이 삭제되었습니다.');
    }
}
