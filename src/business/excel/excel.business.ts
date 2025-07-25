import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ExcelContextService } from '../../contexts/excel/excel-context.service';
import {
    ExcelReadResponseDto,
    EventHistoriesProcessResponseDto,
    AttendanceProcessResponseDto,
    ExcelImportProcessCreateResponseDto,
    ExcelImportProcessApplyResponseDto,
    ExcelImportProcessResponseDto,
} from './dto/excel-response.dto';

/**
 * 엑셀 비즈니스 서비스
 * - 엑셀 파일 처리 비즈니스 로직
 * - 사용자 요청에 대한 엑셀 처리 워크플로우 관리
 */
@Injectable()
export class ExcelBusinessService {
    private readonly logger = new Logger(ExcelBusinessService.name);

    constructor(private readonly excelContextService: ExcelContextService) {}

    /**
     * 엑셀 파일 읽기
     */
    async readExcelFile(fileId: string): Promise<ExcelReadResponseDto> {
        try {
            // 실제 구현에서는 파일 도메인 서비스를 통해 파일을 읽어야 함
            // 현재는 구조만 제공
            this.logger.log(`엑셀 파일 읽기 요청: ${fileId}`);

            return new ExcelReadResponseDto({
                data: [],
                message: '엑셀 파일 읽기가 완료되었습니다.',
            });
        } catch (error) {
            this.logger.error(`엑셀 파일 읽기 실패: ${fileId}`, error.stack);
            throw new BadRequestException('엑셀 파일을 읽는 중 오류가 발생했습니다.');
        }
    }

    /**
     * 출입 이벤트 엑셀 파일 처리
     */
    async processEventHistoriesExcel(
        rawExcelData: any[],
        fileId: string,
        year: string,
        month: string,
    ): Promise<EventHistoriesProcessResponseDto> {
        try {
            const result = await this.excelContextService.엑셀_파일에서_출입_이벤트_데이터를_추출한다(rawExcelData);

            this.logger.log(
                `출입 이벤트 엑셀 처리 완료: ${result.extractedEmployeeInfoList.length}명, ${result.extractEventList.length}개 이벤트`,
            );

            return new EventHistoriesProcessResponseDto({
                message: '출입 이벤트 엑셀 파일 처리가 완료되었습니다.',
                processedEmployees: result.extractedEmployeeInfoList.length,
                processedEvents: result.extractEventList.length,
                year: result.year,
                month: result.month,
            });
        } catch (error) {
            this.logger.error(`출입 이벤트 엑셀 처리 실패: ${fileId}`, error.stack);
            throw new BadRequestException('출입 이벤트 엑셀 파일 처리 중 오류가 발생했습니다.');
        }
    }

    /**
     * 근태 엑셀 파일 처리
     */
    async processAttendanceExcel(
        rawExcelData: any[],
        fileId: string,
        year: string,
        month: string,
    ): Promise<{
        message: string;
        processedEmployees: number;
        processedDepartments: number;
        year: string;
        month: string;
    }> {
        try {
            const result = await this.excelContextService.엑셀_파일에서_근태_데이터를_추출한다(rawExcelData);

            this.logger.log(
                `근태 엑셀 처리 완료: ${result.extractedEmployeeInfoList.length}명, ${result.departments.length}개 부서`,
            );

            return {
                message: '근태 엑셀 파일 처리가 완료되었습니다.',
                processedEmployees: result.extractedEmployeeInfoList.length,
                processedDepartments: result.departments.length,
                year,
                month,
            };
        } catch (error) {
            this.logger.error(`근태 엑셀 처리 실패: ${fileId}`, error.stack);
            throw new BadRequestException('근태 엑셀 파일 처리 중 오류가 발생했습니다.');
        }
    }

    /**
     * 엑셀 임포트 프로세스 생성
     */
    async createExcelImportProcess(
        userId: string,
        eventInfoFileId?: string,
        usedAttendanceFileId?: string,
        year?: string,
        month?: string,
    ): Promise<{
        processId: string;
        message: string;
        status: string;
    }> {
        try {
            if (!eventInfoFileId && !usedAttendanceFileId) {
                throw new BadRequestException('최소 하나의 파일이 필요합니다.');
            }

            // 실제 구현에서는 도메인 서비스를 통해 프로세스 생성
            const processId = `process-${Date.now()}`;

            this.logger.log(`엑셀 임포트 프로세스 생성: ${processId} (사용자: ${userId})`);

            return {
                processId,
                message: '엑셀 임포트 프로세스가 생성되었습니다.',
                status: 'PENDING',
            };
        } catch (error) {
            this.logger.error(`엑셀 임포트 프로세스 생성 실패: ${userId}`, error.stack);
            throw new BadRequestException('엑셀 임포트 프로세스 생성 중 오류가 발생했습니다.');
        }
    }

    /**
     * 엑셀 임포트 프로세스 적용
     */
    async applyExcelImportProcess(processId: string): Promise<{
        message: string;
        processId: string;
        status: string;
        appliedAt: string;
    }> {
        try {
            // 실제 구현에서는 도메인 서비스를 통해 프로세스 적용
            this.logger.log(`엑셀 임포트 프로세스 적용: ${processId}`);

            return {
                message: '엑셀 임포트 프로세스가 성공적으로 적용되었습니다.',
                processId,
                status: 'COMPLETED',
                appliedAt: new Date().toISOString(),
            };
        } catch (error) {
            this.logger.error(`엑셀 임포트 프로세스 적용 실패: ${processId}`, error.stack);
            throw new BadRequestException('엑셀 임포트 프로세스 적용 중 오류가 발생했습니다.');
        }
    }

    /**
     * 사용자별 엑셀 임포트 프로세스 조회
     */
    async getExcelImportProcessByUser(
        userId: string,
        year: string,
        month: string,
    ): Promise<{
        processId: string;
        status: string;
        year: string;
        month: string;
        createdAt: string;
    }> {
        try {
            // 실제 구현에서는 도메인 서비스를 통해 프로세스 조회
            this.logger.log(`사용자별 엑셀 임포트 프로세스 조회: ${userId} (${year}-${month})`);

            return {
                processId: `process-${userId}-${year}-${month}`,
                status: 'PENDING',
                year,
                month,
                createdAt: new Date().toISOString(),
            };
        } catch (error) {
            this.logger.error(`엑셀 임포트 프로세스 조회 실패: ${userId}`, error.stack);
            throw new BadRequestException('엑셀 임포트 프로세스 조회 중 오류가 발생했습니다.');
        }
    }
}
