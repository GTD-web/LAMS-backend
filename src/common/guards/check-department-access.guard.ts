import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { DepartmentDomainService } from '@src/domain/organization/department/services/department-domain.service';

@Injectable()
export class CheckDepartmentAccessGuard implements CanActivate {
    constructor(private readonly departmentService: DepartmentDomainService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const departmentId = request.params.departmentId;

        if (!user) {
            throw new ForbiddenException('???? ????.');
        }

        if (!departmentId) {
            throw new ForbiddenException('?? ID? ????.');
        }

        const department = await this.departmentService.findDepartmentById(departmentId);

        if (!department) {
            throw new ForbiddenException('??? ?? ? ????.');
        }

        if (department.isAccessAuthority(user.sub) || user.roles.includes('SYSTEM_ADMIN')) {
            request.department = department;
            return true;
        }

        throw new ForbiddenException('?? ?? ??? ????.');
    }
}
