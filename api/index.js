const { NestFactory, Reflector } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const path = require('path');

let app;

async function getApp() {
    if (app) return app;

    try {
        console.log('🚀 Starting NestJS app initialization...');
        console.log('Working directory:', process.cwd());
        console.log('__dirname:', __dirname);
        console.log('NODE_ENV:', process.env.NODE_ENV);

        // 모듈 경로 확인
        const distPath = path.resolve(process.cwd(), 'dist');
        console.log('Dist path:', distPath);

        // AppModule 로드
        console.log('Loading AppModule...');
        const { AppModule } = require(path.join(distPath, 'app.module.js'));
        console.log('✅ AppModule loaded successfully');

        // NestJS 앱 생성
        console.log('Creating NestJS app...');
        app = await NestFactory.create(AppModule, {
            logger: ['error', 'warn', 'log'],
        });

        // 기본 설정
        app.setGlobalPrefix('api');
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        // CORS 설정
        app.enableCors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        });

        // 글로벌 설정들 (선택적 로딩)
        try {
            const { ResponseInterceptor } = require(path.join(distPath, 'common/interceptors/response.interceptor.js'));
            app.useGlobalInterceptors(new ResponseInterceptor());
            console.log('✅ ResponseInterceptor loaded');
        } catch (error) {
            console.log('⚠️ ResponseInterceptor not found, skipping');
        }

        try {
            const { GlobalExceptionFilter } = require(path.join(distPath, 'common/filters/global-exception.filter.js'));
            app.useGlobalFilters(new GlobalExceptionFilter());
            console.log('✅ GlobalExceptionFilter loaded');
        } catch (error) {
            console.log('⚠️ GlobalExceptionFilter not found, skipping');
        }

        try {
            const { JwtAuthGuard } = require(path.join(distPath, 'common/guards/jwt-auth.guard.js'));
            const { RolesGuard } = require(path.join(distPath, 'common/guards/roles.guard.js'));
            const reflector = app.get(Reflector);
            app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));
            console.log('✅ Guards loaded');
        } catch (error) {
            console.log('⚠️ Guards not found, skipping');
        }

        // 앱 초기화
        await app.init();
        console.log('✅ NestJS app initialized successfully');

        return app;
    } catch (error) {
        console.error('❌ Failed to initialize NestJS app:', error);
        console.error('Error stack:', error.stack);
        throw error;
    }
}

module.exports = async (req, res) => {
    console.log(`📨 ${req.method} ${req.url}`);

    try {
        const nestApp = await getApp();
        const httpAdapter = nestApp.getHttpAdapter();
        const instance = httpAdapter.getInstance();

        // Express 인스턴스로 요청 처리
        return instance(req, res);
    } catch (error) {
        console.error('❌ Request handling error:', error);

        // 기본 에러 응답
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: error.message,
                timestamp: new Date().toISOString(),
                path: req.url,
            });
        }
    }
};
