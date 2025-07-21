const { NestFactory } = require('@nestjs/core');
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

    // NestJS 앱 생성
    app = await NestFactory.create(AppModule);

    app.useGlobalInterceptors(new ResponseInterceptor());
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

    await settingSwagger(app);

    await app.init();
    console.log('✅ App ready');

    return app;
}

module.exports = async (req, res) => {
    try {
        const nestApp = await getApp();
        return nestApp.getHttpAdapter().getInstance()(req, res);
    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};
