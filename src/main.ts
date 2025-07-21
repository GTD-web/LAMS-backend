const { NestFactory, Reflector } = require('@nestjs/core');
const { AppModule } = require('./app.module');
const { ResponseInterceptor } = require('./common/interceptors/response.interceptor');
const { ValidationPipe } = require('@nestjs/common');
const { JwtAuthGuard } = require('./common/guards/jwt-auth.guard');
const { RolesGuard } = require('./common/guards/roles.guard');
const { GlobalExceptionFilter } = require('./common/filters/global-exception.filter');
const { LoggingInterceptor } = require('./common/interceptors/logging.interceptor');

let app;

async function createNestApp() {
    if (app) return app;

    app = await NestFactory.create(AppModule);

    // 글로벌 설정
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

    // Vercel에서는 listen 대신 init만 호출
    await app.init();
    return app;
}

// Vercel 서버리스 함수 핸들러
module.exports = async function handler(req, res) {
    try {
        const nestApp = await createNestApp();
        const httpAdapter = nestApp.getHttpAdapter();
        const instance = httpAdapter.getInstance();

        // Express 인스턴스를 사용하여 요청 처리
        return instance(req, res);
    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message,
        });
    }
};

// 로컬 개발용
if (require.main === module) {
    createNestApp()
        .then(async (app) => {
            const port = process.env.PORT || 5000;
            await app.listen(port);
            console.log(`🚀 Application is running on: http://localhost:${port}`);
        })
        .catch(console.error);
}
