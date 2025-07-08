import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './common/configs/typeorm.config';
import { JwtModule } from '@nestjs/jwt';
import databaseConfig, { JWT_CONFIG } from './common/configs/env.config';
import { jwtConfig } from './common/configs/jwt.config';
import { UserDomainModule } from './domain/user/user.module';
import { AuthController } from './interfaces/http/controllers/auth.controller';
import { AuthBusinessModule } from './business/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig, JWT_CONFIG],
        }),
        JwtModule.registerAsync({
            global: true,
            useFactory: jwtConfig,
            inject: [ConfigService],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: typeOrmConfig,
        }),
        UserDomainModule,
        AuthBusinessModule,
    ],
    controllers: [AppController, AuthController],
    providers: [AppService],
})
export class AppModule {}
