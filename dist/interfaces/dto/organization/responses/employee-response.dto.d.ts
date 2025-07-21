export declare class EmployeeResponseDto {
    readonly employeeId: string;
    readonly employeeName: string;
    readonly employeeNumber: string;
    readonly mmsEmployeeId?: string;
    readonly isExcludedFromCalculation: boolean;
    readonly departmentId: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(partial: Partial<EmployeeResponseDto>);
}
