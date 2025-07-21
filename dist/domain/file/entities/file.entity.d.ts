export declare enum FileStatus {
    UNREAD = "unread",
    READ = "read",
    ERROR = "error"
}
export declare class FileEntity {
    fileId: string;
    fileName: string;
    fileOriginalName: string;
    filePath: string;
    year: string;
    month: string;
    readAt: string;
    status: FileStatus;
    error: string;
    uploadBy: string;
    uploadedAt: string;
    readFile(): void;
    errorFile(e: any): void;
    setYearAndMonth(year: string, month: string): void;
}
