import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseUUIDPipe, ParseIntPipe } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { WorkStandardBusinessService } from '../../business/work-standard/work-standard.business';
import { AttendanceTypeResponseDto } from '../dto/work-standard/responses/attendance-type-response.dto';
import { AttendanceTypeListResponseDto } from '../dto/work-standard/responses/attendance-type-list-response.dto';
import { HolidayResponseDto } from '../dto/work-standard/responses/holiday-response.dto';
import { HolidayListResponseDto } from '../dto/work-standard/responses/holiday-list-response.dto';
import { CreateAttendanceTypeDto } from '../dto/work-standard/requests/create-attendance-type.dto';
import { UpdateAttendanceTypeDto } from '../dto/work-standard/requests/update-attendance-type.dto';
import { CreateHolidayDto } from '../dto/work-standard/requests/create-holiday.dto';
import { UpdateHolidayDto } from '../dto/work-standard/requests/update-holiday.dto';
import { ErrorResponseDto } from '../../common/dtos/common/error-response.dto';

@ApiTags('work-standard')
@Controller({ path: 'work-standard', version: '1' })
@ApiBearerAuth('JWT-auth')
export class WorkStandardController {
    constructor(private readonly workStandardBusinessService: WorkStandardBusinessService) {}

    // ==================== 근무 유형 관련 엔드포인트 ====================

    @Get('attendance-types')
    @ApiOperation({
        summary: '근무 유형 목록 조회',
        description: '페이지네이션된 근무 유형 목록을 조회합니다',
    })
    @ApiQuery({
        name: 'page',
        description: '페이지 번호 (1부터 시작)',
        type: 'integer',
        example: 1,
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        description: '페이지당 항목 수',
        type: 'integer',
        example: 10,
        required: false,
    })
    @ApiOkResponse({
        description: '근무 유형 목록 조회 성공',
        type: AttendanceTypeListResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: '서버 내부 오류',
        type: ErrorResponseDto,
    })
    async getAttendanceTypes(
        @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    ): Promise<AttendanceTypeListResponseDto> {
        return await this.workStandardBusinessService.getAttendanceTypeList(limit, page);
    }

    @Get('attendance-types/all')
    @ApiOperation({
        summary: '모든 근무 유형 조회',
        description: '페이지네이션 없이 모든 근무 유형을 조회합니다',
    })
    @ApiOkResponse({
        description: '모든 근무 유형 조회 성공',
        type: [AttendanceTypeResponseDto],
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    async getAllAttendanceTypes(): Promise<AttendanceTypeResponseDto[]> {
        return await this.workStandardBusinessService.getAllAttendanceTypes();
    }

    @Get('attendance-types/:id')
    @ApiOperation({
        summary: '근무 유형 상세 조회',
        description: 'ID로 특정 근무 유형을 조회합니다',
    })
    @ApiParam({
        name: 'id',
        description: '근무 유형 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: '근무 유형 조회 성공',
        type: AttendanceTypeResponseDto,
    })
    @ApiNotFoundResponse({
        description: '근무 유형을 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    async getAttendanceTypeById(@Param('id', ParseUUIDPipe) id: string): Promise<AttendanceTypeResponseDto | null> {
        return await this.workStandardBusinessService.getAttendanceTypeById(id);
    }

    @Post('attendance-types')
    @ApiOperation({
        summary: '근무 유형 생성',
        description: '새로운 근무 유형을 생성합니다',
    })
    @ApiCreatedResponse({
        description: '근무 유형 생성 성공',
        type: AttendanceTypeResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 데이터',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    async createAttendanceType(@Body() dto: CreateAttendanceTypeDto): Promise<AttendanceTypeResponseDto> {
        return await this.workStandardBusinessService.createAttendanceType(dto);
    }

    @Put('attendance-types/:id')
    @ApiOperation({
        summary: '근무 유형 수정',
        description: '기존 근무 유형을 수정합니다',
    })
    @ApiParam({
        name: 'id',
        description: '근무 유형 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: '근무 유형 수정 성공',
        type: AttendanceTypeResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 데이터',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '근무 유형을 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    async updateAttendanceType(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateAttendanceTypeDto,
    ): Promise<AttendanceTypeResponseDto> {
        return await this.workStandardBusinessService.updateAttendanceType(id, dto);
    }

    @Delete('attendance-types/:id')
    @ApiOperation({
        summary: '근무 유형 삭제',
        description: '기존 근무 유형을 삭제합니다',
    })
    @ApiParam({
        name: 'id',
        description: '근무 유형 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: '근무 유형 삭제 성공',
        schema: {
            type: 'boolean',
            example: true,
        },
    })
    @ApiNotFoundResponse({
        description: '근무 유형을 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    async deleteAttendanceType(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
        return await this.workStandardBusinessService.deleteAttendanceType(id);
    }

    // ==================== 공휴일 관련 엔드포인트 ====================

    @Get('holidays')
    @ApiOperation({
        summary: '공휴일 목록 조회',
        description: '연도별 페이지네이션된 공휴일 목록을 조회합니다',
    })
    @ApiQuery({
        name: 'year',
        description: '조회할 연도',
        type: 'integer',
        example: 2024,
    })
    @ApiQuery({
        name: 'page',
        description: '페이지 번호 (1부터 시작)',
        type: 'integer',
        example: 1,
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        description: '페이지당 항목 수',
        type: 'integer',
        example: 10,
        required: false,
    })
    @ApiOkResponse({
        description: '공휴일 목록 조회 성공',
        type: HolidayListResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    async getHolidays(
        @Query('year', ParseIntPipe) year: number,
        @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    ): Promise<HolidayListResponseDto> {
        return await this.workStandardBusinessService.getHolidayList(year, limit, page);
    }

    @Post('holidays')
    @ApiOperation({
        summary: '공휴일 생성',
        description: '새로운 공휴일을 생성합니다',
    })
    @ApiCreatedResponse({
        description: '공휴일 생성 성공',
        type: HolidayResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 데이터',
        type: ErrorResponseDto,
    })
    @ApiConflictResponse({
        description: '해당 날짜에 이미 공휴일이 존재함',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    async createHoliday(@Body() dto: CreateHolidayDto): Promise<HolidayResponseDto> {
        return await this.workStandardBusinessService.createHoliday(dto);
    }

    @Put('holidays/:id')
    @ApiOperation({
        summary: '공휴일 수정',
        description: '기존 공휴일을 수정합니다',
    })
    @ApiParam({
        name: 'id',
        description: '공휴일 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: '공휴일 수정 성공',
        type: HolidayResponseDto,
    })
    @ApiBadRequestResponse({
        description: '잘못된 요청 데이터',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: '공휴일을 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiConflictResponse({
        description: '해당 날짜에 이미 공휴일이 존재함',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    async updateHoliday(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateHolidayDto,
    ): Promise<HolidayResponseDto> {
        return await this.workStandardBusinessService.updateHoliday(id, dto);
    }

    @Delete('holidays/:id')
    @ApiOperation({
        summary: '공휴일 삭제',
        description: '기존 공휴일을 삭제합니다',
    })
    @ApiParam({
        name: 'id',
        description: '공휴일 ID',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: '공휴일 삭제 성공',
        schema: {
            type: 'boolean',
            example: true,
        },
    })
    @ApiNotFoundResponse({
        description: '공휴일을 찾을 수 없음',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    async deleteHoliday(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
        return await this.workStandardBusinessService.deleteHoliday(id);
    }

    // ==================== 시스템 관리 엔드포인트 ====================

    @Post('seed-data')
    @ApiOperation({
        summary: 'SEED 데이터 초기화',
        description: '시스템 초기 데이터를 설정합니다',
    })
    @ApiCreatedResponse({
        description: 'SEED 데이터 초기화 성공',
        schema: {
            type: 'boolean',
            example: true,
        },
    })
    @ApiUnauthorizedResponse({
        description: '인증 실패',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: '권한 부족',
        type: ErrorResponseDto,
    })
    async initializeSeedData(): Promise<boolean> {
        await this.workStandardBusinessService.initializeSeedData();
        return true;
    }
}
