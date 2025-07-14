import { Injectable } from '@nestjs/common';
import { OrganizationContextService } from '../../../contexts/organization/organization-context.service';
import { DepartmentInfoEntity } from '../../../domain/organization/department/entities/department-info.entity';
import { EmployeeInfoEntity } from '../../../domain/organization/employee/entities/employee-info.entity';

/**
 * 조직 관리 서비스
 * - 사용자 관리 및 부서/직원 isExclude 토글 기능을 담당
 * - 부서/직원 생성/삭제는 MMS 동기화를 통해서만 가능
 */
@Injectable()
export class OrganizationManagementService {
    constructor(private readonly organizationContextService: OrganizationContextService) {}

    // ==================== DEPARTMENT 관련 메서드 ====================

    /**
     * 부서 제외 상태 토글
     */
    async toggleDepartmentExclude(departmentId: string): Promise<DepartmentInfoEntity> {
        const department = await this.organizationContextService.findDepartmentById(departmentId);
        if (!department) {
            throw new Error('부서를 찾을 수 없습니다.');
        }

        department.toggleExclude();
        return await this.organizationContextService.toggleDepartmentExclude(departmentId);
    }

    // ==================== EMPLOYEE 관련 메서드 ====================

    /**
     * 직원 제외 상태 토글
     */
    async toggleEmployeeExclude(employeeId: string): Promise<EmployeeInfoEntity> {
        return await this.organizationContextService.toggleEmployeeExclude(employeeId);
    }

    /**
     * 직원 부서 배치
     */
    async assignEmployeeToDepartment(employeeId: string, departmentId: string): Promise<void> {
        await this.organizationContextService.assignEmployeeToDepartment(employeeId, departmentId);
    }
}
