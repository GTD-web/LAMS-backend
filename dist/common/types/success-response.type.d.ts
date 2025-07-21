import { SUCCESS_MESSAGE } from '../constants/success-messages.constants';
export interface BaseSuccessResponse {
    success: true;
    message: string;
    timestamp: string;
    [SUCCESS_MESSAGE]: symbol;
}
export interface SuccessResponseWithData<T> extends BaseSuccessResponse {
    data: T;
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface PaginatedSuccessResponse<T> extends BaseSuccessResponse {
    data: T[];
    meta: PaginationMeta;
}
export interface SyncSuccessResponse extends BaseSuccessResponse {
}
export type SuccessResponse<T = any> = BaseSuccessResponse | SuccessResponseWithData<T> | PaginatedSuccessResponse<T> | SyncSuccessResponse;
