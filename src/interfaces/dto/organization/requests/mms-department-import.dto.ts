import { ApiProperty } from '@nestjs/swagger';

export class MMSDepartmentResponseDto {
    @ApiProperty({ description: '부서ID', example: '67d0f0a79af04fc1b2f65ab1' })
    _id: string;

    @ApiProperty({ description: '부서명', example: '루미르주식회사' })
    department_name: string;

    @ApiProperty({ description: '부서코드', example: '루미르' })
    department_code: string;

    @ApiProperty({ description: '관리자 ID', example: null })
    manager_id: string | null;

    @ApiProperty({ description: '상위 부서ID', example: null })
    parent_department_id: string | null;

    @ApiProperty({ description: '생성일', example: '2025-03-12T02:25:43.837Z' })
    created_at: string;

    @ApiProperty({ description: '수정일', example: '2025-04-01T09:13:11.654Z' })
    updated_at: string;

    @ApiProperty({ description: '버전', example: 0 })
    __v: number;

    @ApiProperty({ description: '하위 부서목록', type: [MMSDepartmentResponseDto] })
    child_departments: MMSDepartmentResponseDto[];

    @ApiProperty({ description: '부서ID', example: '67d0f0a79af04fc1b2f65ab1' })
    id: string;
}

export class MMSWebhookRequestDto {
    @ApiProperty({ description: '이벤트 타입', example: 'employee.updated' })
    event_type: string;

    @ApiProperty({ description: '엔티티 타입', example: 'employee' })
    entity_type: string;

    @ApiProperty({ description: '타임스탬프', example: '2025-04-29T02:11:51.794Z' })
    timestamp: string;

    @ApiProperty({ description: '페이로드' })
    payload: MMSDepartmentResponseDto;
}
