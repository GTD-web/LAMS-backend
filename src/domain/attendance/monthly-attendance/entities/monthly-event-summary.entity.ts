import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class MonthlyEmployeeAttendanceInfoEntity {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        description: '?�별 ?�벤???�약 ?�이??,
        example: 'exMonthlyEventSummaryId',
    })
    monthlyEventSummaryId: string;

    @Column()
    @ApiProperty({
        description: '?�원 번호',
        example: '23027',
    })
    employeeNumber: string;

    @Column()
    @ApiProperty({
        description: '?�원 고유 ?�이??,
        example: 'exEmployeeId',
    })
    employeeId: string;

    @Column({
        nullable: true,
    })
    @ApiProperty({
        description: '?�원 ?�름',
        example: '?�길??,
    })
    employeeName: string;

    @Column()
    @ApiProperty({
        description: '?�당 ?�의 �???,
        example: '2023-07',
    })
    yyyymm: string;

    @Column({ nullable: true })
    @ApiProperty({
        description: '비고',
        example: '?��? 1???�용',
    })
    note?: string;

    @Column({ default: '' })
    @ApiProperty({
        description: '?�간 근태 ?�약 ?�트',
        example: '?��? 1???�용',
    })
    additionalNote?: string;

    @Column()
    @ApiProperty({
        description: '근무 ?�수',
        example: 22,
    })
    workDaysCount: number;

    @Column('int', {
        nullable: true,
    })
    @ApiProperty({
        description: '�??�무 가???�간 (�??�위)',
        example: 12801,
    })
    totalWorkableTime: number;

    @Column('int')
    @ApiProperty({
        description: '�?근무 ?�간 (�??�위)',
        example: 12801,
    })
    totalWorkTime: number;

    @Column('float')
    @ApiProperty({
        description: '?�균 근무 ?�간 (�??�위)',
        example: 581.86,
    })
    avgWorkTimes: number;

    @Column('simple-json')
    @ApiProperty({
        description: '근태 ?�형�??�수',
        example: {
            ?�차: 1,
            ?�전반차: 0,
            ?�후반차: 0,
            // ... 기�? 근태 ?�형
        },
    })
    attendanceTypeCount: Record<string, number>;

    @Column('simple-json', {
        nullable: true,
    })
    @ApiProperty({
        description: '?�별 ?�벤???�약',
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
        description: '주별 ?�벤???�약',
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
        description: '지�??�세?�보',
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
        description: '결근 ?�세?�보',
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
        description: '조퇴 ?�세?�보',
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
