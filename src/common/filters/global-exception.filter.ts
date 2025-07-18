import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { DateHelper } from '@src/common/utils/helpers/date.helper';

/**
 * 글로벌 예외 필터
 * - 모든 예외를 캐치하고 적절한 응답 형태로 변환
 * - 데이터베이스 오류, 비즈니스 로직 오류 등을 처리
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const { status, message, details } = this.getErrorResponse(exception);

        // 에러 로그 기록 (많은 경우 간소화)
        this.logError(exception, request, status, message);

        // 응답
        response.status(status).json({
            result: false,
            status,
            message,
            details,
            timestamp: DateHelper.now(),
            path: request.url,
        });
    }

    /**
     * 예외에 따른 적절한 응답 생성
     */
    private getErrorResponse(exception: unknown): {
        status: number;
        message: string;
        details?: string[];
    } {
        // HTTP 예외 처리
        if (exception instanceof HttpException) {
            const response = exception.getResponse();
            return {
                status: exception.getStatus(),
                message: typeof response === 'string' ? response : (response as any).message,
                details: typeof response === 'object' ? (response as any).details : undefined,
            };
        }

        // TypeORM 쿼리 실패 오류 처리
        if (exception instanceof QueryFailedError) {
            return this.handleDatabaseError(exception);
        }

        // 기본 오류
        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: '서버 오류가 발생했습니다.',
        };
    }

    /**
     * 데이터베이스 오류 처리
     */
    private handleDatabaseError(error: QueryFailedError): {
        status: number;
        message: string;
        details?: string[];
    } {
        const errorCode = (error as any).code;
        const errorMessage = error.message;

        // PostgreSQL 오류 코드 처리
        switch (errorCode) {
            case '23505': // unique_violation
                if (errorMessage.includes('email')) {
                    return {
                        status: HttpStatus.CONFLICT,
                        message: '이메일이 사용 중입니다.',
                    };
                }
                if (errorMessage.includes('username')) {
                    return {
                        status: HttpStatus.CONFLICT,
                        message: '사용자 이름이 사용 중입니다.',
                    };
                }
                return {
                    status: HttpStatus.CONFLICT,
                    message: '중복 키가 발생했습니다.',
                };

            case '23503': // foreign_key_violation
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: '참조 무결성 제약 조건에 위배되었습니다.',
                };

            case '23502': // not_null_violation
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: '필드가 널값으로 설정되었습니다.',
                };

            default:
                return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: '데이터베이스 오류가 발생했습니다.',
                };
        }
    }

    /**
     * 에러 로그 기록 (간소화된 형태)
     */
    private logError(exception: unknown, request: Request, status: number, message: string): void {
        const logContext = {
            method: request.method,
            url: request.url,
            status,
            message,
            userAgent: request.get('User-Agent'),
            ip: request.ip,
        };

        if (status >= 500) {
            // 서버 오류 로그
            this.logger.error(
                `Server Error: ${JSON.stringify(logContext)}`,
                exception instanceof Error ? exception.stack : String(exception),
            );
        } else {
            // 클라이언트 오류 로그
            this.logger.warn(`Client Error: ${JSON.stringify(logContext)}`);
        }
    }
}
