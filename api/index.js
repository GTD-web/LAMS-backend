const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { ValidationPipe } = require('@nestjs/common');
const { ResponseInterceptor } = require('../dist/common/interceptors/response.interceptor');
const { GlobalExceptionFilter } = require('../dist/common/filters/global-exception.filter');
const { JwtAuthGuard } = require('../dist/common/guards/jwt-auth.guard');
const { RolesGuard } = require('../dist/common/guards/roles.guard');
const { Reflector } = require('@nestjs/core');
const { settingSwagger } = require('../dist/common/utils/swagger/swagger.util');

let app;

async function bootstrap() {
    if (!app) {
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
            origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
            credentials: true,
        });

        // Swagger setup
        await settingSwagger(app);

        await app.init();
    }
    return app;
}

module.exports = async (req, res) => {
    const server = await bootstrap();
    return server.getHttpAdapter().getInstance()(req, res);
};
