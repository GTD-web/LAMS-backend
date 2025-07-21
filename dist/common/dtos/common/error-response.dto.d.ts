export declare class ErrorResponseDto {
    readonly statusCode: number;
    readonly message: string;
    readonly details?: string[];
    readonly timestamp: string;
    readonly path: string;
    readonly errorCode?: string;
}
