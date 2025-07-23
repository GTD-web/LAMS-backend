import { EmployeeInfoEntity } from '../../../../domain/employee/entities/employee-info.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AttendanceTypeEntity } from '../../../attendance-type/entities/attendance-type.entity';
@Entity()
export class UsedAttendanceEntity {
    @PrimaryGeneratedColumn('uuid')
    usedAttendanceId: string;

    @Column()
    usedAt: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @ManyToOne(() => EmployeeInfoEntity)
    @JoinColumn({ name: 'employeeId' })
    employee: EmployeeInfoEntity;

    @ManyToOne(() => AttendanceTypeEntity)
    @JoinColumn({ name: 'attendanceTypeId' })
    attendanceType: AttendanceTypeEntity;

    updateUsedAttendance(dto: { usedAt: string; attendanceType: AttendanceTypeEntity }) {
        for (const key in dto) {
            if (dto[key]) {
                this[key] = dto[key];
            }
        }
    }
}
