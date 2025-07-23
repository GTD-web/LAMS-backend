import { EmployeeInfoEntity } from '../../../../domain/employee/entities/employee-info.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DateHelper } from '../../../../common/utils/helpers/date.helper';

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

    // 보여주기용 출근 시간
    @Column({ nullable: true })
    enter: string;

    // 보여주기용 퇴근 시간
    @Column({ nullable: true })
    leave: string;

    // 실제 출근 시간
    @Column({ nullable: true })
    realEnter: string;

    // 실제 퇴근 시간

    @Column({ nullable: true })
    realLeave: string;

    // 검증 완료 여부
    @Column({ default: true })
    isChecked: boolean;

    // 지각 여부
    @Column({ default: false })
    isLate: boolean;

    // 조퇴 여부
    @Column({ default: false })
    isEarlyLeave: boolean;

    // 결근 여부
    @Column({ default: false })
    isAbsent: boolean;

    // 근무 시간
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
