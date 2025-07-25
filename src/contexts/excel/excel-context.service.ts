import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExcelHelperService } from '../../domain/excel/services/excel-helper.service';
import { HolidayDomainService } from '../../domain/holiday/services/holiday-domain.service';
import { AttendanceTypeDomainService } from '../../domain/attendance-type/services/attendance-type-domain.service';
import { ExcelDomainService } from '../../domain/excel/services/excel-domain.service';
import { FileUploadUtil } from '../../common/utils/file-upload.util';

/**
 * 엑셀 컨텍스트 서비스
 * - 엑셀 처리 관련 도메인 서비스들을 조합
 * - 엑셀 데이터 처리 워크플로우 관리
 */
@Injectable()
export class ExcelContextService implements OnModuleInit {
    private readonly logger = new Logger(ExcelContextService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly excelHelperService: ExcelHelperService,
        private readonly holidayDomainService: HolidayDomainService,
        private readonly attendanceTypeDomainService: AttendanceTypeDomainService,
        private readonly excelDomainService: ExcelDomainService,
    ) {}

    /**
     * 모듈 초기화 시 FileUploadUtil 초기화
     */
    onModuleInit() {
        FileUploadUtil.initialize(this.configService);
        this.logger.log('ExcelContextService 초기화 완료');
    }

    /**
     * 엑셀 파일에서 출입 이벤트 데이터를 추출한다
     */
    async 엑셀_파일에서_출입_이벤트_데이터를_추출한다(rawExcelData: any[]): Promise<{
        year: string;
        month: string;
        extractedEmployeeInfoList: any[];
        extractEventList: any[];
        departmentInfoList: string[];
    }> {
        return this.excelHelperService.readEventHistoriesExcelFile(rawExcelData);
    }

    /**
     * 엑셀 파일에서 근태 데이터를 추출한다
     */
    async 엑셀_파일에서_근태_데이터를_추출한다(rawExcelData: any[]): Promise<{
        extractedEmployeeInfoList: any[];
        departments: string[];
    }> {
        return this.excelHelperService.processAttendanceData(rawExcelData);
    }

    /**
     * 직원 번호별로 엑셀 데이터를 추출한다
     */
    async 직원_번호별로_엑셀_데이터를_추출한다(
        rawExcelData: any[],
        type: 'event' | 'attendance',
        employeeInfoMap?: any,
    ): Promise<any> {
        return this.excelHelperService.extractExcelDataByEmployeeNumber(rawExcelData, type, employeeInfoMap);
    }

    /**
     * 사용 근태 데이터를 정렬한다
     */
    async 사용_근태_데이터를_정렬한다(
        extractedEmployeeInfoList: any[],
        employeeInfoEntities: any[],
        year: string,
    ): Promise<any[]> {
        // 휴일 정보 조회
        const holidays = await this.holidayDomainService.findHolidaysByYear(year);

        // 근무 유형 정보 조회
        const attendanceTypes = await this.attendanceTypeDomainService.findAllAttendanceTypes();

        return await this.excelHelperService.sortUsedAttendanceData(
            extractedEmployeeInfoList,
            employeeInfoEntities,
            holidays,
            attendanceTypes,
        );
    }

    /**
     * 날짜 범위를 생성한다
     */
    async 날짜_범위를_생성한다(startDate: Date, endDate: Date): Promise<Date[]> {
        return this.excelHelperService.generateDateRange(startDate, endDate);
    }

    /**
     * 휴일 정보를 Set으로 변환한다
     */
    async 휴일_정보를_Set으로_변환한다(year: string): Promise<Set<string>> {
        const holidays = await this.holidayDomainService.findHolidaysByYear(year);
        return this.excelHelperService.createHolidaySet(holidays);
    }

    /**
     * 기간 문자열을 시작일과 종료일로 분리한다
     */
    async 기간_문자열을_분리한다(period: string): Promise<{ startDate: Date; endDate: Date }> {
        return this.excelHelperService.dividePeriod(period);
    }

    /**
     * 엑셀 파일을 업로드한다
     */
    async 엑셀_파일을_업로드한다(file: Express.Multer.File): Promise<{
        fileId: string;
        originalName: string;
        fileName: string;
        fileUrl: string;
        fileSize: number;
        mimeType: string;
        uploadedAt: Date;
    }> {
        return await FileUploadUtil.uploadExcelFile(file, {
            uploadedBy: 'excel-import-process',
            processType: 'excel-import',
        });
    }

    /**
     * Excel import 프로세스를 생성한다
     */
    async Excel_import_프로세스를_생성한다(
        userId: string,
        year: string,
        month: string,
        eventInfoFileId?: string,
        usedAttendanceFileId?: string,
    ): Promise<{
        excelImportProcessId: string;
        status: string;
        year: string;
        month: string;
        eventInfoFileId?: string;
        usedAttendanceFileId?: string;
        departmentInfoJson: any;
        employeeInfoJson: any;
        dataJson: any;
        createdAt: Date;
    }> {
        // 실제 구현에서는 도메인 서비스를 통해 엑셀 데이터 추출 및 프로세스 생성
        const process = await this.excelDomainService.createExcelImportProcess({
            user: { userId } as any,
            year,
            month,
            eventInfoFileId: eventInfoFileId || null,
            usedAttendanceFileId: usedAttendanceFileId || null,
            status: 'PENDING',
            departmentInfoJson: JSON.stringify({}),
            employeeInfoJson: JSON.stringify({
                tempEnteredEmployeeInfoList: [],
                tempExitedEmployeeInfoList: [],
                enteredEmployeeInfoList: [],
                exitedEmployeeInfoList: [],
            }),
            dataJson: JSON.stringify({
                extractedExcelDataWithoutEventAndAttendanceList: [],
                selectedDataList: [],
            }),
            extractedExcelDataList: [],
        });

        return {
            excelImportProcessId: process.excelImportProcessId,
            status: process.status,
            year: process.year,
            month: process.month,
            eventInfoFileId: process.eventInfoFileId || undefined,
            usedAttendanceFileId: process.usedAttendanceFileId || undefined,
            departmentInfoJson: JSON.parse(process.departmentInfoJson),
            employeeInfoJson: JSON.parse(process.employeeInfoJson),
            dataJson: JSON.parse(process.dataJson),
            createdAt: process.createdAt,
        };
    }

    /**
     * Excel import 프로세스를 저장한다
     */
    async Excel_import_프로세스를_저장한다(
        excelImportProcessId: string,
        status: string,
        departmentInfoJson: any,
        employeeInfoJson: any,
        dataJson: any,
    ): Promise<{
        excelImportProcessId: string;
        status: string;
        year: string;
        month: string;
        eventInfoFileId?: string;
        usedAttendanceFileId?: string;
        departmentInfoJson: any;
        employeeInfoJson: any;
        dataJson: any;
        createdAt: Date;
    }> {
        const process = await this.excelDomainService.findExcelImportProcessById(excelImportProcessId);

        // 프로세스 업데이트
        const updatedProcess = await this.excelDomainService.saveExcelImportProcess({
            ...process,
            status,
            departmentInfoJson: JSON.stringify(departmentInfoJson),
            employeeInfoJson: JSON.stringify(employeeInfoJson),
            dataJson: JSON.stringify(dataJson),
        });

        return {
            excelImportProcessId: updatedProcess.excelImportProcessId,
            status: updatedProcess.status,
            year: updatedProcess.year,
            month: updatedProcess.month,
            eventInfoFileId: updatedProcess.eventInfoFileId || undefined,
            usedAttendanceFileId: updatedProcess.usedAttendanceFileId || undefined,
            departmentInfoJson: JSON.parse(updatedProcess.departmentInfoJson),
            employeeInfoJson: JSON.parse(updatedProcess.employeeInfoJson),
            dataJson: JSON.parse(updatedProcess.dataJson),
            createdAt: updatedProcess.createdAt,
        };
    }

    /**
     * Excel import 프로세스를 조회한다
     */
    async Excel_import_프로세스를_조회한다(excelImportProcessId: string): Promise<{
        excelImportProcessId: string;
        status: string;
        year: string;
        month: string;
        eventInfoFileId?: string;
        usedAttendanceFileId?: string;
        departmentInfoJson: any;
        employeeInfoJson: any;
        dataJson: any;
        createdAt: Date;
    }> {
        const process = await this.excelDomainService.findExcelImportProcessById(excelImportProcessId);

        return {
            excelImportProcessId: process.excelImportProcessId,
            status: process.status,
            year: process.year,
            month: process.month,
            eventInfoFileId: process.eventInfoFileId || undefined,
            usedAttendanceFileId: process.usedAttendanceFileId || undefined,
            departmentInfoJson: JSON.parse(process.departmentInfoJson),
            employeeInfoJson: JSON.parse(process.employeeInfoJson),
            dataJson: JSON.parse(process.dataJson),
            createdAt: process.createdAt,
        };
    }

    /**
     * 사용자별 Excel import 프로세스를 조회한다
     */
    async 사용자별_Excel_import_프로세스를_조회한다(
        userId: string,
        year: string,
        month: string,
    ): Promise<{
        excelImportProcessId: string;
        status: string;
        year: string;
        month: string;
        eventInfoFileId?: string;
        usedAttendanceFileId?: string;
        departmentInfoJson: any;
        employeeInfoJson: any;
        dataJson: any;
        createdAt: Date;
    }> {
        const process = await this.excelDomainService.findExcelImportProcessByUser(userId, year, month);

        return {
            excelImportProcessId: process.excelImportProcessId,
            status: process.status,
            year: process.year,
            month: process.month,
            eventInfoFileId: process.eventInfoFileId || undefined,
            usedAttendanceFileId: process.usedAttendanceFileId || undefined,
            departmentInfoJson: JSON.parse(process.departmentInfoJson),
            employeeInfoJson: JSON.parse(process.employeeInfoJson),
            dataJson: JSON.parse(process.dataJson),
            createdAt: process.createdAt,
        };
    }

    /**
     * Excel import 프로세스를 적용한다
     */
    async Excel_import_프로세스를_적용한다(excelImportProcessId: string): Promise<void> {
        // 실제 구현에서는 도메인 서비스를 통해 프로세스 적용
        // 이는 복잡한 비즈니스 로직이므로 별도의 도메인 서비스에서 처리
        await this.excelDomainService.updateProcessStatus(excelImportProcessId, 'COMPLETED');
    }

    /**
     * Excel import 프로세스를 삭제한다
     */
    async Excel_import_프로세스를_삭제한다(excelImportProcessId: string): Promise<void> {
        // 프로세스와 관련된 파일들도 함께 삭제
        const process = await this.excelDomainService.findExcelImportProcessById(excelImportProcessId);

        // 관련 파일 삭제 (실제 구현에서는 파일 삭제 로직 추가)
        // if (process.eventInfoFileId) {
        //     await this.fileContextService.파일을_삭제한다(process.eventInfoFileId);
        // }
        // if (process.usedAttendanceFileId) {
        //     await this.fileContextService.파일을_삭제한다(process.usedAttendanceFileId);
        // }

        // 프로세스 삭제는 실제로는 상태를 'DELETED'로 변경하거나 soft delete 처리
        await this.excelDomainService.updateProcessStatus(excelImportProcessId, 'DELETED');
    }
}
