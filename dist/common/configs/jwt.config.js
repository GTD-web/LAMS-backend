"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const jwtConfig = (configService) => ({
    secret: configService.get('GLOBAL_SECRET'),
    signOptions: {
        expiresIn: configService.get('JWT_EXPIRES_IN'),
    },
});
exports.jwtConfig = jwtConfig;
//# sourceMappingURL=jwt.config.js.map