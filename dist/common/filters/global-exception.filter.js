"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const date_helper_1 = require("../utils/helpers/date.helper");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const { status, message, details } = this.getErrorResponse(exception);
        this.logError(exception, request, status, message);
        response.status(status).json({
            result: false,
            status,
            message,
            details,
            timestamp: date_helper_1.DateHelper.now(),
            path: request.url,
        });
    }
    getErrorResponse(exception) {
        if (exception instanceof common_1.HttpException) {
            const response = exception.getResponse();
            return {
                status: exception.getStatus(),
                message: typeof response === 'string' ? response : response.message,
                details: typeof response === 'object' ? response.details : undefined,
            };
        }
        if (exception instanceof typeorm_1.QueryFailedError) {
            return this.handleDatabaseError(exception);
        }
        return {
            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: '서버 오류가 발생했습니다.',
        };
    }
    handleDatabaseError(error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        switch (errorCode) {
            case '23505':
                if (errorMessage.includes('email')) {
                    return {
                        status: common_1.HttpStatus.CONFLICT,
                        message: '이메일이 사용 중입니다.',
                    };
                }
                if (errorMessage.includes('username')) {
                    return {
                        status: common_1.HttpStatus.CONFLICT,
                        message: '사용자 이름이 사용 중입니다.',
                    };
                }
                return {
                    status: common_1.HttpStatus.CONFLICT,
                    message: '중복 키가 발생했습니다.',
                };
            case '23503':
                return {
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: '참조 무결성 제약 조건에 위배되었습니다.',
                };
            case '23502':
                return {
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: '필드가 널값으로 설정되었습니다.',
                };
            default:
                return {
                    status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: '데이터베이스 오류가 발생했습니다.',
                };
        }
    }
    logError(exception, request, status, message) {
        const logContext = {
            method: request.method,
            url: request.url,
            status,
            message,
            userAgent: request.get('User-Agent'),
            ip: request.ip,
        };
        if (status >= 500) {
            this.logger.error(`Server Error: ${JSON.stringify(logContext)}`, exception instanceof Error ? exception.stack : String(exception));
        }
        else {
            this.logger.warn(`Client Error: ${JSON.stringify(logContext)}`);
        }
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map