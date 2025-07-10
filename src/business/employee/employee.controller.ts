import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginationQueryDto } from '@src/common/dtos/pagination/pagination-query.dto';
import { EmployeeBusinessService } from '@src/business/employee/employee.business';
import {
    UpdateEmployeeEntryAtDto,
    UpdateEmployeeQuitedAtDto,
} from '@src/business/employee/dto/requests/employee-request.dto';

@Controller('employees')
@ApiTags('직원')
@ApiBearerAuth('bearer')
export class EmployeeController {
    constructor(
        private readonly employeeService: EmployeeBusinessService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    // @Get('/department/:departmentId/:withQuited/:withExclude')
    // @ApiOperation({ summary: '부서별 직원 조회' })
    // @ApiParam({ name: 'departmentId', description: '부서 ID' })
    // @ApiParam({ name: 'withQuited', description: '퇴사자 포함 여부', type: Boolean })
    // @ApiParam({ name: 'withExclude', description: '제외된 직원 포함 여부', type: Boolean })
    // @ApiResponse({ status: 200, description: '부서별 직원 조회 성공' })
    // async getEmployeeByDepartment(
    //     @Param('departmentId') departmentId: string,
    //     @Param('withQuited', ParseBoolPipe) withQuited: boolean,
    //     @Param('withExclude', ParseBoolPipe) withExclude: boolean,
    // ) {
    //     const year = new Date().getFullYear();
    //     console.log('직원정보 요청 시작');

    //     const result = await this.employeeService.getEmployeeByDepartment(departmentId, withQuited, withExclude, year);
    //     return new CustomResponse(result, '성공적으로 부서별 직원을 조회하였습니다.');
    // }

    // @Get('/department/:departmentId/:withQuited/:withExclude/:year')
    // @ApiOperation({ summary: '연도별 부서별 직원 조회' })
    // @ApiParam({ name: 'departmentId', description: '부서 ID' })
    // @ApiParam({ name: 'withQuited', description: '퇴사자 포함 여부', type: Boolean })
    // @ApiParam({ name: 'withExclude', description: '제외된 직원 포함 여부', type: Boolean })
    // @ApiParam({ name: 'year', description: '조회 연도', type: Number })
    // @ApiResponse({ status: 200, description: '연도별 부서별 직원 조회 성공' })
    // async getEmployeeByDepartmentByYear(
    //     @Param('departmentId') departmentId: string,
    //     @Param('withQuited', ParseBoolPipe) withQuited: boolean,
    //     @Param('withExclude', ParseBoolPipe) withExclude: boolean,
    //     @Param('year', ParseIntPipe) year: number,
    // ) {
    //     const result = await this.employeeService.getEmployeeByDepartment(departmentId, withQuited, withExclude, year);
    //     return new CustomResponse(result, '성공적으로 부서별 직원을 조회하였습니다.');
    // }

    // @Patch('/:employeeId/quited-at')
    // @ApiOperation({ summary: '퇴사일 입력' })
    // @ApiParam({ name: 'employeeId', description: '직원 ID' })
    // @ApiResponse({ status: 200, description: '퇴사일 입력 성공' })
    // async inputQuitedAt(@Param('employeeId') employeeId: string, @Body() dto: UpdateEmployeeQuitedAtDto) {
    //     const { employeeInfoEntity, beforeEmployee } = await this.employeeService.inputQuitedAt(employeeId, dto);
    //     const latestEvent = await this.employeeService.getLatestEventInfoByEmployee(employeeInfoEntity.employeeNumber);
    //     const latestUsedAttendance = await this.employeeService.getLatestUsedAttendanceByEmployee(employeeId);

    //     // event info에서 가장 최근이벤트 값과 used attendance 의 가장 최근 값을 가져오기
    //     const latestDate =
    //         latestEvent.yyyymmdd > latestUsedAttendance.usedAt ? latestEvent.yyyymmdd : latestUsedAttendance.usedAt;

    //     // 비동기 처리를 위한 이벤트 발행
    //     this.eventEmitter.emit('employee.monthly-attendance-summary.updated', {
    //         employeeId,
    //         beforeDate: beforeEmployee.quitedAt ?? latestDate,
    //         newDate: employeeInfoEntity.quitedAt ?? latestDate,
    //     });

    //     return new CustomResponse(employeeInfoEntity, '성공적으로 직원의 퇴사일을 입력하였습니다.');
    // }

    // @Patch('/:employeeId/entry-at')
    // @ApiOperation({ summary: '입사일 입력' })
    // @ApiParam({ name: 'employeeId', description: '직원 ID' })
    // @ApiResponse({ status: 200, description: '입사일 입력 성공' })
    // async inputEntryAt(@Param('employeeId') employeeId: string, @Body() dto: UpdateEmployeeEntryAtDto) {
    //     const { employeeInfoEntity, beforeEmployee } = await this.employeeService.inputEntryAt(employeeId, dto);
    //     const latestEvent = await this.employeeService.getLatestEventInfoByEmployee(
    //         employeeInfoEntity.employeeNumber,
    //         'ASC',
    //     );
    //     const latestUsedAttendance = await this.employeeService.getLatestUsedAttendanceByEmployee(employeeId, 'ASC');
    //     const latestDate =
    //         latestEvent.yyyymmdd > latestUsedAttendance.usedAt ? latestEvent.yyyymmdd : latestUsedAttendance.usedAt;

    //     // 비동기 처리를 위한 이벤트 발행
    //     this.eventEmitter.emit('employee.monthly-attendance-summary.updated', {
    //         employeeId,
    //         beforeDate: beforeEmployee.entryAt ?? latestDate,
    //         newDate: employeeInfoEntity.entryAt ?? latestDate,
    //     });

    //     return new CustomResponse(employeeInfoEntity, '성공적으로 직원의 입사일을 입력하였습니다.');
    // }

    @Patch('/:employeeId/exclude-toggle')
    @ApiOperation({ summary: '계산에서 직원 제외(토글)' })
    @ApiParam({ name: 'employeeId', description: '직원 ID' })
    @ApiResponse({ status: 200, description: '직원 제외 토글 성공' })
    async excludeEmployee(@Param('employeeId') employeeId: string) {
        return await this.employeeService.excludeEmployeeToggle(employeeId);
    }

    @Patch('/:employeeId/:birthDate')
    @ApiOperation({ summary: '생일 입력' })
    @ApiParam({ name: 'employeeId', description: '직원 ID' })
    @ApiParam({ name: 'birthDate', description: '생년월일 (YYYY-MM-DD)' })
    @ApiResponse({ status: 200, description: '생일 입력 성공' })
    async inputBirthday(@Param('employeeId') employeeId: string, @Param('birthDate') birthDate: string) {
        return await this.employeeService.inputBirthday(employeeId, birthDate);
    }

    @Delete('/:employeeId')
    @ApiOperation({ summary: '직원 삭제' })
    @ApiParam({ name: 'employeeId', description: '직원 ID' })
    @ApiResponse({ status: 200, description: '직원 삭제 성공' })
    async deleteEmployee(@Param('employeeId') employeeId: string) {
        return await this.employeeService.deleteEmployee(employeeId);
    }

    @Get(':employeeNumber')
    @ApiOperation({ summary: '사번으로 직원 조회' })
    @ApiParam({ name: 'employeeNumber', description: '사번' })
    @ApiResponse({ status: 200, description: '직원 조회 성공' })
    async getEmployeeByEmployeeNumber(@Param('employeeNumber') employeeNumber: string) {
        return await this.employeeService.getEmployeeByEmployeeNumber(employeeNumber);
    }

    @Get()
    @ApiOperation({ summary: '직원 목록 조회' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: '페이지 번호' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: '페이지당 항목 수' })
    @ApiResponse({ status: 200, description: '직원 목록 조회 성공' })
    async getEmployees(@Query() query: PaginationQueryDto) {
        return await this.employeeService.getEmployees(query);
    }
}
