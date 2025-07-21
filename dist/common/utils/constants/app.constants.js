"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_CONSTANTS = void 0;
exports.APP_CONSTANTS = {
    API_VERSION: '1',
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    DATE_FORMAT: 'YYYY-MM-DD',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    ANNUAL_LEAVE: {
        MIN_YEAR: 2000,
        MAX_YEAR: 2100,
        MAX_DAYS_PER_YEAR: 365,
        DEFAULT_USED_DAYS: 0,
    },
    ATTENDANCE: {
        WORK_HOURS_PER_DAY: 8,
        WORK_DAYS_PER_WEEK: 5,
        BREAK_TIME_MINUTES: 60,
    },
    FILE_UPLOAD: {
        MAX_FILE_SIZE: 10 * 1024 * 1024,
        ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf', '.xlsx', '.xls'],
    },
    ERROR_CODES: {
        VALIDATION_ERROR: 'VALIDATION_ERROR',
        NOT_FOUND: 'NOT_FOUND',
        UNAUTHORIZED: 'UNAUTHORIZED',
        FORBIDDEN: 'FORBIDDEN',
        CONFLICT: 'CONFLICT',
        INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    },
    MESSAGES: {
        SUCCESS: {
            CREATED: '성공적으로 생성되었습니다.',
            UPDATED: '성공적으로 수정되었습니다.',
            DELETED: '성공적으로 삭제되었습니다.',
        },
        ERROR: {
            NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
            UNAUTHORIZED: '인증이 필요합니다.',
            FORBIDDEN: '접근 권한이 없습니다.',
            VALIDATION_FAILED: '입력 데이터 검증에 실패했습니다.',
            INTERNAL_SERVER_ERROR: '서버 내부 오류가 발생했습니다.',
        },
    },
};
//# sourceMappingURL=app.constants.js.map