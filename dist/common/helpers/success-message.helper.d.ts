import { SuccessMessageType } from '../constants/success-messages.constants';
export declare class SuccessMessageHelper {
    private static readonly logger;
    static createSuccessResponse<T = any>(message: SuccessMessageType, data?: T, meta?: any): {
        success: true;
        message: string;
        data?: T;
        meta?: any;
        timestamp: string;
    };
    static createSuccessMessage(message: SuccessMessageType): {
        success: true;
        message: string;
        timestamp: string;
    };
    static createPaginatedSuccessResponse<T>(message: SuccessMessageType, data: T[], meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }): {
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
    };
    static createRetrievalSuccessResponse<T>(message: SuccessMessageType, data: T, count?: number): {
        success: true;
        message: string;
        data: T;
        timestamp: string;
    };
    static createCreationSuccessResponse<T>(message: SuccessMessageType, data: T): {
        success: true;
        message: string;
        data: T;
        timestamp: string;
    };
    static createUpdateSuccessResponse<T>(message: SuccessMessageType, data: T, changedFields?: string[]): {
        success: true;
        message: string;
        data: T;
        timestamp: string;
    };
    static createDeletionSuccessResponse(message: SuccessMessageType, deletedId?: string, deletedCount?: number): {
        success: true;
        message: string;
        timestamp: string;
    };
    static createToggleSuccessResponse<T>(message: SuccessMessageType, data: T, fieldName: string, newValue: boolean): {
        success: true;
        message: string;
        data: T;
        timestamp: string;
    };
    static createSyncSuccessResponse(message: SuccessMessageType, syncedCount?: number, syncDetails?: any): {
        success: true;
        message: string;
        timestamp: string;
    };
    static get MESSAGES(): any;
    static get SYMBOL(): any;
}
