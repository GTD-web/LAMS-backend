"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const swagger_util_1 = require("./common/utils/swagger/swagger.util");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const error_logging_interceptor_1 = require("./common/interceptors/error-logging.interceptor");
const express = require("express");
const platform_express_1 = require("@nestjs/platform-express");
async function bootstrap() {
    const server = express();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(app.get(core_1.Reflector)), new roles_guard_1.RolesGuard(app.get(core_1.Reflector)));
    app.useGlobalInterceptors(new error_logging_interceptor_1.ErrorLoggingInterceptor(), new response_interceptor_1.ResponseInterceptor(), new logging_interceptor_1.LoggingInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    (0, swagger_util_1.settingSwagger)(app);
    await app.init();
    return server;
}
exports.default = async (req, res) => {
    const server = await bootstrap();
    return server(req, res);
};
if (!process.env.VERCEL) {
    bootstrap().then((server) => {
        const port = process.env.PORT || 3000;
        server.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    });
}
//# sourceMappingURL=main.js.map