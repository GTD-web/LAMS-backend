import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as path from 'path';
import { EmployeeDomainService } from '@src/domain/organization/employee/services/employee-domain.service';
import { EmployeeInfoEntity } from '@src/domain/organization/employee/entities/employee-info.entity';
import {
    EmployeeExcelImportDomainService,
    ExtractedEmployeeInfo,
    ExtractedEmailInfo,
    MergedEmployeeInfo,
} from '@src/domain/excel/employee-excel-import.domain';
// 이벤트 상수 정의
const DAILY_EVENT_SUMMARY_EVENT = 'daily-event-summary.create-daily-summary';
const MONTHLY_ATTENDANCE_EVENT = 'monthly-attendance.create-summary-by-employee';

/**
 * 직원 정보 가져오기 비즈니스 서비스
 * - 엑셀 파일에서 직원 정보를 읽어와 업데이트하는 비즈니스 로직 처리
 * - 도메인 서비스와 외부 서비스 간의 협력을 조정
 */
@Injectable()
export class EmployeeInfoImportBusiness {
    private readonly logger = new Logger(EmployeeInfoImportBusiness.name);
    private readonly fileNames = ['20241002_루미르_직원정보.xlsx', '임직원_메일정보.xls'];

    constructor(
        private readonly employeeDomainService: EmployeeDomainService,
        private readonly employeeExcelImportDomainService: EmployeeExcelImportDomainService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    /**
     * 직원 정보 가져오기 메인 비즈니스 로직
     */
    async importEmployeeInfo(): Promise<{
        totalProcessed: number;
        successCount: number;
        failedCount: number;
        notFoundEmployees: MergedEmployeeInfo[];
    }> {
        try {
            this.logger.log('직원 정보 가져오기 프로세스 시작');

            // 1. 엑셀 파일 경로 생성
            const pathList = this.generateFilePaths();

            // 2. 엑셀 파일 읽기 (임시로 빈 배열 반환)
            const extractEmployeeInfo: ExtractedEmployeeInfo[] = [];
            const extractEmailInfo: ExtractedEmailInfo[] = [];
            this.logger.warn('엑셀 파일 읽기 기능은 임시로 비활성화되었습니다.');

            // 3. 직원 정보와 이메일 정보 병합
            const mergedEmployeeInfo = this.employeeExcelImportDomainService.mergeEmployeeAndEmailInfo(
                extractEmployeeInfo,
                extractEmailInfo,
            );

            // 4. 직원 정보 업데이트 처리
            const result = await this.processEmployeeUpdates(mergedEmployeeInfo);

            // 5. 이벤트 발행 (출근 요약 및 월별 출근 요약 생성)
            await this.emitAttendanceEvents(result.updatedEmployees);

            // 6. 성공 로그 기록
            this.logger.log(
                `직원 정보 가져오기 완료 - 총 처리: ${result.totalProcessed}, 성공: ${result.successCount}, 실패: ${result.failedCount}`,
            );

            return {
                totalProcessed: result.totalProcessed,
                successCount: result.successCount,
                failedCount: result.failedCount,
                notFoundEmployees: result.notFoundEmployees,
            };
        } catch (error) {
            this.logger.error('직원 정보 가져오기 프로세스 실패', error.stack);
            throw new BadRequestException('직원 정보 가져오기 중 오류가 발생했습니다.');
        }
    }

    /**
     * 파일 경로 생성
     */
    private generateFilePaths(): string[] {
        return this.fileNames.map((fileName) => path.join(__dirname, '..', '..', '..', 'files', '직원정보', fileName));
    }

    /**
     * 엑셀 파일에서 직원 정보 읽기 (향후 구현 예정)
     */
    private async readEmployeeExcelFile(filePath: string): Promise<ExtractedEmployeeInfo[]> {
        this.logger.warn(`엑셀 파일 읽기 기능 미구현: ${filePath}`);
        return [];
    }

    /**
     * 엑셀 파일에서 이메일 정보 읽기 (향후 구현 예정)
     */
    private async readEmailExcelFile(filePath: string): Promise<ExtractedEmailInfo[]> {
        this.logger.warn(`이메일 엑셀 파일 읽기 기능 미구현: ${filePath}`);
        return [];
    }

    /**
     * 직원 정보 업데이트 처리
     */
    private async processEmployeeUpdates(mergedEmployeeInfo: MergedEmployeeInfo[]): Promise<{
        totalProcessed: number;
        successCount: number;
        failedCount: number;
        notFoundEmployees: MergedEmployeeInfo[];
        updatedEmployees: EmployeeInfoEntity[];
    }> {
        const notFoundEmployees: MergedEmployeeInfo[] = [];
        const updatedEmployees: EmployeeInfoEntity[] = [];
        let successCount = 0;
        let failedCount = 0;

        for (const employeeInfo of mergedEmployeeInfo) {
            try {
                const updatedEmployee = await this.employeeDomainService.updateEmployeeInfo(employeeInfo);

                if (!updatedEmployee) {
                    notFoundEmployees.push(employeeInfo);
                    failedCount++;
                    continue;
                }

                updatedEmployees.push(updatedEmployee);
                successCount++;
                this.logger.log(
                    `직원 정보 업데이트 성공: ${employeeInfo.employeeNumber} - ${employeeInfo.employeeName}`,
                );
            } catch (error) {
                this.logger.error(`직원 정보 업데이트 실패: ${employeeInfo.employeeNumber}`, error.stack);
                failedCount++;
            }
        }

        return {
            totalProcessed: mergedEmployeeInfo.length,
            successCount,
            failedCount,
            notFoundEmployees,
            updatedEmployees,
        };
    }

    /**
     * 출근 관련 이벤트 발행
     */
    private async emitAttendanceEvents(updatedEmployees: EmployeeInfoEntity[]): Promise<void> {
        try {
            for (const employee of updatedEmployees) {
                const [year, month] = employee.entryAt.split('-');

                // 일별 출근 요약 생성 이벤트
                await this.eventEmitter.emitAsync(DAILY_EVENT_SUMMARY_EVENT, {
                    employeeId: employee.employeeId,
                    year,
                    month,
                    isUpdate: true,
                });

                // 월별 출근 요약 생성 이벤트
                await this.eventEmitter.emitAsync(MONTHLY_ATTENDANCE_EVENT, {
                    employeeId: employee.employeeId,
                    year,
                    month,
                });

                this.logger.log(`출근 이벤트 발행 완료: ${employee.employeeNumber}`);
            }
        } catch (error) {
            this.logger.error('출근 이벤트 발행 실패', error.stack);
            throw new BadRequestException('출근 이벤트 발행 중 오류가 발생했습니다.');
        }
    }
}
