import { AttendanceTypeEntity } from '../../../../domain/attendance-type/entities/attendance-type.entity';
export declare class AttendanceTypeResponseDto {
    readonly attendanceTypeId: string;
    readonly title: string;
    readonly workTime: number;
    readonly isRecognizedWorkTime: boolean;
    readonly startWorkTime: string | null;
    readonly endWorkTime: string | null;
    readonly deductedAnnualLeave: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(entity: AttendanceTypeEntity);
    static fromEntity(entity: AttendanceTypeEntity): AttendanceTypeResponseDto;
    static fromEntities(entities: AttendanceTypeEntity[]): AttendanceTypeResponseDto[];
}
