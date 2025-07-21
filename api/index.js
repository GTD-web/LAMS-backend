const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { GlobalExceptionFilter } = require('../dist/common/filters/global-exception.filter');
const { LoggingInterceptor } = require('../dist/common/interceptors/logging.interceptor');
const { settingSwagger } = require('../dist/common/utils/swagger/swagger.util');

let app;

async function createNestApp() {
    if (!app) {
        // dist 폴더에서 import
        const { AppModule } = require('../dist/app.module');
        const { JwtAuthGuard } = require('../dist/common/guards/jwt-auth.guard');
        const { RolesGuard } = require('../dist/common/guards/roles.guard');
        const { ResponseInterceptor } = require('../dist/common/interceptors/response.interceptor');

        app = await NestFactory.create(AppModule);

        // 글로벌 가드 및 인터셉터 설정
        app.useGlobalGuards(new JwtAuthGuard(), new RolesGuard());
        app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor());
        app.useGlobalFilters(new GlobalExceptionFilter());
        app.setGlobalPrefix('api');
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        if (process.env.NODE_ENV !== 'production') {
            settingSwagger(app);
        }

        await app.init();
    }
    return app;
}

module.exports = async (req, res) => {
    try {
        const nestApp = await createNestApp();
        const expressApp = nestApp.getHttpAdapter().getInstance();
        return expressApp(req, res);
    } catch (error) {
        console.error('Serverless function error:', error);
        res.status(500).json({ error: error.message });
    }
};
