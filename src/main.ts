import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

let app: any;

async function getApp() {
    if (app) return app;

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

    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    await app.init();
    return app;
}

// Vercel 서버리스 함수
const handler = async (req: any, res: any) => {
    try {
        const nestApp = await getApp();
        const httpAdapter = nestApp.getHttpAdapter();
        const instance = httpAdapter.getInstance();
        return instance(req, res);
    } catch (error) {
        console.error('Serverless function error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
        });
    }
};

// Export 방식을 명확히
module.exports = handler;
module.exports.default = handler;

// 로컬 개발용
if (require.main === module) {
    (async () => {
        const app = await getApp();
        const port = process.env.PORT || 5000;
        await app.listen(port);
        console.log(`🚀 Application is running on: http://localhost:${port}`);
    })();
}
