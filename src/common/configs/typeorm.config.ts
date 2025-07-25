import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
    return {
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [join(__dirname, '../../domain/**/*.entity.{js,ts}'), join(__dirname, '../../**/*.entity.{js,ts}')],
        schema: configService.get('database.schema'),
        synchronize: configService.get('NODE_ENV') !== 'production',
        // 환경별 SSL 설정
        ssl:
            configService.get('NODE_ENV') === 'production'
                ? {
                      rejectUnauthorized: false,
                  }
                : false,

        logging: configService.get('NODE_ENV') === 'local',
    };
};
