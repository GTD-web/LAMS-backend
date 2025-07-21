"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const date_helper_1 = require("../utils/helpers/date.helper");
let ResponseInterceptor = class ResponseInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((result) => {
            if (result === undefined || result === null) {
                return {
                    success: true,
                    message: '요청이 성공적으로 처리되었습니다.',
                    timestamp: date_helper_1.DateHelper.now(),
                    data: null,
                };
            }
            const hasDataProperty = result && typeof result === 'object' && 'data' in result;
            return {
                success: true,
                message: result.message || '요청이 성공적으로 처리되었습니다.',
                timestamp: date_helper_1.DateHelper.now(),
                data: hasDataProperty ? result.data : result,
                ...(result && typeof result === 'object' && 'meta' in result && { meta: result.meta }),
            };
        }));
    }
};
exports.ResponseInterceptor = ResponseInterceptor;
exports.ResponseInterceptor = ResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseInterceptor);
//# sourceMappingURL=response.interceptor.js.map