import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { settingSwagger } from './common/utils/swagger/swagger.util';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ErrorLoggingInterceptor } from './common/interceptors/error-logging.interceptor';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
    // Express 앱을 먼저 생성
    const server = express();

    // NestJS를 Express 어댑터로 생성
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)), new RolesGuard(app.get(Reflector)));
    // 전역 인터셉터 등록 (ErrorLoggingInterceptor 추가)
    app.useGlobalInterceptors(new ErrorLoggingInterceptor(), new ResponseInterceptor(), new LoggingInterceptor());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    // 파일 업로드 설정
    // const uploadPath = join(process.cwd(), 'public');
    // app.useStaticAssets(uploadPath, {
    //     prefix: '/public',
    //     index: false,
    //     fallthrough: false,
    // });

    settingSwagger(app);
    // Vercel에서는 동적 포트 할당
    await app.init();

    return server;
}

// Vercel용 export
export default async (req: any, res: any) => {
    const server = await bootstrap();
    return server(req, res);
};

// 로컬 개발용
if (!process.env.VERCEL) {
    bootstrap().then((server) => {
        const port = process.env.PORT || 3000;
        server.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    });
}
