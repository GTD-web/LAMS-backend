import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const method = req.method;
        const url = req.url;
        const now = Date.now();

        // 로그 ?�작
        this.logger.log(`Incoming Request: ${method} ${url}, Body: ${JSON.stringify(req.body)}`);

        return next.handle().pipe(
            tap(() => {
                const statusCode = res.statusCode;
                const responseTime = Date.now() - now;
                // 로그 종료
                this.logger.log(`Outgoing Response: ${method} ${url} ${statusCode} - ${responseTime}ms`);
            }),
        );
    }
}
