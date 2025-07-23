import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { settingSwagger } from '../src/common/utils/swagger/swagger.util';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import { ErrorLoggingInterceptor } from '../src/common/interceptors/error-logging.interceptor';

let cachedApp: NestExpressApplication;

async function createNestApp(): Promise<NestExpressApplication> {
    if (cachedApp) {
        return cachedApp;
    }

    const expressApp = express();
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(expressApp), {
        logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug'],
    });

    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    app.setGlobalPrefix('api');
    app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)), new RolesGuard(app.get(Reflector)));

    // 전역 인터셉터 등록
    app.useGlobalInterceptors(new ErrorLoggingInterceptor(), new ResponseInterceptor(), new LoggingInterceptor());

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // 파일 업로드 설정
    const uploadPath = join(process.cwd(), 'public');
    app.useStaticAssets(uploadPath, {
        prefix: '/public',
        index: false,
        fallthrough: false,
    });

    // Swagger 설정
    settingSwagger(app);

    await app.init();
    cachedApp = app;
    return app;
}

export default async (req: any, res: any) => {
    const app = await createNestApp();
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp(req, res);
};
