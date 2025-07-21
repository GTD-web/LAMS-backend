export declare class MMSEmployeeResponseDto {
    id: string;
    employee_number: string;
    name: string;
    email: string;
    phone_number: string;
    date_of_birth: string;
    gender: string;
    hire_date: string;
    termination_date: string;
    status: string;
    department: {
        _id: string;
        department_name: string;
        department_code: string;
    };
    position: {
        _id: string;
        position_title: string;
        position_code: string;
        level: number;
    };
    rank: {
        _id: string;
        rank_name: string;
        rank_code: string;
        level: number;
    };
}
export declare class MMSWebhookRequestDto {
    event_type: string;
    entity_type: string;
    timestamp: string;
    payload: MMSEmployeeResponseDto;
}
