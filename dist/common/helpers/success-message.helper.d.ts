import { SUCCESS_MESSAGE, SuccessMessageType } from '../constants/success-messages.constants';
export declare class SuccessMessageHelper {
    private static readonly logger;
    static createSuccessResponse<T = any>(message: SuccessMessageType, data?: T, meta?: any): {
        success: true;
        message: string;
        data?: T;
        meta?: any;
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
    };
    static createSuccessMessage(message: SuccessMessageType): {
        success: true;
        message: string;
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
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
        [SUCCESS_MESSAGE]: symbol;
    };
    static createRetrievalSuccessResponse<T>(message: SuccessMessageType, data: T, count?: number): {
        success: true;
        message: string;
        data: T;
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
    };
    static createCreationSuccessResponse<T>(message: SuccessMessageType, data: T): {
        success: true;
        message: string;
        data: T;
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
    };
    static createUpdateSuccessResponse<T>(message: SuccessMessageType, data: T, changedFields?: string[]): {
        success: true;
        message: string;
        data: T;
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
    };
    static createDeletionSuccessResponse(message: SuccessMessageType, deletedId?: string, deletedCount?: number): {
        success: true;
        message: string;
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
    };
    static createToggleSuccessResponse<T>(message: SuccessMessageType, data: T, fieldName: string, newValue: boolean): {
        success: true;
        message: string;
        data: T;
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
    };
    static createSyncSuccessResponse(message: SuccessMessageType, syncedCount?: number, syncDetails?: any): {
        success: true;
        message: string;
        timestamp: string;
        [SUCCESS_MESSAGE]: symbol;
    };
    static get MESSAGES(): {
        readonly USER_CREATED: "사용자가 성공적으로 생성되었습니다.";
        readonly USER_UPDATED: "사용자 정보가 성공적으로 수정되었습니다.";
        readonly USER_DELETED: "사용자가 성공적으로 삭제되었습니다.";
        readonly USER_PROFILE_RETRIEVED: "사용자 프로필이 성공적으로 조회되었습니다.";
        readonly USER_LIST_RETRIEVED: "사용자 목록이 성공적으로 조회되었습니다.";
        readonly USER_SEARCHED: "사용자 검색이 성공적으로 완료되었습니다.";
        readonly DEPARTMENT_AUTHORITY_UPDATED: "부서 권한이 성공적으로 변경되었습니다.";
        readonly DEPARTMENT_CREATED: "부서가 성공적으로 생성되었습니다.";
        readonly DEPARTMENT_UPDATED: "부서 정보가 성공적으로 수정되었습니다.";
        readonly DEPARTMENT_DELETED: "부서가 성공적으로 삭제되었습니다.";
        readonly DEPARTMENT_LIST_RETRIEVED: "부서 목록이 성공적으로 조회되었습니다.";
        readonly DEPARTMENT_EXCLUSION_TOGGLED: "부서 제외 여부가 성공적으로 변경되었습니다.";
        readonly EMPLOYEE_CREATED: "직원이 성공적으로 생성되었습니다.";
        readonly EMPLOYEE_UPDATED: "직원 정보가 성공적으로 수정되었습니다.";
        readonly EMPLOYEE_DELETED: "직원이 성공적으로 삭제되었습니다.";
        readonly EMPLOYEE_LIST_RETRIEVED: "직원 목록이 성공적으로 조회되었습니다.";
        readonly EMPLOYEE_EXCLUSION_TOGGLED: "직원 제외 여부가 성공적으로 변경되었습니다.";
        readonly ORGANIZATION_SYNCED: "조직 동기화가 성공적으로 완료되었습니다.";
        readonly ORGANIZATION_CHART_RETRIEVED: "조직도가 성공적으로 조회되었습니다.";
        readonly LOGIN_SUCCESS: "로그인이 성공적으로 완료되었습니다.";
        readonly LOGOUT_SUCCESS: "로그아웃이 성공적으로 완료되었습니다.";
        readonly PASSWORD_CHANGED: "비밀번호가 성공적으로 변경되었습니다.";
        readonly TOKEN_REFRESHED: "토큰이 성공적으로 갱신되었습니다.";
        readonly REQUEST_SUCCESS: "요청이 성공적으로 처리되었습니다.";
        readonly DATA_RETRIEVED: "데이터가 성공적으로 조회되었습니다.";
        readonly DATA_SAVED: "데이터가 성공적으로 저장되었습니다.";
        readonly DATA_UPDATED: "데이터가 성공적으로 수정되었습니다.";
        readonly DATA_DELETED: "데이터가 성공적으로 삭제되었습니다.";
    };
    static get SYMBOL(): symbol;
}
