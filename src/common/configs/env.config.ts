import { config } from 'dotenv';
import { registerAs } from '@nestjs/config';

config();

export default registerAs('database', () => {
    return {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
        username: process.env.POSTGRES_USER || 'admin',
        password: process.env.POSTGRES_PASSWORD || '1234',
        database: process.env.POSTGRES_DB || 'attendance-server',
        schema: process.env.POSTGRES_SCHEMA || 'public',
    };
});

export const JWT_CONFIG = registerAs('jwt', () => {
    return {
        secret: process.env.GLOBAL_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    };
});

export const SUPABASE_CONFIG = registerAs('supabase', () => {
    return {
        url: process.env.SUPABASE_URL,
        anonKey: process.env.SUPABASE_ANON_KEY,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        bucketName: process.env.S3_BUCKET_NAME || 'lams-bucket',
        endpoint: process.env.S3_ENDPOINT,
    };
});
