const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');

let app;

async function getApp() {
    if (app) return app;

    // 모듈 로드 (간단한 fallback 방식)
    let AppModule;
    try {
        AppModule = require('../dist/app.module').AppModule;
    } catch (error) {
        const path = require('path');
        AppModule = require(path.join(process.cwd(), 'dist/app.module')).AppModule;
    }

    // NestJS 앱 생성
    app = await NestFactory.create(AppModule);

    // 기본 설정만
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.enableCors({ origin: '*' });

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
