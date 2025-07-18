import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { DateHelper } from '@src/common/utils/helpers/date.helper';

/**
 * 글로벌 ?�외 ?�터
 * - 모든 ?�외�?캐치?�고 ?�절???�답 ?�태�?변??
 * - ?�이?�베?�스 ?�러, 비즈?�스 로직 ?�러 ?�을 처리
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const { status, message, details } = this.getErrorResponse(exception);

        // ?�러 로그 기록 (?�무 많�? ?�보�??�함?��? ?�도�?간소??
        this.logError(exception, request, status, message);

        // ?�라?�언???�답
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
     * ?�외 ?�?�에 ?�른 ?�절???�답 ?�성
     */
    private getErrorResponse(exception: unknown): {
        status: number;
        message: string;
        details?: string[];
    } {
        // HTTP ?�외 처리
        if (exception instanceof HttpException) {
            const response = exception.getResponse();
            return {
                status: exception.getStatus(),
                message: typeof response === 'string' ? response : (response as any).message,
                details: typeof response === 'object' ? (response as any).details : undefined,
            };
        }

        // TypeORM 쿼리 ?�패 ?�러 처리
        if (exception instanceof QueryFailedError) {
            return this.handleDatabaseError(exception);
        }

        // 기�? ?????�는 ?�러
        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: '?�버 ?��? ?�류가 발생?�습?�다.',
        };
    }

    /**
     * ?�이?�베?�스 ?�러 처리
     */
    private handleDatabaseError(error: QueryFailedError): {
        status: number;
        message: string;
        details?: string[];
    } {
        const errorCode = (error as any).code;
        const errorMessage = error.message;

        // PostgreSQL ?�러 코드 처리
        switch (errorCode) {
            case '23505': // unique_violation
                if (errorMessage.includes('email')) {
                    return {
                        status: HttpStatus.CONFLICT,
                        message: '?��? ?�용 중인 ?�메?�입?�다.',
                    };
                }
                if (errorMessage.includes('username')) {
                    return {
                        status: HttpStatus.CONFLICT,
                        message: '?��? ?�용 중인 ?�용?�명?�니??',
                    };
                }
                return {
                    status: HttpStatus.CONFLICT,
                    message: '중복???�이?�입?�다.',
                };

            case '23503': // foreign_key_violation
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: '참조 무결???�약 조건 ?�반?�니??',
                };

            case '23502': // not_null_violation
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: '?�수 ?�드가 ?�락?�었?�니??',
                };

            default:
                return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: '?�이?�베?�스 ?�류가 발생?�습?�다.',
                };
        }
    }

    /**
     * ?�러 로그 기록 (간소?�된 ?�태)
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
            // ?�버 ?�러??ERROR ?�벨�?기록
            this.logger.error(
                `Server Error: ${JSON.stringify(logContext)}`,
                exception instanceof Error ? exception.stack : String(exception),
            );
        } else {
            // ?�라?�언???�러??WARN ?�벨�?기록
            this.logger.warn(`Client Error: ${JSON.stringify(logContext)}`);
        }
    }
}
