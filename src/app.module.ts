import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './common/configs/typeorm.config';
import { JwtModule } from '@nestjs/jwt';
import databaseConfig, { JWT_CONFIG } from './common/configs/env.config';
import { AuthModule } from './business/auth/auth.module';
import { jwtConfig } from './common/configs/jwt.config';
import { SeedModule } from './common/seeds/seed.module';
import { UserModule } from './business/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig, JWT_CONFIG],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: typeOrmConfig,
        }),
        JwtModule.registerAsync({
            global: true,
            useFactory: jwtConfig,
            inject: [ConfigService],
        }),
        UserModule,
        AuthModule,
        SeedModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
