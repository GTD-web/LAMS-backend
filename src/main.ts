import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { settingSwagger } from './common/utils/swagger/swagger.util';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)), new RolesGuard(app.get(Reflector)));
    // 전역 인터셉터 등록
    app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    // 파일 업로드 설정
    const uploadPath = join(process.cwd(), 'public');
    app.useStaticAssets(uploadPath, {
        prefix: '/public',
        index: false,
        fallthrough: false,
    });

    settingSwagger(app);
    await app.listen(process.env.PORT || 5000);
}
bootstrap();
