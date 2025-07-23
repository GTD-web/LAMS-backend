import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserContextService } from '../../../contexts/user/user-context.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserContextService, configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwt.secret'),
        });
    }

    async validate(payload: any) {
        const user = await this.userService.findUserById(payload.sub);

        if (!user || user.userId !== payload.sub) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
