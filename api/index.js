const { NestFactory } = require('@nestjs/core');
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

        // AppModule 로드 시도
        const appModulePath = path.join(distPath, 'app.module.js');
        if (fs.existsSync(appModulePath)) {
            console.log('✅ app.module.js found');
            const { AppModule } = require(appModulePath);
            console.log('✅ AppModule loaded successfully');

            // NestJS 앱 생성
            app = await NestFactory.create(AppModule);

            // 기본 설정
            app.setGlobalPrefix('api');
            app.useGlobalPipes(new ValidationPipe({ transform: true }));
            app.enableCors({ origin: '*' });

            await app.init();
            console.log('✅ NestJS app initialized successfully');

            return app;
        } else {
            throw new Error(`app.module.js not found at ${appModulePath}`);
        }
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
