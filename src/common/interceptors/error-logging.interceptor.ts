import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { DateHelper } from '../utils/helpers/date.helper';

/**
 * 에러 로깅 인터셉터
 * - 모든 HTTP 요청/응답에서 발생하는 에러를 상세히 로깅
 * - 요청 정보, 사용자 정보, 에러 상세 정보 포함
 * - 성공 응답도 간단히 로깅
 */
@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ErrorLoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest<Request>();
        const response = httpContext.getResponse<Response>();
        const startTime = Date.now();

        // 요청 기본 정보
        const requestInfo = {
            method: request.method,
            url: request.url,
            userAgent: request.get('User-Agent'),
            ip: this.getClientIp(request),
            timestamp: DateHelper.now(),
        };

        // 사용자 정보 (JWT 토큰에서 추출)
        const user = (request as any).user;
        const userInfo = user
            ? {
                  userId: user.sub || user.id,
                  email: user.email,
                  roles: user.roles,
              }
            : null;

        return next.handle().pipe(
            tap(() => {
                // 성공 응답 로깅 (간단히)
                const responseTime = Date.now() - startTime;
                this.logger.log(`✅ ${request.method} ${request.url} - ${response.statusCode} (${responseTime}ms)`);
            }),
            catchError((error) => {
                // 에러 상세 로깅
                const responseTime = Date.now() - startTime;
                this.logError(error, requestInfo, userInfo, responseTime);
                return throwError(() => error);
            }),
        );
    }

    /**
     * 에러 상세 로깅
     */
    private logError(error: any, requestInfo: any, userInfo: any, responseTime: number): void {
        const errorDetails = {
            // 기본 에러 정보
            name: error.name,
            message: error.message,
            status: error.status || error.statusCode || 500,

            // 스택 트레이스 (개발 환경에서만)
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,

            // 요청 정보
            request: requestInfo,

            // 사용자 정보
            user: userInfo,

            // 성능 정보
            responseTime: `${responseTime}ms`,

            // 추가 컨텍스트
            timestamp: DateHelper.now(),
        };

        // 에러 레벨에 따른 로깅
        if (error.status >= 500) {
            // 서버 에러 (심각)
            this.logger.error(`🚨 SERVER ERROR: ${error.message}`, JSON.stringify(errorDetails, null, 2));
        } else if (error.status >= 400) {
            // 클라이언트 에러 (경고)
            this.logger.warn(
                `⚠️ CLIENT ERROR: ${error.message}`,
                JSON.stringify(
                    {
                        ...errorDetails,
                        stack: undefined, // 클라이언트 에러는 스택 제외
                    },
                    null,
                    2,
                ),
            );
        } else {
            // 기타 에러
            this.logger.error(`❌ UNKNOWN ERROR: ${error.message}`, JSON.stringify(errorDetails, null, 2));
        }

        // 특정 에러에 대한 추가 로깅
        this.logSpecificErrors(error, requestInfo, userInfo);
    }

    /**
     * 특정 에러 타입에 대한 추가 로깅
     */
    private logSpecificErrors(error: any, requestInfo: any, userInfo: any): void {
        // 인증 관련 에러
        if (error.status === 401) {
            this.logger.warn(`🔐 AUTHENTICATION FAILED: ${requestInfo.url}`, {
                ip: requestInfo.ip,
                userAgent: requestInfo.userAgent,
                attemptedUser: userInfo?.email || 'Unknown',
            });
        }

        // 권한 관련 에러
        if (error.status === 403) {
            this.logger.warn(`🚫 AUTHORIZATION FAILED: ${requestInfo.url}`, {
                userId: userInfo?.userId,
                userRoles: userInfo?.roles,
                requestedResource: requestInfo.url,
            });
        }

        // 데이터베이스 관련 에러
        if (error.name === 'QueryFailedError') {
            this.logger.error(`💾 DATABASE ERROR: ${error.message}`, {
                query: error.query,
                parameters: error.parameters,
                constraint: error.constraint,
            });
        }

        // 유효성 검사 에러
        if (error.name === 'ValidationError' || error.status === 400) {
            this.logger.warn(`📝 VALIDATION ERROR: ${error.message}`, {
                validationErrors: error.response?.message || error.message,
                requestBody: this.sanitizeRequestBody(requestInfo),
            });
        }
    }

    /**
     * 클라이언트 IP 주소 추출
     */
    private getClientIp(request: Request): string {
        return (
            (request.headers['x-forwarded-for'] as string) ||
            (request.headers['x-real-ip'] as string) ||
            request.connection?.remoteAddress ||
            (request as any).socket?.remoteAddress ||
            'unknown'
        );
    }

    /**
     * 요청 본문 정보 정리 (민감한 정보 제거)
     */
    private sanitizeRequestBody(requestInfo: any): any {
        if (!requestInfo.body) return undefined;

        const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
        const sanitized = { ...requestInfo.body };

        Object.keys(sanitized).forEach((key) => {
            if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
                sanitized[key] = '[REDACTED]';
            }
        });

        return sanitized;
    }
}
