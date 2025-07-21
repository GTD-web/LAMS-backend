export declare class PaginationMetaDto {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
    constructor(page: number, limit: number, total: number);
}
export declare class PaginatedResponseDto<T> {
    readonly data: T[];
    readonly meta: PaginationMetaDto;
    constructor(data: T[], meta: PaginationMetaDto);
    static create<T>(data: T[], page: number, limit: number, total: number): PaginatedResponseDto<T>;
}
