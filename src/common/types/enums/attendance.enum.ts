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
  [AttendanceStatus.PRESENT]: '출근',
  [AttendanceStatus.ABSENT]: '결근',
  [AttendanceStatus.LATE]: '지�?,
  [AttendanceStatus.EARLY_LEAVE]: '조퇴',
  [AttendanceStatus.HALF_DAY]: '반차',
  [AttendanceStatus.SICK_LEAVE]: '병�?',
  [AttendanceStatus.ANNUAL_LEAVE]: '?�차',
  [AttendanceStatus.SPECIAL_LEAVE]: '?�별?��?',
  [AttendanceStatus.BUSINESS_TRIP]: '출장',
  [AttendanceStatus.REMOTE_WORK]: '?�택근무',
} as const;

export const LEAVE_TYPE_LABELS = {
  [LeaveType.ANNUAL_LEAVE]: '?�차',
  [LeaveType.SICK_LEAVE]: '병�?',
  [LeaveType.MATERNITY_LEAVE]: '출산?��?',
  [LeaveType.PATERNITY_LEAVE]: '?�아?��?',
  [LeaveType.BEREAVEMENT_LEAVE]: '경조?��?',
  [LeaveType.SPECIAL_LEAVE]: '?�별?��?',
  [LeaveType.UNPAID_LEAVE]: '무급?��?',
} as const;

export const APPROVAL_STATUS_LABELS = {
  [ApprovalStatus.PENDING]: '?��?,
  [ApprovalStatus.APPROVED]: '?�인',
  [ApprovalStatus.REJECTED]: '거�?',
  [ApprovalStatus.CANCELLED]: '취소',
} as const;
