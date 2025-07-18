import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((result): ApiResponse<T> => {
                // 컨트롤러에서 빈 값을 반환하면 이 부분에서 처리됩니다.
                if (result === undefined || result === null) {
                    return {
                        success: true,
                        message: '요청이 성공적으로 처리되었습니다.',
                        timestamp: new Date().toISOString(),
                        data: null as T,
                    };
                }

                // 객체고 data 로티가 있는지 확인
                const hasDataProperty = result && typeof result === 'object' && 'data' in result;

                return {
                    success: true,
                    message: result.message || '요청이 성공적으로 처리되었습니다.',
                    timestamp: new Date().toISOString(),
                    data: hasDataProperty ? result.data : result,
                    ...(result && typeof result === 'object' && 'meta' in result && { meta: result.meta }),
                };
            }),
        );
    }
}
