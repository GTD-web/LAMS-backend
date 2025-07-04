import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FileTypeValidatorInterceptor implements NestInterceptor {
    constructor(private allowedMimeTypes: string[]) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const files: Express.Multer.File[] = request.files;

        console.log('Files received:', files);

        if (!files || files.length === 0) {
            throw new BadRequestException('파일이 제공되지 않았습니다.');
        }

        const invalidFiles = files.filter((file) => !this.allowedMimeTypes.includes(file.mimetype));

        if (invalidFiles.length > 0) {
            const invalidFileNames = invalidFiles.map((file) => file.originalname).join(', ');
            throw new BadRequestException(`다음 파일은 허용되지 않는 형식입니다: ${invalidFileNames}`);
        }

        return next.handle();
    }
}
