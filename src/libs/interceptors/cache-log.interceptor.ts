import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, SetMetadata } from '@nestjs/common';
import { CACHE_MANAGER, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cache } from 'cache-manager';
import { Reflector } from '@nestjs/core';

export const CacheKeyParams = (...params: string[]) => SetMetadata('cacheKeyParams', params);

@Injectable()
export class CacheLogInterceptor implements NestInterceptor {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private reflector: Reflector,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const cacheKey = this.generateCacheKey(context);
        const ttl = this.reflector.get(CacheTTL, context.getHandler());

        try {
            const cachedData = await this.cacheManager.get(cacheKey);
            if (cachedData) {
                console.log('캐시 히트:', cacheKey);
                return of(cachedData);
            }
        } catch (error) {
            console.error('캐시 조회 중 오류 발생:', error);
        }

        console.log('캐시 미스:', cacheKey);
        const now = Date.now();
        return next.handle().pipe(
            tap(async (data) => {
                try {
                    if (typeof ttl === 'number') {
                        await this.cacheManager.set(cacheKey, data, ttl);
                    } else {
                        await this.cacheManager.set(cacheKey, data, 10 * 1000);
                    }
                    console.log('응답 시간:', Date.now() - now, 'ms');
                    console.log('데이터를 캐시에 저장:', cacheKey, 'TTL:', ttl || 'default');
                } catch (error) {
                    console.error('캐시 저장 중 오류 발생:', error);
                }
            }),
        );
    }

    private generateCacheKey(context: ExecutionContext): string {
        const request = context.switchToHttp().getRequest();
        const cacheKey = this.reflector.get(CacheKey, context.getHandler());
        const cacheKeyParams = this.reflector.get('cacheKeyParams', context.getHandler()) || [];

        let key = cacheKey || request.url;

        // URL 파라미터 추가
        const params = request.params;
        for (const param of cacheKeyParams) {
            if (params[param]) {
                key += `-${param}:${params[param]}`;
            }
        }

        // 쿼리 파라미터 추가
        const query = request.query;
        for (const param of cacheKeyParams) {
            if (query[param]) {
                key += `-${param}:${query[param]}`;
            }
        }

        // HTTP 메소드 추가
        key += `-${request.method}`;

        return key;
    }
}
