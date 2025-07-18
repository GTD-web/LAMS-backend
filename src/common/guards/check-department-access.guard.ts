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
            throw new ForbiddenException('?¬μ©???λ³΄λ₯?μ°Ύμ ???μ΅?λ€.');
        }

        if (!departmentId) {
            throw new ForbiddenException('λΆ??IDκ° ?κ³΅?μ? ?μ?΅λ??');
        }

        const department = await this.departmentService.findDepartmentById(departmentId);

        if (!department) {
            throw new ForbiddenException('?΄λΉ λΆ?λ? μ°Ύμ ???μ΅?λ€.');
        }

        if (department.isAccessAuthority(user.sub) || user.roles.includes('SYSTEM_ADMIN')) {
            request.department = department;
            return true;
        }

        throw new ForbiddenException('??λΆ?μ ????κ·Ό κΆν???μ΅?λ€.');
    }
}
