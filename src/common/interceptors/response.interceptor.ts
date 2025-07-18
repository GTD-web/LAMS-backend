import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((result): ApiResponse<T> => {
                // void??undefined??ê²½ìš° ì²˜ë¦¬
                if (result === undefined || result === null) {
                    return {
                        success: true,
                        message: '?”ì²­???±ê³µ?ìœ¼ë¡?ì²˜ë¦¬?˜ì—ˆ?µë‹ˆ??',
                        data: null as T,
                    };
                }

                // ê°ì²´?´ê³  data ?„ë¡œ?¼í‹°ê°€ ?ˆëŠ”ì§€ ?•ì¸
                const hasDataProperty = result && typeof result === 'object' && 'data' in result;

                return {
                    success: true,
                    message: '?”ì²­???±ê³µ?ìœ¼ë¡?ì²˜ë¦¬?˜ì—ˆ?µë‹ˆ??',
                    data: hasDataProperty ? result.data : result,
                    ...(result && typeof result === 'object' && 'meta' in result && { meta: result.meta }),
                };
            }),
        );
    }
}
