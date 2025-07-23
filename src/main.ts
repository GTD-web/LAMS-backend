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

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

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
    // Vercel에서는 포트 0으로 동적 할당
    let port = 3000;

    if (process.env.VERCEL) {
        port = 0; // 시스템이 자동 할당
    } else if (process.env.PORT) {
        port = parseInt(process.env.PORT, 10);
    }

    console.log('🚀 Starting on port:', port);

    await app.listen(port);

    // 실제 할당된 포트 확인 (포트 0 사용시)
    if (port === 0) {
        const server = app.getHttpServer();
        const address = server.address();
        console.log('✅ Assigned port:', address?.port);
    }

    return app;
}

// Vercel용 export
export default bootstrap;

// 로컬 개발용
if (process.env.NODE_ENV !== 'production') {
    bootstrap().catch(console.error);
}
