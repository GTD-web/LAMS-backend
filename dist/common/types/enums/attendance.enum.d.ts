export declare enum AttendanceStatus {
    PRESENT = "PRESENT",
    ABSENT = "ABSENT",
    LATE = "LATE",
    EARLY_LEAVE = "EARLY_LEAVE",
    HALF_DAY = "HALF_DAY",
    SICK_LEAVE = "SICK_LEAVE",
    ANNUAL_LEAVE = "ANNUAL_LEAVE",
    SPECIAL_LEAVE = "SPECIAL_LEAVE",
    BUSINESS_TRIP = "BUSINESS_TRIP",
    REMOTE_WORK = "REMOTE_WORK"
}
export declare enum AttendanceType {
    NORMAL = "NORMAL",
    OVERTIME = "OVERTIME",
    HOLIDAY = "HOLIDAY",
    WEEKEND = "WEEKEND"
}
export declare enum LeaveType {
    ANNUAL_LEAVE = "ANNUAL_LEAVE",
    SICK_LEAVE = "SICK_LEAVE",
    MATERNITY_LEAVE = "MATERNITY_LEAVE",
    PATERNITY_LEAVE = "PATERNITY_LEAVE",
    BEREAVEMENT_LEAVE = "BEREAVEMENT_LEAVE",
    SPECIAL_LEAVE = "SPECIAL_LEAVE",
    UNPAID_LEAVE = "UNPAID_LEAVE"
}
export declare enum ApprovalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
export declare enum WorkType {
    OFFICE = "OFFICE",
    REMOTE = "REMOTE",
    HYBRID = "HYBRID",
    BUSINESS_TRIP = "BUSINESS_TRIP"
}
export declare const ATTENDANCE_STATUS_LABELS: {
    readonly PRESENT: "??";
    readonly ABSENT: "??";
    readonly LATE: "??";
    readonly EARLY_LEAVE: "??";
    readonly HALF_DAY: "??";
    readonly SICK_LEAVE: "??";
    readonly ANNUAL_LEAVE: "??";
    readonly SPECIAL_LEAVE: "?? ??";
    readonly BUSINESS_TRIP: "??";
    readonly REMOTE_WORK: "?? ??";
};
export declare const LEAVE_TYPE_LABELS: {
    readonly ANNUAL_LEAVE: "??";
    readonly SICK_LEAVE: "??";
    readonly MATERNITY_LEAVE: "?? ??";
    readonly PATERNITY_LEAVE: "?? ??";
    readonly BEREAVEMENT_LEAVE: "?? ??";
    readonly SPECIAL_LEAVE: "?? ??";
    readonly UNPAID_LEAVE: "?? ??";
};
export declare const APPROVAL_STATUS_LABELS: {
    readonly PENDING: "??";
    readonly APPROVED: "??";
    readonly REJECTED: "??";
    readonly CANCELLED: "??";
};
