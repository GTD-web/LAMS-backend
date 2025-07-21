import { Repository, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { AttendanceTypeEntity } from '../entities/attendance-type.entity';
export declare class AttendanceTypeDomainService {
    private readonly attendanceTypeRepository;
    private readonly logger;
    constructor(attendanceTypeRepository: Repository<AttendanceTypeEntity>);
    findAttendanceTypeById(attendanceTypeId: string): Promise<AttendanceTypeEntity | null>;
    findAttendanceTypes(page?: number, limit?: number, where?: FindOptionsWhere<AttendanceTypeEntity>, order?: FindOptionsOrder<AttendanceTypeEntity>): Promise<{
        attendanceTypes: AttendanceTypeEntity[];
        total: number;
    }>;
    createAttendanceType(attendanceTypeData: Partial<AttendanceTypeEntity>): Promise<AttendanceTypeEntity>;
    updateAttendanceType(attendanceTypeId: string, updateData: Partial<AttendanceTypeEntity>): Promise<AttendanceTypeEntity>;
    deleteAttendanceType(attendanceTypeId: string): Promise<boolean>;
    saveAttendanceType(attendanceType: AttendanceTypeEntity): Promise<AttendanceTypeEntity>;
    findAllAttendanceTypes(): Promise<AttendanceTypeEntity[]>;
}
