const { NestFactory, Reflector } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const path = require('path');

let app;

// 안전한 모듈 로딩 함수
function safeRequire(modulePath) {
    const possiblePaths = [
        modulePath,
        path.join(process.cwd(), modulePath.replace('../', '')),
        path.join(__dirname, modulePath),
        path.join('/var/task', modulePath.replace('../', '')),
    ];

    for (const tryPath of possiblePaths) {
        try {
            console.log(`🔍 Trying to load: ${tryPath}`);
            return require(tryPath);
        } catch (error) {
            console.log(`❌ Failed to load ${tryPath}: ${error.message}`);
            continue;
        }
    }

    throw new Error(`Could not load module: ${modulePath}`);
}

async function getApp() {
    if (app) return app;

    try {
        console.log('🚀 Creating NestJS app...');
        console.log('Current working directory:', process.cwd());
        console.log('__dirname:', __dirname);

        // 모듈들을 안전하게 로드
        const { AppModule } = safeRequire('../dist/app.module');
        console.log('✅ AppModule loaded');

        // NestJS 앱 생성
        app = await NestFactory.create(AppModule);

        // 기본 설정만 (에러 발생 가능성 최소화)
        app.setGlobalPrefix('api');
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        // CORS 설정 (간단하게)
        app.enableCors({ origin: '*' });

        await app.init();
        console.log('✅ NestJS app initialized successfully');

        return app;
    } catch (error) {
        console.error('❌ Failed to create NestJS app:', error);
        console.error('Stack trace:', error.stack);
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
        console.error('Stack trace:', error.stack);

        if (!res.headersSent) {
            res.status(500).json({
                error: 'Internal Server Error',
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });
        }
    }
};
