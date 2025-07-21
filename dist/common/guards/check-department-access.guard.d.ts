import { CanActivate, ExecutionContext } from '@nestjs/common';
import { DepartmentDomainService } from '@src/domain/organization/department/services/department-domain.service';
export declare class CheckDepartmentAccessGuard implements CanActivate {
    private readonly departmentService;
    constructor(departmentService: DepartmentDomainService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
