import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../domain/user/enum/user.enum';

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
            throw new ForbiddenException('접근 권한이 없습니다. 로그인이 필요합니다.');
        }

        const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
        if (!hasRole) {
            throw new ForbiddenException('해당 작업을 수행할 권한이 없습니다.');
        }

        return true;
    }
}
