"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingSwagger = settingSwagger;
const swagger_1 = require("@nestjs/swagger");
async function settingSwagger(app) {
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Integrated API')
        .setDescription('통합 API 문서')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup(`api/docs`, app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            filter: true,
            docExpansion: 'none',
            displayRequestDuration: true,
            defaultModelsExpandDepth: -1,
            defaultModelExpandDepth: 3,
            tryItOutEnabled: true,
            syntaxHighlight: {
                activate: true,
                theme: 'monokai',
            },
        },
        customSiteTitle: 'Integrated API',
    });
}
//# sourceMappingURL=swagger.util.js.map