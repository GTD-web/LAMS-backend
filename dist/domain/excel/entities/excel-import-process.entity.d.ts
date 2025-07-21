import { UserEntity } from '@src/domain/user/entities/user.entity';
export declare class ExcelImportProcessEntity {
    excelImportProcessId: string;
    departmentInfoJson: string;
    employeeInfoJson: string;
    dataJson: string;
    extractedExcelDataList: any[];
    status: string;
    year: string;
    month: string;
    eventInfoFileId: string;
    usedAttendanceFileId: string;
    createdAt: Date;
    user: UserEntity;
}
