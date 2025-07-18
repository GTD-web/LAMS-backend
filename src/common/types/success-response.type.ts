import { SUCCESS_MESSAGE, SuccessMessageType } from '../constants/success-messages.constants';

/**
 * 기본 성공 응답 타입
 */
export interface BaseSuccessResponse {
    success: true;
    message: string;
    timestamp: string;
    [SUCCESS_MESSAGE]: symbol;
}

/**
 * 데이터가 포함된 성공 응답 타입
 */
export interface SuccessResponseWithData<T> extends BaseSuccessResponse {
    data: T;
}

/**
 * 페이지네이션 메타데이터 타입
 */
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

/**
 * 페이지네이션 성공 응답 타입
 */
export interface PaginatedSuccessResponse<T> extends BaseSuccessResponse {
    data: T[];
    meta: PaginationMeta;
}

/**
 * 동기화 성공 응답 타입
 */
export interface SyncSuccessResponse extends BaseSuccessResponse {
    // 추가 필드가 필요하면 여기에 추가
}

/**
 * 성공 응답 타입 유니온
 */
export type SuccessResponse<T = any> =
    | BaseSuccessResponse
    | SuccessResponseWithData<T>
    | PaginatedSuccessResponse<T>
    | SyncSuccessResponse;
