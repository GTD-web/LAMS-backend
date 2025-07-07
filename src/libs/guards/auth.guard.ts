import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        // NATS 메시지인 경우 인증을 건너뜁니다.
        const contextType = context.getType();
        if (contextType === 'rpc') {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const userInfo = request.headers['x-user-info'];

        if (userInfo) {
            try {
                request.user = JSON.parse(userInfo);
                return true;
            } catch (error) {
                console.error('Error parsing user info:', error);
            }
        } else {
            console.log('X-User-Info header is missing');
        }

        throw new UnauthorizedException('User not authenticated');
    }
}
