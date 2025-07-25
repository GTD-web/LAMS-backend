import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './common/configs/typeorm.config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './common/configs/jwt.config';
import { SeedModule } from './common/seeds/seed.module';
import { OrganizationInterfaceModule } from './interfaces/controllers/organization/organization-interface.module';
import databaseConfig, { JWT_CONFIG, SUPABASE_CONFIG } from './common/configs/env.config';
import { WorkStandardInterfaceModule } from './interfaces/controllers/work-standard/work-standard-interface.module';
import { UsersInterfaceModule } from './interfaces/controllers/users/users-interface.module';
import { AuthInterfaceModule } from './interfaces/controllers/auth/auth-interface.module';
import { FileInterfaceModule } from './interfaces/controllers/file/file-interface.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig, JWT_CONFIG, SUPABASE_CONFIG],
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
        SeedModule,
        AuthInterfaceModule,
        UsersInterfaceModule,
        OrganizationInterfaceModule,
        WorkStandardInterfaceModule,
        FileInterfaceModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
