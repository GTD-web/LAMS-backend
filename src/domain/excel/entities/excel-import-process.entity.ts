import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';

@Entity()
export class ExcelImportProcessEntity {
    @PrimaryGeneratedColumn('uuid')
    excelImportProcessId: string;

    // ?„ë¡œ?¸ìŠ¤ ???„ìš”??ë¶€?œì •ë³?json
    @Column({ type: 'json' })
    @ApiProperty({
        description: '?„ë¡œ?¸ìŠ¤ ???„ìš”??ë¶€?œì •ë³?json',
        example: '{"extractedDepartments": [], "undefinedDepartments": [], "departments": [], "newDepartments": []}',
    })
    departmentInfoJson: string;

    // ?„ë¡œ?¸ìŠ¤ ???„ìš”??ì§ì›?•ë³´ json
    @Column({ type: 'json' })
    @ApiProperty({
        description: '?„ë¡œ?¸ìŠ¤ ???„ìš”??ì§ì›?•ë³´ json',
        example:
            '{"tempEnteredEmployeeInfoList": [], "tempExitedEmployeeInfoList": [], "enteredEmployeeInfoList": [], "ExitedEmployeeInfoList": []}',
    })
    employeeInfoJson: string;

    @Column({ type: 'json' })
    @ApiProperty({
        description: '?„ë¡œ?¸ìŠ¤ ì¤?? íƒ???°ì´??json',
        example: '{"extractedExcelDataList": [], "selectedDataList": []}',
    })
    dataJson: string;

    @Column('simple-json', {
        nullable: true,
    })
    @ApiProperty({
        description: '?ë³¸ ?°ì´??,
        example: [
            {
                employeeNumber: '1234567890',
                name: 'John Doe',
                department: 'Sales',
                events: [],
                attendanceRecords: [],
            },
        ],
    })
    extractedExcelDataList: any[];

    // ?„ë¡œ?¸ìŠ¤ ì§„í–‰ ?íƒœ
    @Column()
    status: string;

    // ì§„í–‰?˜ëŠ” ?„ë¡œ?¸ìŠ¤??????
    @Column()
    year: string;

    @Column()
    month: string;

    // ì°¸ì¡°?˜ëŠ” event-info ?Œì¼ ID
    @Column({ nullable: true })
    eventInfoFileId: string;

    // ì°¸ì¡°?˜ëŠ” used-attendance ?Œì¼ ID
    @Column({ nullable: true })
    usedAttendanceFileId: string;

    @CreateDateColumn()
    createdAt: Date;

    // user?€ ê´€ê³„ì„¤??
    @ManyToOne(() => LamsUserEntity)
    @JoinColumn({ name: 'userId' })
    user: LamsUserEntity;
}
