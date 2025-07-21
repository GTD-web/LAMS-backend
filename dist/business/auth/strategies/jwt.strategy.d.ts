import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserContextService } from '@src/contexts/user/user-context.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userService;
    constructor(userService: UserContextService, configService: ConfigService);
    validate(payload: any): Promise<import("../../../domain/user/entities/user.entity").UserEntity>;
}
export {};
