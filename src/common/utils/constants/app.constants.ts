export const APP_CONSTANTS = {
  // API 버전
  API_VERSION: '1',

  // ?�이지?�이??기본�?
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // ?�짜 ?�식
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',

  // ?�차 관???�수
  ANNUAL_LEAVE: {
    MIN_YEAR: 2000,
    MAX_YEAR: 2100,
    MAX_DAYS_PER_YEAR: 365,
    DEFAULT_USED_DAYS: 0,
  },

  // 출근 관???�수
  ATTENDANCE: {
    WORK_HOURS_PER_DAY: 8,
    WORK_DAYS_PER_WEEK: 5,
    BREAK_TIME_MINUTES: 60,
  },

  // ?�일 ?�로??관???�수
  FILE_UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf', '.xlsx', '.xls'],
  },

  // ?�러 코드
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    CONFLICT: 'CONFLICT',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  },

  // 메시지
  MESSAGES: {
    SUCCESS: {
      CREATED: '?�공?�으�??�성?�었?�니??',
      UPDATED: '?�공?�으�??�정?�었?�니??',
      DELETED: '?�공?�으�???��?�었?�니??',
    },
    ERROR: {
      NOT_FOUND: '?�청??리소?��? 찾을 ???�습?�다.',
      UNAUTHORIZED: '?�증???�요?�니??',
      FORBIDDEN: '?�근 권한???�습?�다.',
      VALIDATION_FAILED: '?�력 ?�이??검증에 ?�패?�습?�다.',
      INTERNAL_SERVER_ERROR: '?�버 ?��? ?�류가 발생?�습?�다.',
    },
  },
} as const;
