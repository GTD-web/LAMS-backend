import { Repository } from 'typeorm';
import { DepartmentInfoEntity } from '../entities/department-info.entity';
import { MMSDepartmentResponseDto } from '@src/interfaces/dto/organization/requests/mms-department-import.dto';
export declare class DepartmentDomainService {
    private readonly departmentRepository;
    private readonly logger;
    constructor(departmentRepository: Repository<DepartmentInfoEntity>);
    findDepartmentById(departmentId: string): Promise<DepartmentInfoEntity | null>;
    findDepartmentByCode(departmentCode: string): Promise<DepartmentInfoEntity | null>;
    findAllDepartments(isExclude?: boolean): Promise<DepartmentInfoEntity[]>;
    findPaginatedDepartments(page: number, limit: number, isExclude?: boolean): Promise<{
        departments: DepartmentInfoEntity[];
        total: number;
    }>;
    createDepartment(departmentData: Partial<DepartmentInfoEntity>): Promise<DepartmentInfoEntity>;
    updateDepartment(departmentId: string, updateData: Partial<DepartmentInfoEntity>): Promise<DepartmentInfoEntity>;
    toggleDepartmentExclusion(departmentId: string): Promise<DepartmentInfoEntity>;
    findDepartmentByMMSDepartmentId(mmsDepartmentId: string): Promise<DepartmentInfoEntity | null>;
    createOrUpdateDepartment(departmentData: MMSDepartmentResponseDto): Promise<DepartmentInfoEntity>;
    removeDepartment(departmentId: string): Promise<void>;
    addReviewAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity>;
    removeReviewAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity>;
    addAccessAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity>;
    removeAccessAuthority(departmentId: string, userId: string): Promise<DepartmentInfoEntity>;
    findDepartmentsByReviewAuthority(userId: string): Promise<DepartmentInfoEntity[]>;
    findDepartmentsByAccessAuthority(userId: string): Promise<DepartmentInfoEntity[]>;
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
    searchDepartmentsByName(departmentName: string): Promise<DepartmentInfoEntity[]>;
    searchDepartmentsByCode(departmentCode: string): Promise<DepartmentInfoEntity[]>;
    findActiveDepartments(): Promise<DepartmentInfoEntity[]>;
    findExcludedDepartments(): Promise<DepartmentInfoEntity[]>;
}
