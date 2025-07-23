import { config } from 'dotenv';
import { registerAs } from '@nestjs/config';

config();

export default registerAs('database', () => {
    return {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
        username: process.env.POSTGRES_USER || 'admin',
        password: process.env.POSTGRES_PASSWORD || '1234',
        database: process.env.POSTGRES_DATABASE || 'attendance-server',
        url: process.env.POSTGRES_URL,
    };
});

export const JWT_CONFIG = registerAs('jwt', () => {
    return {
        secret: process.env.SUPABASE_JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    };
});
