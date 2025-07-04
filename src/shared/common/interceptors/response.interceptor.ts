
export interface ResponseFormat<T> {
    result: boolean;
    status: number;
    message: string;
    data?: T;
}

export class PaginationDto<T> {
    items: T[];
    page: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
}

// response.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { CustomResponse } from '@src/shared/dtos/common/custom-response.dto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();

        return next.handle().pipe(
            map((data) => {
                const status = response.statusCode;
                const result = status >= 200 && status < 300;
                let message = 'Success';
                let responseData = data;

                if (data instanceof CustomResponse) {
                    message = data.message;
                    responseData = data.data;
                }

                return {
                    result,
                    status,
                    message,
                    data: responseData || undefined,
                };
            }),
        );
    }
}
export { CustomResponse };
