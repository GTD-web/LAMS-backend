import { EmployeeInfoEntity } from '@src/domain/organization/employee/entities/employee-info.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum BirthDayLeaveStatus {
    CAN_NOT_INPUT = '?ì¼???…ë ¥?˜ì? ?ŠìŒ',
    CAN_NOT_USED = '?ì¼ ?´ê? ?¬ìš©?˜ì? ?ŠìŒ',
    USED = '?ì¼ ?´ê? ?¬ìš©??,
}

@Entity()
export class EmployeeAnnualLeaveEntity {
    @PrimaryGeneratedColumn('uuid')
    annualLeaveId: string;

    @ManyToOne(() => EmployeeInfoEntity)
    @JoinColumn({ name: 'employeeId' })
    employee: EmployeeInfoEntity;

    @Column()
    year: number;

    @Column({ type: 'float' })
    fiscalYearTotalLeave: number;

    @Column({ type: 'float' })
    currentFiscalYearLeave: number;

    @Column()
    entryDateBasedTotalLeave: number;

    @Column({ type: 'float' })
    usedAnnualLeave: number;

    @Column({ type: 'float', default: 0 })
    remainedAnnualLeave: number;

    @Column({ type: 'text', default: BirthDayLeaveStatus.CAN_NOT_USED })
    birthDayLeaveStatus: BirthDayLeaveStatus;

    @Column('simple-json', {
        nullable: true,
    })
    birthDayLeaveDetails: any[];

    @Column({ nullable: true })
    note: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ default: false })
    isAdjusted: boolean;

    updateAnnualLeave(dto: Partial<EmployeeAnnualLeaveEntity>) {
        for (const key in dto) {
            if (dto[key] !== undefined) {
                this[key] = dto[key];
            }
        }
    }
}
