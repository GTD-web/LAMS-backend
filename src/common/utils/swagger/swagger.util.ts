import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function settingSwagger(app: INestApplication<any>) {
    const options = new DocumentBuilder()
        .setTitle('Integrated API')
        .setDescription('?�합??API 문서')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);

    // ?�합??문서�??�정?�니??
    SwaggerModule.setup(`api/docs`, app, document, {
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
