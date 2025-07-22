"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ErrorLoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorLoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const date_helper_1 = require("../utils/helpers/date.helper");
let ErrorLoggingInterceptor = ErrorLoggingInterceptor_1 = class ErrorLoggingInterceptor {
    constructor() {
        this.logger = new common_1.Logger(ErrorLoggingInterceptor_1.name);
    }
    intercept(context, next) {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const response = httpContext.getResponse();
        const startTime = Date.now();
        const requestInfo = {
            method: request.method,
            url: request.url,
            userAgent: request.get('User-Agent'),
            ip: this.getClientIp(request),
            timestamp: date_helper_1.DateHelper.now(),
        };
        const user = request.user;
        const userInfo = user
            ? {
                userId: user.sub || user.id,
                email: user.email,
                roles: user.roles,
            }
            : null;
        return next.handle().pipe((0, operators_1.tap)(() => {
            const responseTime = Date.now() - startTime;
            this.logger.log(`✅ ${request.method} ${request.url} - ${response.statusCode} (${responseTime}ms)`);
        }), (0, operators_1.catchError)((error) => {
            const responseTime = Date.now() - startTime;
            this.logError(error, requestInfo, userInfo, responseTime);
            return (0, rxjs_1.throwError)(() => error);
        }));
    }
    logError(error, requestInfo, userInfo, responseTime) {
        const errorDetails = {
            name: error.name,
            message: error.message,
            status: error.status || error.statusCode || 500,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            request: requestInfo,
            user: userInfo,
            responseTime: `${responseTime}ms`,
            timestamp: date_helper_1.DateHelper.now(),
        };
        if (error.status >= 500) {
            this.logger.error(`🚨 SERVER ERROR: ${error.message}`, JSON.stringify(errorDetails, null, 2));
        }
        else if (error.status >= 400) {
            this.logger.warn(`⚠️ CLIENT ERROR: ${error.message}`, JSON.stringify({
                ...errorDetails,
                stack: undefined,
            }, null, 2));
        }
        else {
            this.logger.error(`❌ UNKNOWN ERROR: ${error.message}`, JSON.stringify(errorDetails, null, 2));
        }
        this.logSpecificErrors(error, requestInfo, userInfo);
    }
    logSpecificErrors(error, requestInfo, userInfo) {
        if (error.status === 401) {
            this.logger.warn(`🔐 AUTHENTICATION FAILED: ${requestInfo.url}`, {
                ip: requestInfo.ip,
                userAgent: requestInfo.userAgent,
                attemptedUser: userInfo?.email || 'Unknown',
            });
        }
        if (error.status === 403) {
            this.logger.warn(`🚫 AUTHORIZATION FAILED: ${requestInfo.url}`, {
                userId: userInfo?.userId,
                userRoles: userInfo?.roles,
                requestedResource: requestInfo.url,
            });
        }
        if (error.name === 'QueryFailedError') {
            this.logger.error(`💾 DATABASE ERROR: ${error.message}`, {
                query: error.query,
                parameters: error.parameters,
                constraint: error.constraint,
            });
        }
        if (error.name === 'ValidationError' || error.status === 400) {
            this.logger.warn(`📝 VALIDATION ERROR: ${error.message}`, {
                validationErrors: error.response?.message || error.message,
                requestBody: this.sanitizeRequestBody(requestInfo),
            });
        }
    }
    getClientIp(request) {
        return (request.headers['x-forwarded-for'] ||
            request.headers['x-real-ip'] ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            'unknown');
    }
    sanitizeRequestBody(requestInfo) {
        if (!requestInfo.body)
            return undefined;
        const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
        const sanitized = { ...requestInfo.body };
        Object.keys(sanitized).forEach((key) => {
            if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
                sanitized[key] = '[REDACTED]';
            }
        });
        return sanitized;
    }
};
exports.ErrorLoggingInterceptor = ErrorLoggingInterceptor;
exports.ErrorLoggingInterceptor = ErrorLoggingInterceptor = ErrorLoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], ErrorLoggingInterceptor);
//# sourceMappingURL=error-logging.interceptor.js.map