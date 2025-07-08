import { config } from 'dotenv';
import { registerAs } from '@nestjs/config';

config();

export const ENV = process.env;

export default registerAs('database', () => {
    return {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
        username: process.env.POSTGRES_USER || 'admin',
        password: process.env.POSTGRES_PASSWORD || '1234',
        database: process.env.POSTGRES_DB || 'attendance-server',
    };
});

export const JWT_CONFIG = registerAs('jwt', () => {
    return {
        secret: process.env.GLOBAL_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    };
});
