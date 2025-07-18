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
  [AttendanceStatus.PRESENT]: 'Ï∂úÍ∑º',
  [AttendanceStatus.ABSENT]: 'Í≤∞Í∑º',
  [AttendanceStatus.LATE]: 'ÏßÄÍ∞?,
  [AttendanceStatus.EARLY_LEAVE]: 'Ï°∞Ìá¥',
  [AttendanceStatus.HALF_DAY]: 'Î∞òÏ∞®',
  [AttendanceStatus.SICK_LEAVE]: 'Î≥ëÍ?',
  [AttendanceStatus.ANNUAL_LEAVE]: '?∞Ï∞®',
  [AttendanceStatus.SPECIAL_LEAVE]: '?πÎ≥Ñ?¥Í?',
  [AttendanceStatus.BUSINESS_TRIP]: 'Ï∂úÏû•',
  [AttendanceStatus.REMOTE_WORK]: '?¨ÌÉùÍ∑ºÎ¨¥',
} as const;

export const LEAVE_TYPE_LABELS = {
  [LeaveType.ANNUAL_LEAVE]: '?∞Ï∞®',
  [LeaveType.SICK_LEAVE]: 'Î≥ëÍ?',
  [LeaveType.MATERNITY_LEAVE]: 'Ï∂úÏÇ∞?¥Í?',
  [LeaveType.PATERNITY_LEAVE]: '?°ÏïÑ?¥Í?',
  [LeaveType.BEREAVEMENT_LEAVE]: 'Í≤ΩÏ°∞?¥Í?',
  [LeaveType.SPECIAL_LEAVE]: '?πÎ≥Ñ?¥Í?',
  [LeaveType.UNPAID_LEAVE]: 'Î¨¥Í∏â?¥Í?',
} as const;

export const APPROVAL_STATUS_LABELS = {
  [ApprovalStatus.PENDING]: '?ÄÍ∏?,
  [ApprovalStatus.APPROVED]: '?πÏù∏',
  [ApprovalStatus.REJECTED]: 'Í±∞Î?',
  [ApprovalStatus.CANCELLED]: 'Ï∑®ÏÜå',
} as const;
