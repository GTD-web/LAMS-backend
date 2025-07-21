const { NestFactory, Reflector } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const path = require('path');
const fs = require('fs');

let app;

async function getApp() {
    if (app) return app;

    try {
        console.log('🚀 Starting NestJS app creation...');
        console.log('Current working directory:', process.cwd());
        console.log('__dirname:', __dirname);

        // 현재 디렉토리 내용 확인
        const currentDir = process.cwd();
        console.log('Current directory contents:', fs.readdirSync(currentDir));

        // dist 폴더 확인
        const distPath = path.join(currentDir, 'dist');
        if (fs.existsSync(distPath)) {
            console.log('✅ dist folder found');
            console.log('dist contents:', fs.readdirSync(distPath));
        } else {
            console.log('❌ dist folder not found');
            throw new Error('dist folder not found');
        }

        // 모듈들 로드
        const { AppModule } = require(path.join(distPath, 'app.module.js'));
        console.log('✅ AppModule loaded successfully');

        // NestJS 앱 생성
        app = await NestFactory.create(AppModule);

        // 글로벌 설정들 추가
        try {
            // ResponseInterceptor 추가
            const { ResponseInterceptor } = require(path.join(distPath, 'common/interceptors/response.interceptor.js'));
            app.useGlobalInterceptors(new ResponseInterceptor());
            console.log('✅ ResponseInterceptor applied');
        } catch (error) {
            console.log('⚠️ ResponseInterceptor not found, skipping');
        }

        try {
            // GlobalExceptionFilter 추가
            const { GlobalExceptionFilter } = require(path.join(distPath, 'common/filters/global-exception.filter.js'));
            app.useGlobalFilters(new GlobalExceptionFilter());
            console.log('✅ GlobalExceptionFilter applied');
        } catch (error) {
            console.log('⚠️ GlobalExceptionFilter not found, skipping');
        }

        try {
            // Guards 추가
            const { JwtAuthGuard } = require(path.join(distPath, 'common/guards/jwt-auth.guard.js'));
            const { RolesGuard } = require(path.join(distPath, 'common/guards/roles.guard.js'));

            const reflector = app.get(Reflector);
            app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));
            console.log('✅ JwtAuthGuard and RolesGuard applied');
        } catch (error) {
            console.log('⚠️ Guards not found, skipping');
        }

        // 기본 설정
        app.setGlobalPrefix('api');
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
        app.enableCors({ origin: '*' });

        // Swagger 설정 (개발 환경에서만)
        if (process.env.NODE_ENV !== 'production') {
            try {
                const { settingSwagger } = require(path.join(distPath, 'common/utils/swagger/swagger.util.js'));
                await settingSwagger(app);
                console.log('✅ Swagger configured');
            } catch (error) {
                console.log('⚠️ Swagger setup failed, skipping');
            }
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
        return nestApp.getHttpAdapter().getInstance()(req, res);
    } catch (error) {
        console.error('❌ Serverless function error:', error);

        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
        });
    }
};
