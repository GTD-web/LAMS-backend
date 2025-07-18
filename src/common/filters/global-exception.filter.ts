import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

/**
 * ê¸€ë¡œë²Œ ?ˆì™¸ ?„í„°
 * - ëª¨ë“  ?ˆì™¸ë¥?ìºì¹˜?˜ê³  ?ì ˆ???‘ë‹µ ?•íƒœë¡?ë³€??
 * - ?°ì´?°ë² ?´ìŠ¤ ?ëŸ¬, ë¹„ì¦ˆ?ˆìŠ¤ ë¡œì§ ?ëŸ¬ ?±ì„ ì²˜ë¦¬
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const { status, message, details } = this.getErrorResponse(exception);

        // ?ëŸ¬ ë¡œê·¸ ê¸°ë¡ (?ˆë¬´ ë§ì? ?•ë³´ë¥??¬í•¨?˜ì? ?Šë„ë¡?ê°„ì†Œ??
        this.logError(exception, request, status, message);

        // ?´ë¼?´ì–¸???‘ë‹µ
        response.status(status).json({
            result: false,
            status,
            message,
            details,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }

    /**
     * ?ˆì™¸ ?€?…ì— ?°ë¥¸ ?ì ˆ???‘ë‹µ ?ì„±
     */
    private getErrorResponse(exception: unknown): {
        status: number;
        message: string;
        details?: string[];
    } {
        // HTTP ?ˆì™¸ ì²˜ë¦¬
        if (exception instanceof HttpException) {
            const response = exception.getResponse();
            return {
                status: exception.getStatus(),
                message: typeof response === 'string' ? response : (response as any).message,
                details: typeof response === 'object' ? (response as any).details : undefined,
            };
        }

        // TypeORM ì¿¼ë¦¬ ?¤íŒ¨ ?ëŸ¬ ì²˜ë¦¬
        if (exception instanceof QueryFailedError) {
            return this.handleDatabaseError(exception);
        }

        // ê¸°í? ?????†ëŠ” ?ëŸ¬
        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: '?œë²„ ?´ë? ?¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.',
        };
    }

    /**
     * ?°ì´?°ë² ?´ìŠ¤ ?ëŸ¬ ì²˜ë¦¬
     */
    private handleDatabaseError(error: QueryFailedError): {
        status: number;
        message: string;
        details?: string[];
    } {
        const errorCode = (error as any).code;
        const errorMessage = error.message;

        // PostgreSQL ?ëŸ¬ ì½”ë“œ ì²˜ë¦¬
        switch (errorCode) {
            case '23505': // unique_violation
                if (errorMessage.includes('email')) {
                    return {
                        status: HttpStatus.CONFLICT,
                        message: '?´ë? ?¬ìš© ì¤‘ì¸ ?´ë©”?¼ì…?ˆë‹¤.',
                    };
                }
                if (errorMessage.includes('username')) {
                    return {
                        status: HttpStatus.CONFLICT,
                        message: '?´ë? ?¬ìš© ì¤‘ì¸ ?¬ìš©?ëª…?…ë‹ˆ??',
                    };
                }
                return {
                    status: HttpStatus.CONFLICT,
                    message: 'ì¤‘ë³µ???°ì´?°ì…?ˆë‹¤.',
                };

            case '23503': // foreign_key_violation
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'ì°¸ì¡° ë¬´ê²°???œì•½ ì¡°ê±´ ?„ë°˜?…ë‹ˆ??',
                };

            case '23502': // not_null_violation
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: '?„ìˆ˜ ?„ë“œê°€ ?„ë½?˜ì—ˆ?µë‹ˆ??',
                };

            default:
                return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: '?°ì´?°ë² ?´ìŠ¤ ?¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.',
                };
        }
    }

    /**
     * ?ëŸ¬ ë¡œê·¸ ê¸°ë¡ (ê°„ì†Œ?”ëœ ?•íƒœ)
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
            // ?œë²„ ?ëŸ¬??ERROR ?ˆë²¨ë¡?ê¸°ë¡
            this.logger.error(
                `Server Error: ${JSON.stringify(logContext)}`,
                exception instanceof Error ? exception.stack : String(exception),
            );
        } else {
            // ?´ë¼?´ì–¸???ëŸ¬??WARN ?ˆë²¨ë¡?ê¸°ë¡
            this.logger.warn(`Client Error: ${JSON.stringify(logContext)}`);
        }
    }
}
