import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '@src/domain/user/entities/user.entity';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserEntity;

    if (data) {
        return user && user[data];
    }

    return user;
});
