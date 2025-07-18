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
            throw new ForbiddenException('?‘ê·¼ ê¶Œí•œ???†ìŠµ?ˆë‹¤. ë¡œê·¸?¸ì´ ?„ìš”?©ë‹ˆ??');
        }

        const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
        if (!hasRole) {
            throw new ForbiddenException('?´ë‹¹ ?‘ì—…???˜í–‰??ê¶Œí•œ???†ìŠµ?ˆë‹¤.');
        }

        return true;
    }
}
