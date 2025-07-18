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
            throw new ForbiddenException('?�용???�보�?찾을 ???�습?�다.');
        }

        if (!departmentId) {
            throw new ForbiddenException('부??ID가 ?�공?��? ?�았?�니??');
        }

        const department = await this.departmentService.findDepartmentById(departmentId);

        if (!department) {
            throw new ForbiddenException('?�당 부?��? 찾을 ???�습?�다.');
        }

        if (department.isAccessAuthority(user.sub) || user.roles.includes('SYSTEM_ADMIN')) {
            request.department = department;
            return true;
        }

        throw new ForbiddenException('??부?�에 ?�???�근 권한???�습?�다.');
    }
}
