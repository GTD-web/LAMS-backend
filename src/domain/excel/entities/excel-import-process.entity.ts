import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';

@Entity()
export class ExcelImportProcessEntity {
    @PrimaryGeneratedColumn('uuid')
    excelImportProcessId: string;

    // ?�로?�스 ???�요??부?�정�?json
    @Column({ type: 'json' })
    @ApiProperty({
        description: '?�로?�스 ???�요??부?�정�?json',
        example: '{"extractedDepartments": [], "undefinedDepartments": [], "departments": [], "newDepartments": []}',
    })
    departmentInfoJson: string;

    // ?�로?�스 ???�요??직원?�보 json
    @Column({ type: 'json' })
    @ApiProperty({
        description: '?�로?�스 ???�요??직원?�보 json',
        example:
            '{"tempEnteredEmployeeInfoList": [], "tempExitedEmployeeInfoList": [], "enteredEmployeeInfoList": [], "ExitedEmployeeInfoList": []}',
    })
    employeeInfoJson: string;

    @Column({ type: 'json' })
    @ApiProperty({
        description: '?�로?�스 �??�택???�이??json',
        example: '{"extractedExcelDataList": [], "selectedDataList": []}',
    })
    dataJson: string;

    @Column('simple-json', {
        nullable: true,
    })
    @ApiProperty({
        description: '?�본 ?�이??,
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

    // ?�로?�스 진행 ?�태
    @Column()
    status: string;

    // 진행?�는 ?�로?�스??????
    @Column()
    year: string;

    @Column()
    month: string;

    // 참조?�는 event-info ?�일 ID
    @Column({ nullable: true })
    eventInfoFileId: string;

    // 참조?�는 used-attendance ?�일 ID
    @Column({ nullable: true })
    usedAttendanceFileId: string;

    @CreateDateColumn()
    createdAt: Date;

    // user?� 관계설??
    @ManyToOne(() => LamsUserEntity)
    @JoinColumn({ name: 'userId' })
    user: LamsUserEntity;
}
