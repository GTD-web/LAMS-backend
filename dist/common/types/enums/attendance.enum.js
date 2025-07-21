"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APPROVAL_STATUS_LABELS = exports.LEAVE_TYPE_LABELS = exports.ATTENDANCE_STATUS_LABELS = exports.WorkType = exports.ApprovalStatus = exports.LeaveType = exports.AttendanceType = exports.AttendanceStatus = void 0;
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "PRESENT";
    AttendanceStatus["ABSENT"] = "ABSENT";
    AttendanceStatus["LATE"] = "LATE";
    AttendanceStatus["EARLY_LEAVE"] = "EARLY_LEAVE";
    AttendanceStatus["HALF_DAY"] = "HALF_DAY";
    AttendanceStatus["SICK_LEAVE"] = "SICK_LEAVE";
    AttendanceStatus["ANNUAL_LEAVE"] = "ANNUAL_LEAVE";
    AttendanceStatus["SPECIAL_LEAVE"] = "SPECIAL_LEAVE";
    AttendanceStatus["BUSINESS_TRIP"] = "BUSINESS_TRIP";
    AttendanceStatus["REMOTE_WORK"] = "REMOTE_WORK";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var AttendanceType;
(function (AttendanceType) {
    AttendanceType["NORMAL"] = "NORMAL";
    AttendanceType["OVERTIME"] = "OVERTIME";
    AttendanceType["HOLIDAY"] = "HOLIDAY";
    AttendanceType["WEEKEND"] = "WEEKEND";
})(AttendanceType || (exports.AttendanceType = AttendanceType = {}));
var LeaveType;
(function (LeaveType) {
    LeaveType["ANNUAL_LEAVE"] = "ANNUAL_LEAVE";
    LeaveType["SICK_LEAVE"] = "SICK_LEAVE";
    LeaveType["MATERNITY_LEAVE"] = "MATERNITY_LEAVE";
    LeaveType["PATERNITY_LEAVE"] = "PATERNITY_LEAVE";
    LeaveType["BEREAVEMENT_LEAVE"] = "BEREAVEMENT_LEAVE";
    LeaveType["SPECIAL_LEAVE"] = "SPECIAL_LEAVE";
    LeaveType["UNPAID_LEAVE"] = "UNPAID_LEAVE";
})(LeaveType || (exports.LeaveType = LeaveType = {}));
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "PENDING";
    ApprovalStatus["APPROVED"] = "APPROVED";
    ApprovalStatus["REJECTED"] = "REJECTED";
    ApprovalStatus["CANCELLED"] = "CANCELLED";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
var WorkType;
(function (WorkType) {
    WorkType["OFFICE"] = "OFFICE";
    WorkType["REMOTE"] = "REMOTE";
    WorkType["HYBRID"] = "HYBRID";
    WorkType["BUSINESS_TRIP"] = "BUSINESS_TRIP";
})(WorkType || (exports.WorkType = WorkType = {}));
exports.ATTENDANCE_STATUS_LABELS = {
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
};
exports.LEAVE_TYPE_LABELS = {
    [LeaveType.ANNUAL_LEAVE]: '??',
    [LeaveType.SICK_LEAVE]: '??',
    [LeaveType.MATERNITY_LEAVE]: '?? ??',
    [LeaveType.PATERNITY_LEAVE]: '?? ??',
    [LeaveType.BEREAVEMENT_LEAVE]: '?? ??',
    [LeaveType.SPECIAL_LEAVE]: '?? ??',
    [LeaveType.UNPAID_LEAVE]: '?? ??',
};
exports.APPROVAL_STATUS_LABELS = {
    [ApprovalStatus.PENDING]: '??',
    [ApprovalStatus.APPROVED]: '??',
    [ApprovalStatus.REJECTED]: '??',
    [ApprovalStatus.CANCELLED]: '??',
};
//# sourceMappingURL=attendance.enum.js.map