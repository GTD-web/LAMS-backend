import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@src/domain/user/enum/user.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new ForbiddenException('?�근 권한???�습?�다. 로그?�이 ?�요?�니??');
        }

        const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
        if (!hasRole) {
            throw new ForbiddenException('?�당 ?�업???�행??권한???�습?�다.');
        }

        return true;
    }
}
