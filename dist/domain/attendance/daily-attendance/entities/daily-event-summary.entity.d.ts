import { EmployeeInfoEntity } from '@src/domain/employee/entities/employee-info.entity';
export declare class DailyEventSummaryEntity {
    dailyEventSummaryId: string;
    date: string;
    employee: EmployeeInfoEntity;
    isHoliday: boolean;
    enter: string;
    leave: string;
    realEnter: string;
    realLeave: string;
    isChecked: boolean;
    isLate: boolean;
    isEarlyLeave: boolean;
    isAbsent: boolean;
    workTime: number;
    note: string;
    calculateWorkTime(): void;
    inputEventTime(earliest: string, latest: string): void;
    resetEventTime(): void;
    updateNote(note: string): void;
}
