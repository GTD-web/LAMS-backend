import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as LamsUserEntity;

    if (data) {
        return user && user[data];
    }

    return user;
});
