import { DepartmentDomainService } from '../../domain/organization/department/services/department-domain.service';
import { EmployeeDomainService } from '../../domain/organization/employee/services/employee-domain.service';
import { DepartmentEmployeeDomainService } from '../../domain/organization/department-employee/department-employee-domain.service';
import { DepartmentInfoEntity } from '../../domain/organization/department/entities/department-info.entity';
import { EmployeeInfoEntity } from '../../domain/organization/employee/entities/employee-info.entity';
export declare class OrganizationContextService {
    private readonly departmentDomainService;
    private readonly employeeDomainService;
    private readonly departmentEmployeeDomainService;
    private readonly logger;
    private readonly MMS_BASE_URL;
    constructor(departmentDomainService: DepartmentDomainService, employeeDomainService: EmployeeDomainService, departmentEmployeeDomainService: DepartmentEmployeeDomainService);
    private getDepartmentsFromMMS;
    private getEmployeesFromMMS;
    부서를_업데이트하고_없는부서는_삭제한다(): Promise<void>;
    직원을_업데이트한다(): Promise<void>;
    직원_부서_중간테이블_데이터를_삭제_갱신한다(): Promise<void>;
    페이지네이션된_부서_목록을_조회한다(limit: number, page: number): Promise<{
        data: any[];
        meta: any;
    }>;
    부서의_제외_여부를_변경한다(departmentId: string): Promise<DepartmentInfoEntity>;
    부서에_해당하는_직원_페이지네이션된_목록을_조회한다(departmentId: string, limit: number, page: number): Promise<{
        data: any[];
        meta: any;
    }>;
    직원들의_연차_정보를_갱신해서_보여준다(): Promise<void>;
    직원의_제외_여부_변경한다(employeeId: string): Promise<EmployeeInfoEntity>;
    퇴사데이터가_있는_직원을_제외한_부서의_직원을_조회한다(departmentId: string): Promise<EmployeeInfoEntity[]>;
    findDepartmentById(departmentId: string): Promise<DepartmentInfoEntity>;
}
