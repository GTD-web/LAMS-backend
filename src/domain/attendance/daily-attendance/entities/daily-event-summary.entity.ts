import { EmployeeInfoEntity } from '@src/domain/organization/employee/entities/employee-info.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DateHelper } from '@src/common/utils/helpers/date.helper';

@Entity()
@Index(['date', 'employee'])
export class DailyEventSummaryEntity {
    @PrimaryGeneratedColumn('uuid')
    dailyEventSummaryId: string;

    @Column({ type: 'date' })
    date: string;

    @ManyToOne(() => EmployeeInfoEntity, (employee) => employee.dailyEventSummaries, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    employee: EmployeeInfoEntity;

    @Column({ type: 'boolean', default: false })
    isHoliday: boolean;

    // 보여주기??출근 ?�간
    @Column({ nullable: true })
    enter: string;

    // 보여주기???�근 ?�간
    @Column({ nullable: true })
    leave: string;

    // ?�제 출근 ?�간
    @Column({ nullable: true })
    realEnter: string;

    // ?�제 ?�근 ?�간

    @Column({ nullable: true })
    realLeave: string;

    // 검???�료 ?��?
    @Column({ default: true })
    isChecked: boolean;

    // 지�??��?
    @Column({ default: false })
    isLate: boolean;

    // 조퇴 ?��?
    @Column({ default: false })
    isEarlyLeave: boolean;

    // 결근 ?��?
    @Column({ default: false })
    isAbsent: boolean;

    // 근무 ?�간
    @Column({ type: 'int', nullable: true })
    workTime: number;

    @Column({ nullable: true })
    note: string;

    @BeforeInsert()
    @BeforeUpdate()
    calculateWorkTime() {
        if (this.enter && this.leave && this.date) {
            const workHours = DateHelper.calculateWorkHours(this.enter, this.leave, this.date);
            this.workTime = Math.floor(workHours * 60); // Convert hours to minutes
        } else {
            this.workTime = null;
        }
    }

    inputEventTime(earliest: string, latest: string) {
        this.enter = earliest;
        this.leave = latest;
        this.realEnter = earliest;
        this.realLeave = latest;
        this.isAbsent = false;
        this.isLate = false;
        this.isEarlyLeave = false;
        this.isChecked = true;
        this.note = '';
    }

    resetEventTime() {
        this.enter = '';
        this.leave = '';
        this.realEnter = '';
        this.realLeave = '';
        this.isAbsent = false;
        this.isLate = false;
        this.isEarlyLeave = false;
        this.isChecked = true;
        this.note = '';
    }

    updateNote(note: string) {
        this.note = note;
    }
}
