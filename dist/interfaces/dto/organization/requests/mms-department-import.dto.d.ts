export declare class MMSDepartmentResponseDto {
    _id: string;
    department_name: string;
    department_code: string;
    manager_id: string | null;
    parent_department_id: string | null;
    created_at: string;
    updated_at: string;
    __v: number;
    child_departments: MMSDepartmentResponseDto[];
    id: string;
}
export declare class MMSWebhookRequestDto {
    event_type: string;
    entity_type: string;
    timestamp: string;
    payload: MMSDepartmentResponseDto;
}
