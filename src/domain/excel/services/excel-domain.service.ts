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
     * Excel import process를 생성한다
     */
    async createExcelImportProcess(data: Partial<ExcelImportProcessEntity>): Promise<ExcelImportProcessEntity> {
        const process = this.excelImportProcessRepository.create(data);
        const savedProcess = await this.excelImportProcessRepository.save(process);

        this.logger.log(`Excel import process 생성: ${savedProcess.excelImportProcessId}`);
        return savedProcess;
    }

    /**
     * Excel import process를 저장한다
     */
    async saveExcelImportProcess(data: Partial<ExcelImportProcessEntity>): Promise<ExcelImportProcessEntity> {
        const savedProcess = await this.excelImportProcessRepository.save(data);

        this.logger.log(`Excel import process 저장: ${savedProcess.excelImportProcessId}`);
        return savedProcess;
    }

    /**
     * Excel import process를 ID로 조회한다
     */
    async findExcelImportProcessById(excelImportProcessId: string): Promise<ExcelImportProcessEntity> {
        const process = await this.excelImportProcessRepository.findOne({
            where: { excelImportProcessId },
            relations: ['user'],
        });

        if (!process) {
            throw new BadRequestException('Excel import process를 찾을 수 없습니다.');
        }

        return process;
    }

    /**
     * 사용자별 Excel import process를 조회한다
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
            throw new BadRequestException('해당 기간의 Excel import process를 찾을 수 없습니다.');
        }

        return process;
    }

    /**
     * Excel import process 상태를 업데이트한다
     */
    async updateProcessStatus(excelImportProcessId: string, status: string): Promise<ExcelImportProcessEntity> {
        const process = await this.findExcelImportProcessById(excelImportProcessId);
        process.status = status;

        const updatedProcess = await this.excelImportProcessRepository.save(process);
        this.logger.log(`Excel import process 상태 업데이트: ${excelImportProcessId} -> ${status}`);

        return updatedProcess;
    }

    /**
     * 파일을 ID로 조회한다
     */
    async findFileById(fileId: string): Promise<FileEntity> {
        const file = await this.fileRepository.findOne({
            where: { fileId },
        });

        if (!file) {
            throw new BadRequestException('파일을 찾을 수 없습니다.');
        }

        return file;
    }

    /**
     * 엑셀 파일을 읽는다 (파일 경로 기반)
     */
    readExcelFileFromPath(filePath: string): any[] {
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

            return XLSX.utils.sheet_to_json(sheet);
        } catch (error) {
            this.logger.error(`엑셀 파일 읽기 실패: ${filePath}`, error.stack);
            throw new BadRequestException('엑셀 파일을 읽는 중 오류가 발생했습니다.');
        }
    }

    /**
     * 파일 ID로 엑셀 파일을 읽는다
     */
    async readExcelFileById(fileId: string): Promise<any[]> {
        const file = await this.findFileById(fileId);

        // 실제 구현에서는 Supabase Storage에서 파일을 다운로드하여 읽어야 함
        // 현재는 임시로 빈 배열 반환
        this.logger.log(`엑셀 파일 읽기: ${file.fileOriginalName}`);

        // TODO: Supabase Storage에서 파일 다운로드 후 XLSX로 읽기
        return [];
    }

    /**
     * Excel import process 목록을 조회한다
     */
    async findExcelImportProcessesByUser(userId: string): Promise<ExcelImportProcessEntity[]> {
        const processes = await this.excelImportProcessRepository.find({
            where: {
                user: { userId },
            },
            relations: ['user'],
            order: {
                createdAt: 'DESC',
            },
        });

        return processes;
    }

    /**
     * Excel import process를 삭제한다 (soft delete)
     */
    async deleteExcelImportProcess(excelImportProcessId: string): Promise<void> {
        const process = await this.findExcelImportProcessById(excelImportProcessId);

        // 실제 삭제 대신 상태를 'DELETED'로 변경
        process.status = 'DELETED';
        await this.excelImportProcessRepository.save(process);

        this.logger.log(`Excel import process 삭제: ${excelImportProcessId}`);
    }

    /**
     * 파일 상태를 업데이트한다
     */
    async updateFileStatus(fileId: string, status: string): Promise<FileEntity> {
        const file = await this.findFileById(fileId);

        // FileEntity에 status 필드가 있다고 가정
        // 실제 구현에서는 FileEntity 구조에 맞게 수정 필요
        await this.fileRepository.save(file);

        this.logger.log(`파일 상태 업데이트: ${fileId} -> ${status}`);
        return file;
    }
}
