import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
    secret: configService.get('jwt.secret'),
    signOptions: {
        expiresIn: configService.get('jwt.expiresIn'),
    },
});
