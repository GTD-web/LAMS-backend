import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './common/configs/typeorm.config';
import { JwtModule } from '@nestjs/jwt';
import databaseConfig, { JWT_CONFIG } from './common/configs/env.config';
import { AuthBusinessModule } from './business/auth/auth-business.module';
import { UserBusinessModule } from './business/user/user-business.module';
import { AuthContextModule } from './contexts/auth/auth-user-context.module';
import { UserContextModule } from './contexts/user/user-context.module';
import { UsersModule } from './interfaces/controllers/users.module';
import { jwtConfig } from './common/configs/jwt.config';
import { SeedModule } from './common/seeds/seed.module';
import { OrganizationBusinessModule } from './business/organization/organization-business.module';

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
        // 비즈니스 계층 모듈들
        AuthBusinessModule,
        UserBusinessModule,
        OrganizationBusinessModule,

        // 컨텍스트 계층 모듈들
        AuthContextModule,
        UserContextModule,

        // 컨트롤러 모듈들
        UsersModule,

        // 기타 모듈들
        SeedModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
