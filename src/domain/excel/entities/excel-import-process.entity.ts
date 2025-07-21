import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@src/domain/user/entities/user.entity';

@Entity()
export class ExcelImportProcessEntity {
    @PrimaryGeneratedColumn('uuid')
    excelImportProcessId: string;

    // 프로세스 필요 부서 정보 json
    @Column({ type: 'json' })
    @ApiProperty({
        description: '프로세스 필요 부서 정보 json',
        example: '{"extractedDepartments": [], "undefinedDepartments": [], "departments": [], "newDepartments": []}',
    })
    departmentInfoJson: string;

    // 프로세스 필요 직원 정보 json
    @Column({ type: 'json' })
    @ApiProperty({
        description: '프로세스 필요 직원 정보 json',
        example:
            '{"tempEnteredEmployeeInfoList": [], "tempExitedEmployeeInfoList": [], "enteredEmployeeInfoList": [], "ExitedEmployeeInfoList": []}',
    })
    employeeInfoJson: string;

    @Column({ type: 'json' })
    @ApiProperty({
        description: '프로세스 선택 데이터 json',
        example: '{"extractedExcelDataList": [], "selectedDataList": []}',
    })
    dataJson: string;

    @Column('simple-json', {
        nullable: true,
    })
    @ApiProperty({
        description: '추출된 엑셀 데이터 목록',
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

    // 프로세스 진행 상태
    @Column()
    status: string;

    // 진행된 프로세스는 연도
    @Column()
    year: string;

    @Column()
    month: string;

    // 참조는 event-info 파일 ID
    @Column({ nullable: true })
    eventInfoFileId: string;

    // 참조는 used-attendance 파일 ID
    @Column({ nullable: true })
    usedAttendanceFileId: string;

    @CreateDateColumn()
    createdAt: Date;

    // user 관계설정
    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;
}
