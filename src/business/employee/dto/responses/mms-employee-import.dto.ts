import { ApiProperty } from '@nestjs/swagger';

export class MMSEmployeeResponseDto {
    @ApiProperty({ description: '직원 ID', example: '67d116b591e5366c327915d2' })
    id: string;

    @ApiProperty({ description: '사번', example: '24020' })
    employee_number: string;

    @ApiProperty({ description: '이름', example: '구석현' })
    name: string;

    @ApiProperty({ description: '이메일', example: 'koo.sukhyun@lumir.space' })
    email: string;

    @ApiProperty({ description: '전화번호', example: '010-1234-5678' })
    phone_number: string;

    @ApiProperty({ description: '생년월일', example: '1980-07-04T00:00:00.000Z' })
    date_of_birth: string;

    @ApiProperty({ description: '성별', example: 'MALE' })
    gender: string;

    @ApiProperty({ description: '입사일', example: '2024-05-21T00:00:00.000Z' })
    hire_date: string;

    @ApiProperty({ description: '퇴사일', example: '2024-05-21T00:00:00.000Z' })
    termination_date: string;

    @ApiProperty({ description: '재직 상태', example: '재직중' })
    status: string;

    @ApiProperty({ description: '부서', example: '대표이사' })
    department: {
        _id: string;
        department_name: string;
        department_code: string;
    };

    @ApiProperty({ description: '직위', example: '대표이사' })
    position: {
        _id: string;
        position_title: string;
        position_code: string;
        level: number;
    };

    @ApiProperty({ description: '직급', example: '대표이사' })
    rank: {
        _id: string;
        rank_name: string;
        rank_code: string;
        level: number;
    };
}

export class MMSWebhookRequestDto {
    @ApiProperty({ description: '이벤트 타입', example: 'employee.updated' })
    event_type: string;

    @ApiProperty({ description: '엔티티 타입', example: 'employee' })
    entity_type: string;

    @ApiProperty({ description: '타임스탬프', example: '2025-04-29T02:11:51.794Z' })
    timestamp: string;

    @ApiProperty({ description: '페이로드' })
    payload: MMSEmployeeResponseDto;
}
