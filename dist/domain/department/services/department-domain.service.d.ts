import { Repository } from 'typeorm';
import { DepartmentInfoEntity } from '../entities/department-info.entity';
import { MMSDepartmentResponseDto } from '@src/interfaces/dto/organization/requests/mms-department-import.dto';
import { PaginatedResponseDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { DepartmentResponseDto } from '@src/interfaces/dto/organization/responses/department-response.dto';
export declare class DepartmentDomainService {
    private readonly departmentRepository;
    private readonly logger;
    constructor(departmentRepository: Repository<DepartmentInfoEntity>);
    findDepartmentById(departmentId: string): Promise<DepartmentInfoEntity | null>;
    getDepartmentById(departmentCode: string): Promise<DepartmentInfoEntity | null>;
    findAllDepartments(isExclude?: boolean): Promise<DepartmentInfoEntity[]>;
    findPaginatedDepartments(page: number, limit: number, isExclude?: boolean): Promise<PaginatedResponseDto<DepartmentResponseDto>>;
    toggleDepartmentExclusion(departmentId: string): Promise<DepartmentInfoEntity>;
    findDepartmentByMMSDepartmentId(mmsDepartmentId: string): Promise<DepartmentInfoEntity | null>;
    createOrUpdateDepartment(departmentData: MMSDepartmentResponseDto, parentDepartment?: DepartmentInfoEntity): Promise<DepartmentInfoEntity>;
    removeDepartment(departmentId: string): Promise<void>;
    searchDepartments(searchCriteria: {
        departmentName?: string;
        departmentCode?: string;
        isExclude?: boolean;
        keyword?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        departments: DepartmentInfoEntity[];
        total: number;
    }>;
}
