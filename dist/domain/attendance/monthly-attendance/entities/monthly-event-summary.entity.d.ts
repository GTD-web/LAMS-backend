export declare class MonthlyEmployeeAttendanceInfoEntity {
    monthlyEventSummaryId: string;
    employeeNumber: string;
    employeeId: string;
    employeeName: string;
    yyyymm: string;
    note?: string;
    additionalNote?: string;
    workDaysCount: number;
    totalWorkableTime: number;
    totalWorkTime: number;
    avgWorkTimes: number;
    attendanceTypeCount: Record<string, number>;
    dailyEventSummary: any[];
    weeklyWorkTimeSummary: any[];
    lateDetails: any[];
    absenceDetails: any[];
    earlyLeaveDetails: any[];
    createdAt: Date;
    updatedAt: Date;
    updateSummary(params: {
        employeeInfo: {
            employeeNumber: string;
            employeeId: string;
            employeeName: string;
        };
        yyyymm: string;
        totalWorkableTime: number;
        totalWorkTime: number;
        workDaysCount: number;
        avgWorkTimes: number;
        attendanceTypeCount: Record<string, number>;
        weeklyWorkTimeSummary: any[];
        dailyEventSummary: any[];
        lateDetails: any[];
        absenceDetails: any[];
        earlyLeaveDetails: any[];
        note: string;
    }): void;
    static create(params: {
        employeeInfo: {
            employeeNumber: string;
            employeeId: string;
            employeeName: string;
        };
        yyyymm: string;
        totalWorkableTime: number;
        totalWorkTime: number;
        workDaysCount: number;
        avgWorkTimes: number;
        attendanceTypeCount: Record<string, number>;
        weeklyWorkTimeSummary: any[];
        dailyEventSummary: any[];
        lateDetails: any[];
        absenceDetails: any[];
        earlyLeaveDetails: any[];
        note: string;
    }): MonthlyEmployeeAttendanceInfoEntity;
}
