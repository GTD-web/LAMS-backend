const { NestFactory, Reflector } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');

let app;

async function bootstrap() {
    if (app) return app;

    try {
        // AppModule 로드
        const { AppModule } = require('../dist/app.module');

        // NestJS 앱 생성 (main.ts와 동일)
        app = await NestFactory.create(AppModule);

        // 글로벌 설정들 (main.ts와 동일)
        try {
            const { ResponseInterceptor } = require('../dist/common/interceptors/response.interceptor');
            const { LoggingInterceptor } = require('../dist/common/interceptors/logging.interceptor');
            const { GlobalExceptionFilter } = require('../dist/common/filters/global-exception.filter');
            const { JwtAuthGuard } = require('../dist/common/guards/jwt-auth.guard');
            const { RolesGuard } = require('../dist/common/guards/roles.guard');

            app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor());
            app.useGlobalFilters(new GlobalExceptionFilter());
            app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)), new RolesGuard(app.get(Reflector)));
        } catch (error) {
            console.log('Some global modules not found, using basic setup');
        }

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

module.exports = async (req, res) => {
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
