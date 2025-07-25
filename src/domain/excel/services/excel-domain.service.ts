import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExcelImportProcessEntity } from '../entities/excel-import-process.entity';
import { FileEntity } from 'src/domain/file/entities/file.entity';
import * as XLSX from 'xlsx';

/**
 * 엑셀 도메인 서비스
 * - 엑셀 파일 처리 핵심 로직
 * - 파일 읽기, 데이터 변환, 프로세스 관리
 */
@Injectable()
export class ExcelDomainService {
    private readonly logger = new Logger(ExcelDomainService.name);

    constructor(
        @InjectRepository(FileEntity)
        private readonly fileRepository: Repository<FileEntity>,
        @InjectRepository(ExcelImportProcessEntity)
        private readonly excelImportProcessRepository: Repository<ExcelImportProcessEntity>,
    ) {}

    /**
     * 파일 ID로 파일 엔티티 조회
     */
    async findFileById(fileId: string): Promise<FileEntity> {
        const file = await this.fileRepository.findOne({
            where: { fileId },
        });

        if (!file) {
            throw new BadRequestException('파일이 존재하지 않습니다. 파일을 확인하시기 바랍니다.');
        }

        return file;
    }

    /**
     * 엑셀 파일 읽기
     */
    readExcelFile(filePath: string): any[] {
        try {
            const workbook = XLSX.readFile(filePath);

            if (workbook.SheetNames.length === 0) {
                throw new BadRequestException('엑셀 파일이 비어있습니다.');
            }

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            if (!sheet) {
                throw new BadRequestException('엑셀 시트가 존재하지 않습니다.');
            }

            const data = XLSX.utils.sheet_to_json(sheet);
            this.logger.debug(`엑셀 파일 읽기 완료: ${data.length}개 행`);

            return data;
        } catch (error) {
            this.logger.error(`엑셀 파일 읽기 실패: ${filePath}`, error.stack);
            throw new BadRequestException('엑셀 파일을 읽는 중 오류가 발생했습니다.');
        }
    }

    /**
     * 파일 상태 업데이트
     */
    async updateFileStatus(file: FileEntity, status: 'read' | 'error', errorMessage?: string): Promise<FileEntity> {
        if (status === 'read') {
            file.readFile();
        } else if (status === 'error' && errorMessage) {
            file.errorFile(errorMessage);
        }

        const savedFile = await this.fileRepository.save(file);
        this.logger.log(`파일 상태 업데이트: ${file.fileOriginalName} -> ${status}`);

        return savedFile;
    }

    /**
     * 엑셀 임포트 프로세스 생성
     */
    async createExcelImportProcess(processData: Partial<ExcelImportProcessEntity>): Promise<ExcelImportProcessEntity> {
        const process = this.excelImportProcessRepository.create(processData);
        const savedProcess = await this.excelImportProcessRepository.save(process);

        this.logger.log(`엑셀 임포트 프로세스 생성: ${savedProcess.excelImportProcessId}`);
        return savedProcess;
    }

    /**
     * 엑셀 임포트 프로세스 조회 (ID)
     */
    async findExcelImportProcessById(processId: string): Promise<ExcelImportProcessEntity> {
        const process = await this.excelImportProcessRepository.findOne({
            where: { excelImportProcessId: processId },
            relations: ['user'],
        });

        if (!process) {
            throw new BadRequestException('프로세스가 존재하지 않습니다.');
        }

        return process;
    }

    /**
     * 엑셀 임포트 프로세스 조회 (사용자 ID, 년월)
     */
    async findExcelImportProcessByUser(userId: string, year: string, month: string): Promise<ExcelImportProcessEntity> {
        const process = await this.excelImportProcessRepository.findOne({
            where: {
                user: { userId },
                year,
                month,
            },
            relations: ['user'],
        });

        if (!process) {
            throw new BadRequestException('프로세스가 존재하지 않습니다.');
        }

        return process;
    }

    /**
     * 엑셀 임포트 프로세스 저장
     */
    async saveExcelImportProcess(process: ExcelImportProcessEntity): Promise<ExcelImportProcessEntity> {
        const savedProcess = await this.excelImportProcessRepository.save(process);
        this.logger.log(`엑셀 임포트 프로세스 저장: ${savedProcess.excelImportProcessId}`);

        return savedProcess;
    }

    /**
     * 엑셀 임포트 프로세스 상태 업데이트
     */
    async updateProcessStatus(processId: string, status: string): Promise<ExcelImportProcessEntity> {
        const process = await this.findExcelImportProcessById(processId);
        process.status = status;

        return await this.saveExcelImportProcess(process);
    }

    /**
     * 대량 파일 상태 업데이트
     */
    async bulkUpdateFileStatus(fileIds: string[], status: 'read' | 'error'): Promise<void> {
        const files = await this.fileRepository.findByIds(fileIds);

        for (const file of files) {
            await this.updateFileStatus(file, status);
        }

        this.logger.log(`대량 파일 상태 업데이트 완료: ${files.length}개 파일`);
    }
}
