import { Injectable } from '@nestjs/common';
import { OrganizationContextService } from '../../../contexts/organization/organization-context.service';
import { LamsUserEntity } from '../../../domain/user/entities/lams-user.entity';
import { DepartmentInfoEntity } from '../../../domain/organization/department/entities/department-info.entity';
import { EmployeeInfoEntity } from '../../../domain/organization/employee/entities/employee-info.entity';
import { PaginationQueryDto } from '../../../common/dtos/pagination/pagination-query.dto';
import { UserResponseDto } from '@src/interfaces/dto/organization/responses/user-response.dto';
import { PaginatedResponseDto, PaginationMetaDto } from '@src/common/dtos/pagination/pagination-response.dto';
import { DepartmentResponseDto } from '@src/interfaces/dto/organization/responses/department-response.dto';
import { EmployeeResponseDto } from '@src/interfaces/dto/organization/responses/employee-response.dto';
import { UserDomainService } from '@src/domain/user/services/user-domain.service';
import { DepartmentDomainService } from '@src/domain/organization/department/services/department-domain.service';
import { EmployeeDomainService } from '@src/domain/organization/employee/services/employee-domain.service';
import { OrganizationDomainService } from '@src/domain/organization/organization-domain.service';
import { plainToInstance } from 'class-transformer';

/**
 * 조직 조회 서비스
 * - 사용자, 부서, 직원의 조회 업무를 담당
 * - Business Layer에서 pagination 처리
 */
@Injectable()
export class OrganizationQueryService {
    constructor(
        private readonly organizationContextService: OrganizationContextService,
        private readonly userDomainService: UserDomainService,
        private readonly departmentDomainService: DepartmentDomainService,
        private readonly employeeDomainService: EmployeeDomainService,
        private readonly organizationDomainService: OrganizationDomainService,
    ) {}

    // ==================== USER 관련 메서드 ====================

    /**
     * 사용자 ID로 조회
     */
    async getUserById(userId: string): Promise<UserResponseDto | null> {
        return plainToInstance(UserResponseDto, await this.userDomainService.findUserById(userId));
    }

    /**
     * 사용자 이메일로 조회
     */
    async getUserByEmail(email: string): Promise<UserResponseDto | null> {
        return plainToInstance(UserResponseDto, await this.userDomainService.findUserByEmail(email));
    }

    /**
     * 사용자 목록 조회 (pagination)
     */
    async getUsers(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
        const page = Number(paginationQuery.page) || 1;
        const limit = Number(paginationQuery.limit) || 10;

        // Domain Service에서 전체 데이터 조회
        const allUsers = await this.userDomainService.findAllUsers();

        // Business Layer에서 pagination 처리
        const total = allUsers.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = allUsers.slice(startIndex, endIndex);

        // Response DTO 변환
        const data = paginatedUsers.map((user) => plainToInstance(UserResponseDto, user));
        const meta = new PaginationMetaDto(page, limit, total);

        return { data, meta };
    }

    // ==================== DEPARTMENT 관련 메서드 ====================

    /**
     * 부서 ID로 조회
     */
    async getDepartmentById(departmentId: string): Promise<DepartmentInfoEntity | null> {
        return await this.departmentDomainService.findDepartmentById(departmentId);
    }

    /**
     * 부서 목록 조회 (pagination)
     */
    async getDepartments(
        paginationQuery: PaginationQueryDto,
        isExclude?: boolean,
    ): Promise<PaginatedResponseDto<DepartmentResponseDto>> {
        const page = Number(paginationQuery.page) || 1;
        const limit = Number(paginationQuery.limit) || 10;

        // Domain Service에서 전체 데이터 조회
        const allDepartments = await this.departmentDomainService.findAllDepartments(isExclude);

        // Business Layer에서 pagination 처리
        const total = allDepartments.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedDepartments = allDepartments.slice(startIndex, endIndex);

        // Response DTO 변환
        const data = paginatedDepartments.map((department) => plainToInstance(DepartmentResponseDto, department));
        const meta = new PaginationMetaDto(page, limit, total);

        return { data, meta };
    }

    /**
     * 부서 계층 구조 조회
     */
    async getDepartmentHierarchy(departmentId?: string): Promise<DepartmentInfoEntity[]> {
        return await this.departmentDomainService.findHierarchy(departmentId);
    }

    /**
     * 부서별 직원 조회
     */
    async getEmployeesByDepartment(departmentId: string): Promise<EmployeeInfoEntity[]> {
        return await this.employeeDomainService.findEmployeesByDepartmentWithQuitFilter(departmentId);
    }

    // ==================== EMPLOYEE 관련 메서드 ====================

    /**
     * 직원 ID로 조회
     */
    async getEmployeeById(employeeId: string): Promise<EmployeeInfoEntity | null> {
        return await this.employeeDomainService.findEmployeeById(employeeId);
    }

    /**
     * 직원 목록 조회 (pagination)
     */
    async getEmployees(
        paginationQuery: PaginationQueryDto,
        isExcludedFromCalculation?: boolean,
    ): Promise<PaginatedResponseDto<EmployeeResponseDto>> {
        const page = Number(paginationQuery.page) || 1;
        const limit = Number(paginationQuery.limit) || 10;

        // Domain Service에서 전체 데이터 조회
        const allEmployees = await this.employeeDomainService.findAllEmployees(isExcludedFromCalculation);

        // Business Layer에서 pagination 처리
        const total = allEmployees.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedEmployees = allEmployees.slice(startIndex, endIndex);

        // Response DTO 변환
        const data = paginatedEmployees.map((employee) => plainToInstance(EmployeeResponseDto, employee));
        const meta = new PaginationMetaDto(page, limit, total);

        return { data, meta };
    }

    /**
     * 활성 직원 조회
     */
    async getActiveEmployees(): Promise<EmployeeInfoEntity[]> {
        return await this.employeeDomainService.findActiveEmployees();
    }

    /**
     * 퇴사 직원 조회
     */
    async getInactiveEmployees(): Promise<EmployeeInfoEntity[]> {
        return await this.employeeDomainService.findInactiveEmployees();
    }

    // ==================== ORGANIZATION 관련 메서드 ====================

    /**
     * 조직도 전체 조회
     */
    async getOrganizationChart(): Promise<any> {
        return await this.organizationDomainService.getOrganizationTree();
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
