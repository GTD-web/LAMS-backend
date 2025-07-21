"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessMessageHelper = void 0;
const common_1 = require("@nestjs/common");
const success_messages_constants_1 = require("../constants/success-messages.constants");
const date_helper_1 = require("../utils/helpers/date.helper");
class SuccessMessageHelper {
    static createSuccessResponse(message, data, meta) {
        const response = {
            success: true,
            message,
            timestamp: date_helper_1.DateHelper.now(),
            [success_messages_constants_1.SUCCESS_MESSAGE]: success_messages_constants_1.SUCCESS_MESSAGE,
            ...(data !== undefined && { data }),
            ...(meta && { meta }),
        };
        this.logger.log(`✅ ${message}`, {
            hasData: data !== undefined,
            hasMeta: meta !== undefined,
            timestamp: response.timestamp,
        });
        return response;
    }
    static createSuccessMessage(message) {
        return this.createSuccessResponse(message);
    }
    static createPaginatedSuccessResponse(message, data, meta) {
        const response = {
            success: true,
            message,
            data,
            meta,
            timestamp: date_helper_1.DateHelper.now(),
            [success_messages_constants_1.SUCCESS_MESSAGE]: success_messages_constants_1.SUCCESS_MESSAGE,
        };
        this.logger.log(`📄 ${message}`, {
            itemCount: data.length,
            page: meta.page,
            limit: meta.limit,
            total: meta.total,
            totalPages: meta.totalPages,
        });
        return response;
    }
    static createRetrievalSuccessResponse(message, data, count) {
        const response = {
            success: true,
            message,
            data,
            timestamp: date_helper_1.DateHelper.now(),
            [success_messages_constants_1.SUCCESS_MESSAGE]: success_messages_constants_1.SUCCESS_MESSAGE,
        };
        this.logger.log(`🔍 ${message}`, {
            dataType: typeof data,
            isArray: Array.isArray(data),
            count: count || (Array.isArray(data) ? data.length : 1),
        });
        return response;
    }
    static createCreationSuccessResponse(message, data) {
        const response = {
            success: true,
            message,
            data,
            timestamp: date_helper_1.DateHelper.now(),
            [success_messages_constants_1.SUCCESS_MESSAGE]: success_messages_constants_1.SUCCESS_MESSAGE,
        };
        this.logger.log(`➕ ${message}`, {
            createdItem: data,
        });
        return response;
    }
    static createUpdateSuccessResponse(message, data, changedFields) {
        const response = {
            success: true,
            message,
            data,
            timestamp: date_helper_1.DateHelper.now(),
            [success_messages_constants_1.SUCCESS_MESSAGE]: success_messages_constants_1.SUCCESS_MESSAGE,
        };
        this.logger.log(`✏️ ${message}`, {
            updatedItem: data,
            changedFields: changedFields || [],
        });
        return response;
    }
    static createDeletionSuccessResponse(message, deletedId, deletedCount) {
        const response = this.createSuccessMessage(message);
        this.logger.log(`🗑️ ${message}`, {
            deletedId,
            deletedCount: deletedCount || 1,
        });
        return response;
    }
    static createToggleSuccessResponse(message, data, fieldName, newValue) {
        const response = {
            success: true,
            message,
            data,
            timestamp: date_helper_1.DateHelper.now(),
            [success_messages_constants_1.SUCCESS_MESSAGE]: success_messages_constants_1.SUCCESS_MESSAGE,
        };
        this.logger.log(`🔄 ${message}`, {
            fieldName,
            newValue,
            toggledItem: data,
        });
        return response;
    }
    static createSyncSuccessResponse(message, syncedCount, syncDetails) {
        const response = this.createSuccessMessage(message);
        this.logger.log(`🔄 ${message}`, {
            syncedCount,
            syncDetails,
        });
        return response;
    }
    static get MESSAGES() {
        return success_messages_constants_1.SUCCESS_MESSAGES;
    }
    static get SYMBOL() {
        return success_messages_constants_1.SUCCESS_MESSAGE;
    }
}
exports.SuccessMessageHelper = SuccessMessageHelper;
SuccessMessageHelper.logger = new common_1.Logger(SuccessMessageHelper.name);
//# sourceMappingURL=success-message.helper.js.map