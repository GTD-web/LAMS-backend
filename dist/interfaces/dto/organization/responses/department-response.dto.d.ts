export declare class DepartmentResponseDto {
    readonly departmentId: string;
    readonly departmentName: string;
    readonly departmentCode: string;
    readonly mmsDepartmentId?: string;
    readonly isExclude: boolean;
    readonly parentDepartmentId?: string;
    readonly orgChartInfoId?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(partial: Partial<DepartmentResponseDto>);
}
