import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DailyEventSummaryEntity } from '@src/domain/attendance/daily-attendance/entities/daily-event-summary.entity';
import { DepartmentEmployeeEntity } from '../../department/entities/department-employee.entity';
import { DepartmentInfoEntity } from '../../department/entities/department-info.entity';

@Entity()
export class EmployeeInfoEntity {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        description: '직원 아이디',
        example: 'exEmployeeId',
    })
    employeeId?: string;

    @Column({
        nullable: true,
    })
    @ApiProperty({
        description: '직원 이름',
        example: 'exEmployeeName',
    })
    employeeName: string;

    @Column()
    @ApiProperty({
        description: '사번',
        example: 'exEmployeeNumber',
    })
    employeeNumber: string;

    @Column({
        nullable: true,
    })
    @ApiProperty({
        description: '직원 이메일',
        example: 'exEmployeeEmail',
    })
    email: string;

    @Column({
        type: 'date',
        nullable: true,
    })
    @ApiProperty({
        description: '입사일',
        example: '2021-01-01',
    })
    entryAt: string;

    /* TODO: 추후 제거 예정 - 2025-01-07*/
    @ManyToOne(() => DepartmentInfoEntity)
    @JoinColumn({ name: 'departmentId' })
    @ApiProperty({
        description: '부서',
        example: 'exDepartment',
    })
    department: DepartmentInfoEntity;

    @Column({ type: 'date', nullable: true })
    @ApiProperty({
        description: '생일',
        example: '1990-01-01',
        required: false,
    })
    birthDate: string;

    @Column({ nullable: true })
    @ApiProperty({
        description: '퇴사일',
        example: '2023-12-31',
        required: false,
    })
    quitedAt: string;

    @OneToMany(() => DailyEventSummaryEntity, (dailyEventSummary) => dailyEventSummary.employee, {
        cascade: true,
        nullable: true,
    })
    dailyEventSummaries: DailyEventSummaryEntity[];

    @Column({ type: 'boolean', default: false })
    @ApiProperty({
        description: '계산에서 제외할지 여부',
        example: false,
        required: false,
    })
    isExcludedFromCalculation: boolean;

    @OneToMany(() => DepartmentEmployeeEntity, (employee) => employee.employee)
    departments: DepartmentEmployeeEntity[];

    /**
     * 직원이 현재 재직 중인지 확인
     */
    isActive(): boolean {
        if (!this.quitedAt) return true;
        const today = new Date().toISOString().split('T')[0];
        return this.quitedAt > today;
    }

    /**
     * 직원이 특정 날짜에 재직 중이었는지 확인
     */
    isActiveAt(date: string): boolean {
        if (this.entryAt && date < this.entryAt) return false;
        if (this.quitedAt && date >= this.quitedAt) return false;
        return true;
    }

    /**
     * 직원의 근속 연수 계산
     */
    getYearsOfService(baseDate?: string): number {
        if (!this.entryAt) return 0;

        const endDate = baseDate ? new Date(baseDate) : this.quitedAt ? new Date(this.quitedAt) : new Date();
        const startDate = new Date(this.entryAt);

        const diffTime = endDate.getTime() - startDate.getTime();
        const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

        return Math.floor(diffYears);
    }

    /**
     * 직원의 나이 계산
     */
    getAge(): number | null {
        if (!this.birthDate) return null;

        const today = new Date();
        const birthDate = new Date(this.birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();

        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    /**
     * 직원 정보 업데이트
     */
    updateInfo(updates: Partial<EmployeeInfoEntity>): void {
        Object.assign(this, updates);
    }

    /**
     * 제외 상태 토글
     */
    toggleExcludeFromCalculation(): void {
        this.isExcludedFromCalculation = !this.isExcludedFromCalculation;
    }
}
