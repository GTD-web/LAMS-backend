export declare class OrganizationEmployeeDto {
    employeeId: string;
    employeeName?: string;
}
export declare class SaveOrganizationDto {
    id?: string;
    name: string;
    isSupport: boolean;
    parentId?: string;
    employees?: OrganizationEmployeeDto[];
    children?: SaveOrganizationDto[];
}
export declare class OrganizationTreeResponseDto {
    id: string;
    name: string;
    isSupport: boolean;
    parentId?: string;
    employees: OrganizationEmployeeDto[];
    children: OrganizationTreeResponseDto[];
    constructor(id: string, name: string, isSupport: boolean, parentId: string | undefined, employees: OrganizationEmployeeDto[], children: OrganizationTreeResponseDto[]);
}
