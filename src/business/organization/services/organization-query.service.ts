import { Injectable } from '@nestjs/common';
import { OrganizationContextService } from '../../../contexts/organization/organization-context.service';
import { LamsUserEntity } from '../../../domain/user/entities/lams-user.entity';
import { DepartmentInfoEntity } from '../../../domain/organization/department/entities/department-info.entity';
import { EmployeeInfoEntity } from '../../../domain/organization/employee/entities/employee-info.entity';
import { PaginationQueryDto } from '../../../common/dtos/pagination/pagination-query.dto';

/**
 * 조직 조회 서비스
 * - 사용자, 부서, 직원의 조회 업무를 담당
 */
@Injectable()
export class OrganizationQueryService {
    constructor(private readonly organizationContextService: OrganizationContextService) {}

    /**
     * 사용자 단일 조회
     */
    async getUserById(userId: string): Promise<LamsUserEntity | null> {
        return await this.organizationContextService.findUserById(userId);
    }

    /**
     * 사용자 이메일로 조회
     */
    async getUserByEmail(email: string): Promise<LamsUserEntity | null> {
        return await this.organizationContextService.findUserByEmail(email);
    }

    /**
     * 사용자 목록 조회
     */
    async getUsers(paginationQuery: PaginationQueryDto): Promise<{ users: LamsUserEntity[]; total: number }> {
        return await this.organizationContextService.findAllUsers(paginationQuery);
    }

    /**
     * 부서 단일 조회
     */
    async getDepartmentById(departmentId: string): Promise<DepartmentInfoEntity | null> {
        return await this.organizationContextService.findDepartmentById(departmentId);
    }

    /**
     * 부서 목록 조회
     */
    async getDepartments(
        paginationQuery: PaginationQueryDto,
        isExclude?: boolean,
    ): Promise<{ departments: DepartmentInfoEntity[]; total: number }> {
        return await this.organizationContextService.findAllDepartments(paginationQuery, isExclude);
    }

    /**
     * 부서 검색
     */
    async searchDepartments(searchTerm: string, userId?: string): Promise<DepartmentInfoEntity[]> {
        return await this.organizationContextService.searchDepartments(searchTerm, userId);
    }

    /**
     * 부서 계층 조회
     */
    async getDepartmentHierarchy(departmentId?: string): Promise<DepartmentInfoEntity[]> {
        return await this.organizationContextService.findDepartmentHierarchy(departmentId);
    }

    /**
     * 직원 단일 조회
     */
    async getEmployeeById(employeeId: string): Promise<EmployeeInfoEntity | null> {
        return await this.organizationContextService.findEmployeeById(employeeId);
    }

    /**
     * 직원 사번으로 조회
     */
    async getEmployeeByEmployeeNumber(employeeNumber: string): Promise<EmployeeInfoEntity | null> {
        return await this.organizationContextService.findEmployeeByEmployeeNumber(employeeNumber);
    }

    /**
     * 직원 목록 조회
     */
    async getEmployees(
        paginationQuery: PaginationQueryDto,
        isExcludedFromCalculation?: boolean,
    ): Promise<{ employees: EmployeeInfoEntity[]; total: number }> {
        return await this.organizationContextService.findAllEmployees(paginationQuery, isExcludedFromCalculation);
    }

    /**
     * 부서별 직원 조회
     */
    async getEmployeesByDepartment(departmentId: string): Promise<EmployeeInfoEntity[]> {
        return await this.organizationContextService.findEmployeesByDepartment(departmentId);
    }

    /**
     * 복합 조회: 부서와 소속 직원들 조회
     */
    async getDepartmentWithEmployees(
        departmentId: string,
    ): Promise<{ department: DepartmentInfoEntity | null; employees: EmployeeInfoEntity[] }> {
        const department = await this.getDepartmentById(departmentId);
        const employees = await this.getEmployeesByDepartment(departmentId);

        return { department, employees };
    }

    /**
     * 복합 조회: 직원과 소속 부서 조회
     */
    async getEmployeeWithDepartment(
        employeeId: string,
    ): Promise<{ employee: EmployeeInfoEntity | null; department: DepartmentInfoEntity | null }> {
        const employee = await this.getEmployeeById(employeeId);
        const department = employee?.department || null;

        return { employee, department };
    }
}
