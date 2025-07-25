/**
 * 직원 검색 옵션 인터페이스
 */
export interface EmployeeSearchOptions {
    /** 퇴사자 제외 여부 */
    status?: 'active' | 'resigned' | 'all';
    /** 계산에서 제외된 직원 제외 여부 */
    excludeFromCalculation?: boolean;
}
