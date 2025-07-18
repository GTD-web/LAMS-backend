import { EmployeeInfoEntity } from '@src/domain/organization/employee/entities/employee-info.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

    // ë³´ì—¬ì£¼ê¸°??ì¶œê·¼ ?œê°„
    @Column({ nullable: true })
    enter: string;

    // ë³´ì—¬ì£¼ê¸°???´ê·¼ ?œê°„
    @Column({ nullable: true })
    leave: string;

    // ?¤ì œ ì¶œê·¼ ?œê°„
    @Column({ nullable: true })
    realEnter: string;

    // ?¤ì œ ?´ê·¼ ?œê°„

    @Column({ nullable: true })
    realLeave: string;

    // ê²€???„ë£Œ ?¬ë?
    @Column({ default: true })
    isChecked: boolean;

    // ì§€ê°??¬ë?
    @Column({ default: false })
    isLate: boolean;

    // ì¡°í‡´ ?¬ë?
    @Column({ default: false })
    isEarlyLeave: boolean;

    // ê²°ê·¼ ?¬ë?
    @Column({ default: false })
    isAbsent: boolean;

    // ê·¼ë¬´ ?œê°„
    @Column({ type: 'int', nullable: true })
    workTime: number;

    @Column({ nullable: true })
    note: string;

    @BeforeInsert()
    @BeforeUpdate()
    calculateWorkTime() {
        if (this.enter && this.leave && this.date) {
            const enterDate = new Date(`${this.date}T${this.enter}`);
            const leaveDate = new Date(`${this.date}T${this.leave}`);
            const diff = leaveDate.getTime() - enterDate.getTime();
            // Convert milliseconds to minutes
            this.workTime = Math.floor(diff / (1000 * 60));
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
