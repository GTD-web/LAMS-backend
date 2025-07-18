export interface PaginationMeta {
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    timestamp: string;
    data: T;
    meta?: PaginationMeta | Record<string, any>; // 메타 데이터
}
