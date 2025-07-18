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
            throw new ForbiddenException('?¬ìš©???•ë³´ë¥?ì°¾ì„ ???†ìŠµ?ˆë‹¤.');
        }

        if (!departmentId) {
            throw new ForbiddenException('ë¶€??IDê°€ ?œê³µ?˜ì? ?Šì•˜?µë‹ˆ??');
        }

        const department = await this.departmentService.findDepartmentById(departmentId);

        if (!department) {
            throw new ForbiddenException('?´ë‹¹ ë¶€?œë? ì°¾ì„ ???†ìŠµ?ˆë‹¤.');
        }

        if (department.isAccessAuthority(user.sub) || user.roles.includes('SYSTEM_ADMIN')) {
            request.department = department;
            return true;
        }

        throw new ForbiddenException('??ë¶€?œì— ?€???‘ê·¼ ê¶Œí•œ???†ìŠµ?ˆë‹¤.');
    }
}
