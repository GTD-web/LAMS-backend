export declare class AttendanceTypeEntity {
    attendanceTypeId?: string;
    title: string;
    workTime: number;
    isRecognizedWorkTime: boolean;
    startWorkTime: string;
    endWorkTime: string;
    deductedAnnualLeave: number;
    createdAt: Date;
    updatedAt: Date;
    updateAttendanceTypeEntity(dto: Partial<AttendanceTypeEntity>): void;
    calculateWorkTime(): void;
}
