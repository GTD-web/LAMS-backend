const { NestFactory, Reflector } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { AppModule } = require('../dist/app.module');
const { GlobalExceptionFilter } = require('../dist/common/filters/global-exception.filter');
const { JwtAuthGuard } = require('../dist/common/guards/jwt-auth.guard');
const { RolesGuard } = require('../dist/common/guards/roles.guard');
const { ResponseInterceptor } = require('../dist/common/interceptors/response.interceptor');
const { settingSwagger } = require('../dist/common/utils/swagger/swagger.util');

let app;

async function getApp() {
    if (app) return app;

    try {
        console.log('🚀 Creating NestJS app...');

        // NestJS 앱 생성
        app = await NestFactory.create(AppModule);

        // Global 설정
        app.useGlobalInterceptors(new ResponseInterceptor());
        app.useGlobalFilters(new GlobalExceptionFilter());

        const reflector = app.get(Reflector);
        app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

        app.setGlobalPrefix('api');
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        // // CORS 설정
        // app.enableCors({
        //     origin: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
        //     credentials: true,
        // });

        // Swagger 설정 (개발 환경에서만)
        if (process.env.NODE_ENV !== 'production') {
            await settingSwagger(app);
        }

        await app.init();
        console.log('✅ NestJS app initialized successfully');

        return app;
    } catch (error) {
        console.error('❌ Failed to create NestJS app:', error);
        throw error;
    }
}

module.exports = async (req, res) => {
    try {
        console.log(`📨 ${req.method} ${req.url}`);

        const nestApp = await getApp();
        const httpAdapter = nestApp.getHttpAdapter();
        const instance = httpAdapter.getInstance();

        return instance(req, res);
    } catch (error) {
        console.error('❌ Serverless function error:', error);

        if (!res.headersSent) {
            res.status(500).json({
                error: 'Internal Server Error',
                message: error.message,
                timestamp: new Date().toISOString(),
            });
        }
    }
};
