"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const global_exception_filter_1 = require("../src/common/filters/global-exception.filter");
const logging_interceptor_1 = require("../src/common/interceptors/logging.interceptor");
const swagger_util_1 = require("../src/common/utils/swagger/swagger.util");
const { NestFactory } = require('@nestjs/core');
let app;
async function createNestApp() {
    if (!app) {
        const { AppModule } = require('../dist/app.module');
        const { JwtAuthGuard } = require('../dist/common/guards/jwt-auth.guard');
        const { RolesGuard } = require('../dist/common/guards/roles.guard');
        const { ResponseInterceptor } = require('../dist/common/interceptors/response.interceptor');
        app = await NestFactory.create(AppModule);
        app.useGlobalGuards(new JwtAuthGuard(), new RolesGuard());
        app.useGlobalInterceptors(new ResponseInterceptor(), new logging_interceptor_1.LoggingInterceptor());
        app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        if (process.env.NODE_ENV !== 'production') {
            (0, swagger_util_1.settingSwagger)(app);
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
    }
    catch (error) {
        console.error('Serverless function error:', error);
        res.status(500).json({ error: error.message });
    }
};
//# sourceMappingURL=indext.js.map