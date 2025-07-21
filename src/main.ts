import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

let app: any;

async function bootstrap() {
    if (app) return app;

    try {
        app = await NestFactory.create(AppModule);

        app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor());
        app.useGlobalFilters(new GlobalExceptionFilter());
        app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)), new RolesGuard(app.get(Reflector)));

        app.setGlobalPrefix('api');
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        // CORS 설정
        app.enableCors();

        await app.init();
        console.log('✅ NestJS app initialized successfully');

        return app;
    } catch (error) {
        console.error('❌ Failed to initialize app:', error.message);
        throw error;
    }
}

// 서버리스 함수로 내보내기
module.exports = async (req: any, res: any) => {
    try {
        const nestApp = await bootstrap();
        const expressApp = nestApp.getHttpAdapter().getInstance();
        return expressApp(req, res);
    } catch (error) {
        console.error('❌ Request error:', error.message);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
        });
    }
};

// 로컬 개발용 (Vercel에서는 실행되지 않음)
if (require.main === module) {
    const port = process.env.PORT || 5000;
    bootstrap().then((app) => {
        app.listen(port);
        console.log(`🚀 Application is running on: http://localhost:${port}`);
    });
}
