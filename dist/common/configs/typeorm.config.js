"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const path_1 = require("path");
const typeOrmConfig = (configService) => {
    return {
        type: 'postgres',
        url: configService.get('database.url'),
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [(0, path_1.join)(__dirname, '../../domain/**/*.entity.{js,ts}'), (0, path_1.join)(__dirname, '../../**/*.entity.{js,ts}')],
        schema: 'public',
        synchronize: true,
        ...(configService.get('NODE_ENV') === 'production' && {
            ssl: {
                rejectUnauthorized: false,
            },
            extra: {
                ssl: {
                    rejectUnauthorized: false,
                },
            },
        }),
        logging: configService.get('NODE_ENV') === 'local',
    };
};
exports.typeOrmConfig = typeOrmConfig;
//# sourceMappingURL=typeorm.config.js.map