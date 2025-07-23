import { EmployeeInfoEntity } from '@src/domain/employee/entities/employee-info.entity';
import { AttendanceTypeEntity } from '../../../attendance-type/entities/attendance-type.entity';
export declare class UsedAttendanceEntity {
    usedAttendanceId: string;
    usedAt: string;
    createdAt: string;
    updatedAt: string;
    employee: EmployeeInfoEntity;
    attendanceType: AttendanceTypeEntity;
    updateUsedAttendance(dto: {
        usedAt: string;
        attendanceType: AttendanceTypeEntity;
    }): void;
}
