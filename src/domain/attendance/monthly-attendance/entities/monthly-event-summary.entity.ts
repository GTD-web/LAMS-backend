import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class MonthlyEmployeeAttendanceInfoEntity {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        description: '?îÎ≥Ñ ?¥Î≤§???îÏïΩ ?ÑÏù¥??,
        example: 'exMonthlyEventSummaryId',
    })
    monthlyEventSummaryId: string;

    @Column()
    @ApiProperty({
        description: '?¨Ïõê Î≤àÌò∏',
        example: '23027',
    })
    employeeNumber: string;

    @Column()
    @ApiProperty({
        description: '?¨Ïõê Í≥†Ïú† ?ÑÏù¥??,
        example: 'exEmployeeId',
    })
    employeeId: string;

    @Column({
        nullable: true,
    })
    @ApiProperty({
        description: '?¨Ïõê ?¥Î¶Ñ',
        example: '?çÍ∏∏??,
    })
    employeeName: string;

    @Column()
    @ApiProperty({
        description: '?¥Îãπ ?îÏùò Ï≤???,
        example: '2023-07',
    })
    yyyymm: string;

    @Column({ nullable: true })
    @ApiProperty({
        description: 'ÎπÑÍ≥†',
        example: '?¥Í? 1???¨Ïö©',
    })
    note?: string;

    @Column({ default: '' })
    @ApiProperty({
        description: '?îÍ∞Ñ Í∑ºÌÉú ?îÏïΩ ?∏Ìä∏',
        example: '?¥Í? 1???¨Ïö©',
    })
    additionalNote?: string;

    @Column()
    @ApiProperty({
        description: 'Í∑ºÎ¨¥ ?ºÏàò',
        example: 22,
    })
    workDaysCount: number;

    @Column('int', {
        nullable: true,
    })
    @ApiProperty({
        description: 'Ï¥??ÖÎ¨¥ Í∞Ä???úÍ∞Ñ (Î∂??®ÏúÑ)',
        example: 12801,
    })
    totalWorkableTime: number;

    @Column('int')
    @ApiProperty({
        description: 'Ï¥?Í∑ºÎ¨¥ ?úÍ∞Ñ (Î∂??®ÏúÑ)',
        example: 12801,
    })
    totalWorkTime: number;

    @Column('float')
    @ApiProperty({
        description: '?âÍ∑† Í∑ºÎ¨¥ ?úÍ∞Ñ (Î∂??®ÏúÑ)',
        example: 581.86,
    })
    avgWorkTimes: number;

    @Column('simple-json')
    @ApiProperty({
        description: 'Í∑ºÌÉú ?†ÌòïÎ≥??üÏàò',
        example: {
            ?∞Ï∞®: 1,
            ?§Ï†ÑÎ∞òÏ∞®: 0,
            ?§ÌõÑÎ∞òÏ∞®: 0,
            // ... Í∏∞Ì? Í∑ºÌÉú ?†Ìòï
        },
    })
    attendanceTypeCount: Record<string, number>;

    @Column('simple-json', {
        nullable: true,
    })
    @ApiProperty({
        description: '?ºÎ≥Ñ ?¥Î≤§???îÏïΩ',
        example: [
            {
                dailyEventSummaryId: '8a5a35e8-46fd-458f-9ccf-843404b5e0c8',
                date: '2024-06-01',
                enter: '2024-06-01 09:05:30',
                leave: '2024-06-01 17:58:50',
                workTime: 533,
                usedAttendances: [],
            },
            // ... other daily summaries
        ],
    })
    dailyEventSummary: any[];

    @Column('simple-json', {
        nullable: true,
    })
    @ApiProperty({
        description: 'Ï£ºÎ≥Ñ ?¥Î≤§???îÏïΩ',
        example: [
            {
                weekNumber: 21,
                startDate: '2024-05-26',
                endDate: '2024-06-01',
                weeklyWorkTime: 533,
            },
        ],
    })
    weeklyWorkTimeSummary: any[];

    @Column('simple-json', {
        nullable: true,
    })
    @ApiProperty({
        description: 'ÏßÄÍ∞??ÅÏÑ∏?ïÎ≥¥',
        example: [
            {
                dailyEventSummaryId: '8a5a35e8-46fd-458f-9ccf-843404b5e0c8',
                date: '2024-06-01',
                enter: '2024-06-01 09:05:30',
                leave: '2024-06-01 17:58:50',
                workTime: 533,
                usedAttendances: [],
            },
        ],
    })
    lateDetails: any[];

    @Column('simple-json', {
        nullable: true,
    })
    @ApiProperty({
        description: 'Í≤∞Í∑º ?ÅÏÑ∏?ïÎ≥¥',
        example: [
            {
                dailyEventSummaryId: '8a5a35e8-46fd-458f-9ccf-843404b5e0c8',
                date: '2024-06-01',
                enter: '2024-06-01 09:05:30',
                leave: '2024-06-01 17:58:50',
                workTime: 533,
                usedAttendances: [],
            },
        ],
    })
    absenceDetails: any[];

    @Column('simple-json', {
        nullable: true,
    })
    @ApiProperty({
        description: 'Ï°∞Ìá¥ ?ÅÏÑ∏?ïÎ≥¥',
        example: [
            {
                dailyEventSummaryId: '8a5a35e8-46fd-458f-9ccf-843404b5e0c8',
                date: '2024-06-01',
                enter: '2024-06-01 09:05:30',
                leave: '2024-06-01 17:58:50',
                workTime: 533,
                usedAttendances: [],
            },
        ],
    })
    earlyLeaveDetails: any[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    updateSummary(params: {
        employeeInfo: { employeeNumber: string; employeeId: string; employeeName: string };
        yyyymm: string;
        totalWorkableTime: number;
        totalWorkTime: number;
        workDaysCount: number;
        avgWorkTimes: number;
        attendanceTypeCount: Record<string, number>;
        weeklyWorkTimeSummary: any[];
        dailyEventSummary: any[];
        lateDetails: any[];
        absenceDetails: any[];
        earlyLeaveDetails: any[];
        note: string;
    }) {
        this.employeeNumber = params.employeeInfo.employeeNumber;
        this.employeeId = params.employeeInfo.employeeId;
        this.employeeName = params.employeeInfo.employeeName;
        this.yyyymm = params.yyyymm;
        this.totalWorkableTime = params.totalWorkableTime;
        this.totalWorkTime = params.totalWorkTime;
        this.workDaysCount = params.workDaysCount;
        this.avgWorkTimes = params.avgWorkTimes;
        this.attendanceTypeCount = params.attendanceTypeCount;
        this.weeklyWorkTimeSummary = params.weeklyWorkTimeSummary;
        this.dailyEventSummary = params.dailyEventSummary;
        this.lateDetails = params.lateDetails;
        this.absenceDetails = params.absenceDetails;
        this.earlyLeaveDetails = params.earlyLeaveDetails;
        this.note = params.note;
    }

    static create(params: {
        employeeInfo: { employeeNumber: string; employeeId: string; employeeName: string };
        yyyymm: string;
        totalWorkableTime: number;
        totalWorkTime: number;
        workDaysCount: number;
        avgWorkTimes: number;
        attendanceTypeCount: Record<string, number>;
        weeklyWorkTimeSummary: any[];
        dailyEventSummary: any[];
        lateDetails: any[];
        absenceDetails: any[];
        earlyLeaveDetails: any[];
        note: string;
    }): MonthlyEmployeeAttendanceInfoEntity {
        const entity = new MonthlyEmployeeAttendanceInfoEntity();
        entity.updateSummary(params);
        return entity;
    }
}
