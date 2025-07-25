/**
 * MMS 직원 데이터 인터페이스
 * - 도메인 계층에서 사용하는 MMS 직원 데이터 구조
 * - 외부 시스템 의존성을 줄이기 위한 추상화
 */
export interface MMSEmployeeData {
    employee_number: string;
    name: string;
    email: string;
    hire_date: string;
    termination_date?: string;
    date_of_birth?: string;
    department: {
        _id: string;
        department_name: string;
        department_code: string;
    };
}
