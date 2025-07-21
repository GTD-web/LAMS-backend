import { EmployeeInfoEntity } from '@src/domain/organization/employee/entities/employee-info.entity';
export declare enum BirthDayLeaveStatus {
    CAN_NOT_INPUT = "???? ??? ? ??",
    CAN_NOT_USED = "?? ?? ??? ? ??",
    USED = "?? ?? ???"
}
export declare class EmployeeAnnualLeaveEntity {
    annualLeaveId: string;
    employee: EmployeeInfoEntity;
    year: number;
    fiscalYearTotalLeave: number;
    currentFiscalYearLeave: number;
    entryDateBasedTotalLeave: number;
    usedAnnualLeave: number;
    remainedAnnualLeave: number;
    birthDayLeaveStatus: BirthDayLeaveStatus;
    birthDayLeaveDetails: any[];
    note: string;
    createdAt: Date;
    updatedAt: Date;
    isAdjusted: boolean;
    updateAnnualLeave(dto: Partial<EmployeeAnnualLeaveEntity>): void;
}
