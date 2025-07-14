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
            throw new ForbiddenException('사용자 정보를 찾을 수 없습니다.');
        }

        if (!departmentId) {
            throw new ForbiddenException('부서 ID가 제공되지 않았습니다.');
        }

        const department = await this.departmentService.findDepartmentById(departmentId);

        if (!department) {
            throw new ForbiddenException('해당 부서를 찾을 수 없습니다.');
        }

        if (department.isAccessAuthority(user.sub) || user.roles.includes('SYSTEM_ADMIN')) {
            request.department = department;
            return true;
        }

        throw new ForbiddenException('이 부서에 대한 접근 권한이 없습니다.');
    }
}
