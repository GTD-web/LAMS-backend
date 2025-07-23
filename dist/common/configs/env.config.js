"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_CONFIG = void 0;
const dotenv_1 = require("dotenv");
const config_1 = require("@nestjs/config");
(0, dotenv_1.config)();
exports.default = (0, config_1.registerAs)('database', () => {
    return {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
        username: process.env.POSTGRES_USER || 'admin',
        password: process.env.POSTGRES_PASSWORD || '1234',
        database: process.env.POSTGRES_DATABASE || 'attendance-server',
        url: process.env.POSTGRES_URL,
    };
});
exports.JWT_CONFIG = (0, config_1.registerAs)('jwt', () => {
    return {
        secret: process.env.SUPABASE_JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    };
});
//# sourceMappingURL=env.config.js.map