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
  [AttendanceStatus.LATE]: '지각',
  [AttendanceStatus.EARLY_LEAVE]: '조퇴',
  [AttendanceStatus.HALF_DAY]: '반차',
  [AttendanceStatus.SICK_LEAVE]: '병가',
  [AttendanceStatus.ANNUAL_LEAVE]: '연차',
  [AttendanceStatus.SPECIAL_LEAVE]: '특별휴가',
  [AttendanceStatus.BUSINESS_TRIP]: '출장',
  [AttendanceStatus.REMOTE_WORK]: '재택근무',
} as const;

export const LEAVE_TYPE_LABELS = {
  [LeaveType.ANNUAL_LEAVE]: '연차',
  [LeaveType.SICK_LEAVE]: '병가',
  [LeaveType.MATERNITY_LEAVE]: '출산휴가',
  [LeaveType.PATERNITY_LEAVE]: '육아휴가',
  [LeaveType.BEREAVEMENT_LEAVE]: '경조휴가',
  [LeaveType.SPECIAL_LEAVE]: '특별휴가',
  [LeaveType.UNPAID_LEAVE]: '무급휴가',
} as const;

export const APPROVAL_STATUS_LABELS = {
  [ApprovalStatus.PENDING]: '대기',
  [ApprovalStatus.APPROVED]: '승인',
  [ApprovalStatus.REJECTED]: '거부',
  [ApprovalStatus.CANCELLED]: '취소',
} as const;
