export enum AttendanceStatus {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT',
    LATE = 'LATE',
    EARLY_LEAVE = 'EARLY_LEAVE',
    HALF_DAY = 'HALF_DAY',
    SICK_LEAVE = 'SICK_LEAVE',
    ANNUAL_LEAVE = 'ANNUAL_LEAVE',
    SPECIAL_LEAVE = 'SPECIAL_LEAVE',
    BUSINESS_TRIP = 'BUSINESS_TRIP',
    REMOTE_WORK = 'REMOTE_WORK',
}

export enum AttendanceType {
    NORMAL = 'NORMAL',
    OVERTIME = 'OVERTIME',
    HOLIDAY = 'HOLIDAY',
    WEEKEND = 'WEEKEND',
}

export enum LeaveType {
    ANNUAL_LEAVE = 'ANNUAL_LEAVE',
    SICK_LEAVE = 'SICK_LEAVE',
    MATERNITY_LEAVE = 'MATERNITY_LEAVE',
    PATERNITY_LEAVE = 'PATERNITY_LEAVE',
    BEREAVEMENT_LEAVE = 'BEREAVEMENT_LEAVE',
    SPECIAL_LEAVE = 'SPECIAL_LEAVE',
    UNPAID_LEAVE = 'UNPAID_LEAVE',
}

export enum ApprovalStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
}

export enum WorkType {
    OFFICE = 'OFFICE',
    REMOTE = 'REMOTE',
    HYBRID = 'HYBRID',
    BUSINESS_TRIP = 'BUSINESS_TRIP',
}

export const ATTENDANCE_STATUS_LABELS = {
    [AttendanceStatus.PRESENT]: '??',
    [AttendanceStatus.ABSENT]: '??',
    [AttendanceStatus.LATE]: '??',
    [AttendanceStatus.EARLY_LEAVE]: '??',
    [AttendanceStatus.HALF_DAY]: '??',
    [AttendanceStatus.SICK_LEAVE]: '??',
    [AttendanceStatus.ANNUAL_LEAVE]: '??',
    [AttendanceStatus.SPECIAL_LEAVE]: '?? ??',
    [AttendanceStatus.BUSINESS_TRIP]: '??',
    [AttendanceStatus.REMOTE_WORK]: '?? ??',
} as const;

export const LEAVE_TYPE_LABELS = {
    [LeaveType.ANNUAL_LEAVE]: '??',
    [LeaveType.SICK_LEAVE]: '??',
    [LeaveType.MATERNITY_LEAVE]: '?? ??',
    [LeaveType.PATERNITY_LEAVE]: '?? ??',
    [LeaveType.BEREAVEMENT_LEAVE]: '?? ??',
    [LeaveType.SPECIAL_LEAVE]: '?? ??',
    [LeaveType.UNPAID_LEAVE]: '?? ??',
} as const;

export const APPROVAL_STATUS_LABELS = {
    [ApprovalStatus.PENDING]: '??',
    [ApprovalStatus.APPROVED]: '??',
    [ApprovalStatus.REJECTED]: '??',
    [ApprovalStatus.CANCELLED]: '??',
} as const;
