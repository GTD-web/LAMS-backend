import { Logger } from '@nestjs/common';
import { SUCCESS_MESSAGE, SUCCESS_MESSAGES, SuccessMessageType } from '../constants/success-messages.constants';

/**
 * 성공 메시지 헬퍼
 * - 성공 메시지를 일관된 형태로 처리
 * - 로깅 및 응답 생성 기능 제공
 */
export class SuccessMessageHelper {
    private static readonly logger = new Logger(SuccessMessageHelper.name);

    /**
     * 성공 응답 객체 생성
     */
    static createSuccessResponse<T = any>(
        message: SuccessMessageType,
        data?: T,
        meta?: any,
    ): {
        success: true;
        message: string;
        data?: T;
        meta?: any;
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
    } {
        const response = {
            success: true as const,
            message,
            timestamp: new Date().toISOString(),
            [SUCCESS_MESSAGE]: SUCCESS_MESSAGE,
            ...(data !== undefined && { data }),
            ...(meta && { meta }),
        };

        // 성공 로그 출력
        this.logger.log(`✅ ${message}`, {
            hasData: data !== undefined,
            hasMeta: meta !== undefined,
            timestamp: response.timestamp,
        });

        return response;
    }

    /**
     * 성공 메시지만 반환 (데이터 없음)
     */
    static createSuccessMessage(message: SuccessMessageType): {
        success: true;
        message: string;
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
    } {
        return this.createSuccessResponse(message);
    }

    /**
     * 페이지네이션 성공 응답 생성
     */
    static createPaginatedSuccessResponse<T>(
        message: SuccessMessageType,
        data: T[],
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        },
    ): {
        success: true;
        message: string;
        data: T[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
    } {
        const response = {
            success: true as const,
            message,
            data,
            meta,
            timestamp: new Date().toISOString(),
            [SUCCESS_MESSAGE]: SUCCESS_MESSAGE,
        };

        // 페이지네이션 로그 출력
        this.logger.log(`📄 ${message}`, {
            itemCount: data.length,
            page: meta.page,
            limit: meta.limit,
            total: meta.total,
            totalPages: meta.totalPages,
        });

        return response;
    }

    /**
     * 조회 성공 응답 생성
     */
    static createRetrievalSuccessResponse<T>(
        message: SuccessMessageType,
        data: T,
        count?: number,
    ): {
        success: true;
        message: string;
        data: T;
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
    } {
        const response = {
            success: true as const,
            message,
            data,
            timestamp: new Date().toISOString(),
            [SUCCESS_MESSAGE]: SUCCESS_MESSAGE,
        };

        // 조회 로그 출력
        this.logger.log(`🔍 ${message}`, {
            dataType: typeof data,
            isArray: Array.isArray(data),
            count: count || (Array.isArray(data) ? data.length : 1),
        });

        return response;
    }

    /**
     * 생성 성공 응답 생성
     */
    static createCreationSuccessResponse<T>(
        message: SuccessMessageType,
        data: T,
    ): {
        success: true;
        message: string;
        data: T;
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
    } {
        const response = {
            success: true as const,
            message,
            data,
            timestamp: new Date().toISOString(),
            [SUCCESS_MESSAGE]: SUCCESS_MESSAGE,
        };

        // 생성 로그 출력
        this.logger.log(`➕ ${message}`, {
            createdItem: data,
        });

        return response;
    }

    /**
     * 수정 성공 응답 생성
     */
    static createUpdateSuccessResponse<T>(
        message: SuccessMessageType,
        data: T,
        changedFields?: string[],
    ): {
        success: true;
        message: string;
        data: T;
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
    } {
        const response = {
            success: true as const,
            message,
            data,
            timestamp: new Date().toISOString(),
            [SUCCESS_MESSAGE]: SUCCESS_MESSAGE,
        };

        // 수정 로그 출력
        this.logger.log(`✏️ ${message}`, {
            updatedItem: data,
            changedFields: changedFields || [],
        });

        return response;
    }

    /**
     * 삭제 성공 응답 생성
     */
    static createDeletionSuccessResponse(
        message: SuccessMessageType,
        deletedId?: string,
        deletedCount?: number,
    ): {
        success: true;
        message: string;
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
    } {
        const response = this.createSuccessMessage(message);

        // 삭제 로그 출력
        this.logger.log(`🗑️ ${message}`, {
            deletedId,
            deletedCount: deletedCount || 1,
        });

        return response;
    }

    /**
     * 토글 성공 응답 생성
     */
    static createToggleSuccessResponse<T>(
        message: SuccessMessageType,
        data: T,
        fieldName: string,
        newValue: boolean,
    ): {
        success: true;
        message: string;
        data: T;
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
    } {
        const response = {
            success: true as const,
            message,
            data,
            timestamp: new Date().toISOString(),
            [SUCCESS_MESSAGE]: SUCCESS_MESSAGE,
        };

        // 토글 로그 출력
        this.logger.log(`🔄 ${message}`, {
            fieldName,
            newValue,
            toggledItem: data,
        });

        return response;
    }

    /**
     * 동기화 성공 응답 생성
     */
    static createSyncSuccessResponse(
        message: SuccessMessageType,
        syncedCount?: number,
        syncDetails?: any,
    ): {
        success: true;
        message: string;
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
    } {
        const response = this.createSuccessMessage(message);

        // 동기화 로그 출력
        this.logger.log(`🔄 ${message}`, {
            syncedCount,
            syncDetails,
        });

        return response;
    }

    /**
     * 성공 메시지 상수 접근자
     */
    static get MESSAGES() {
        return SUCCESS_MESSAGES;
    }

    /**
     * 성공 메시지 심볼 접근자
     */
    static get SYMBOL() {
        return SUCCESS_MESSAGE;
    }
}
