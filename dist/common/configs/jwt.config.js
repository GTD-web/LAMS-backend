"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const jwtConfig = (configService) => ({
    secret: configService.get('jwt.secret'),
    signOptions: {
        expiresIn: configService.get('jwt.expiresIn'),
    },
});
exports.jwtConfig = jwtConfig;
//# sourceMappingURL=jwt.config.js.map