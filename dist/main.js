"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const swagger_util_1 = require("./common/utils/swagger/swagger.util");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const error_logging_interceptor_1 = require("./common/interceptors/error-logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(app.get(core_1.Reflector)), new roles_guard_1.RolesGuard(app.get(core_1.Reflector)));
    app.useGlobalInterceptors(new error_logging_interceptor_1.ErrorLoggingInterceptor(), new response_interceptor_1.ResponseInterceptor(), new logging_interceptor_1.LoggingInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    const uploadPath = (0, path_1.join)(process.cwd(), 'public');
    app.useStaticAssets(uploadPath, {
        prefix: '/public',
        index: false,
        fallthrough: false,
    });
    (0, swagger_util_1.settingSwagger)(app);
    const port = process.env.PORT || 5000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Application is running on: http://localhost:${port}`);
}
exports.default = bootstrap;
if (process.env.NODE_ENV !== 'production') {
    bootstrap();
}
//# sourceMappingURL=main.js.map