const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');

let app;

async function bootstrap() {
    if (!app) {
        try {
            // 동적 import를 사용하여 빌드된 모듈들을 로드
            const { AppModule } = require('../dist/app.module');
            const { ResponseInterceptor } = require('../dist/common/interceptors/response.interceptor');
            const { GlobalExceptionFilter } = require('../dist/common/filters/global-exception.filter');
            const { JwtAuthGuard } = require('../dist/common/guards/jwt-auth.guard');
            const { RolesGuard } = require('../dist/common/guards/roles.guard');
            const { Reflector } = require('@nestjs/core');
            const { settingSwagger } = require('../dist/common/utils/swagger/swagger.util');

            app = await NestFactory.create(AppModule);

            // Global interceptors and filters
            app.useGlobalInterceptors(new ResponseInterceptor());
            app.useGlobalFilters(new GlobalExceptionFilter());
            app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)), new RolesGuard(app.get(Reflector)));

            // Global prefix and validation
            app.setGlobalPrefix('api');
            app.useGlobalPipes(
                new ValidationPipe({
                    whitelist: true,
                    forbidNonWhitelisted: true,
                    transform: true,
                }),
            );

            // CORS configuration
            app.enableCors({
                origin: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
                credentials: true,
            });

            // Swagger setup (only in development)
            if (process.env.NODE_ENV !== 'production') {
                await settingSwagger(app);
            }

            await app.init();
            console.log('✅ NestJS app initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize NestJS app:', error);
            throw error;
        }
    }
    return app;
}

module.exports = async (req, res) => {
    try {
        const server = await bootstrap();
        const httpAdapter = server.getHttpAdapter();
        const instance = httpAdapter.getInstance();
        return instance(req, res);
    } catch (error) {
        console.error('❌ Error in serverless function:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
        });
    }
};
