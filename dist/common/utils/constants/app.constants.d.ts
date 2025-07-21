export declare const APP_CONSTANTS: {
    readonly API_VERSION: "1";
    readonly DEFAULT_PAGE_SIZE: 10;
    readonly MAX_PAGE_SIZE: 100;
    readonly DATE_FORMAT: "YYYY-MM-DD";
    readonly DATETIME_FORMAT: "YYYY-MM-DD HH:mm:ss";
    readonly ANNUAL_LEAVE: {
        readonly MIN_YEAR: 2000;
        readonly MAX_YEAR: 2100;
        readonly MAX_DAYS_PER_YEAR: 365;
        readonly DEFAULT_USED_DAYS: 0;
    };
    readonly ATTENDANCE: {
        readonly WORK_HOURS_PER_DAY: 8;
        readonly WORK_DAYS_PER_WEEK: 5;
        readonly BREAK_TIME_MINUTES: 60;
    };
    readonly FILE_UPLOAD: {
        readonly MAX_FILE_SIZE: number;
        readonly ALLOWED_EXTENSIONS: readonly [".jpg", ".jpeg", ".png", ".pdf", ".xlsx", ".xls"];
    };
    readonly ERROR_CODES: {
        readonly VALIDATION_ERROR: "VALIDATION_ERROR";
        readonly NOT_FOUND: "NOT_FOUND";
        readonly UNAUTHORIZED: "UNAUTHORIZED";
        readonly FORBIDDEN: "FORBIDDEN";
        readonly CONFLICT: "CONFLICT";
        readonly INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR";
    };
    readonly MESSAGES: {
        readonly SUCCESS: {
            readonly CREATED: "성공적으로 생성되었습니다.";
            readonly UPDATED: "성공적으로 수정되었습니다.";
            readonly DELETED: "성공적으로 삭제되었습니다.";
        };
        readonly ERROR: {
            readonly NOT_FOUND: "요청한 리소스를 찾을 수 없습니다.";
            readonly UNAUTHORIZED: "인증이 필요합니다.";
            readonly FORBIDDEN: "접근 권한이 없습니다.";
            readonly VALIDATION_FAILED: "입력 데이터 검증에 실패했습니다.";
            readonly INTERNAL_SERVER_ERROR: "서버 내부 오류가 발생했습니다.";
        };
    };
};
