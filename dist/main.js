"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
let app;
async function bootstrap() {
    if (app)
        return app;
    try {
        app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor(), new logging_interceptor_1.LoggingInterceptor());
        app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
        app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(app.get(core_1.Reflector)), new roles_guard_1.RolesGuard(app.get(core_1.Reflector)));
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        app.enableCors();
        await app.init();
        console.log('✅ NestJS app initialized successfully');
        return app;
    }
    catch (error) {
        console.error('❌ Failed to initialize app:', error.message);
        throw error;
    }
}
module.exports = async (req, res) => {
    try {
        const nestApp = await bootstrap();
        const expressApp = nestApp.getHttpAdapter().getInstance();
        return expressApp(req, res);
    }
    catch (error) {
        console.error('❌ Request error:', error.message);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
        });
    }
};
if (require.main === module) {
    const port = process.env.PORT || 5000;
    bootstrap().then((app) => {
        app.listen(port);
        console.log(`🚀 Application is running on: http://localhost:${port}`);
    });
}
//# sourceMappingURL=main.js.map