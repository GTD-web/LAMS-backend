import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((result): ApiResponse<T> => {
                // void??undefined??경우 처리
                if (result === undefined || result === null) {
                    return {
                        success: true,
                        message: '?�청???�공?�으�?처리?�었?�니??',
                        data: null as T,
                    };
                }

                // 객체?�고 data ?�로?�티가 ?�는지 ?�인
                const hasDataProperty = result && typeof result === 'object' && 'data' in result;

                return {
                    success: true,
                    message: '?�청???�공?�으�?처리?�었?�니??',
                    data: hasDataProperty ? result.data : result,
                    ...(result && typeof result === 'object' && 'meta' in result && { meta: result.meta }),
                };
            }),
        );
    }
}
