import { DailyEventSummaryEntity } from '@src/domain/attendance/daily-attendance/entities/daily-event-summary.entity';
import { DepartmentEmployeeEntity } from '../../department-employee/entities/department-employee.entity';
import { DepartmentInfoEntity } from '../../department/entities/department-info.entity';
export declare class EmployeeInfoEntity {
    employeeId?: string;
    employeeName: string;
    employeeNumber: string;
    email: string;
    entryAt: string;
    department: DepartmentInfoEntity;
    birthDate: string;
    quitedAt: string;
    dailyEventSummaries: DailyEventSummaryEntity[];
    isExcludedFromCalculation: boolean;
    departments: DepartmentEmployeeEntity[];
    isActive(): boolean;
    isActiveAt(date: string): boolean;
    getYearsOfService(baseDate?: string): number;
    getAge(): number | null;
    updateInfo(updates: Partial<EmployeeInfoEntity>): void;
    toggleExcludeFromCalculation(): void;
}
